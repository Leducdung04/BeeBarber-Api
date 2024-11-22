const Notification = require("../models/notifications");
const User = require("../models/user");
const { GoogleAuth } = require('google-auth-library');

const path = require('path');

const firebaseCredentialsPath = path.resolve(__dirname, "../config/beebarber-3a718-firebase-adminsdk-g3v02-8bb261896a.json");

async function getBearerToken() {
  const auth = new GoogleAuth({
    keyFile: firebaseCredentialsPath, 
    scopes: "https://www.googleapis.com/auth/firebase.messaging",
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
}

exports.getNotifications = async (req, res) => {
  try {
    const { user_id, relates_id, type, status } = req.query;

    const filter = { user_id }; 
    
    if (relates_id) {
      filter.relates_id = relates_id;
    }

    if (type) {
      filter.type = type;
    }

    if (status) {
      filter.status = status;
    }

    const notifications = await Notification.find(filter).sort({ created_at: -1 });

    res.status(200).json({
      message: "Danh sách thông báo",
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error });
  }
};




exports.createNotification = async (req, res) => {
  try {
    const { user_id, relates_id, type, content } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).json({ message: "Người dùng không hợp lệ" });
    }

    const newNotification = new Notification({
      user_id,
      relates_id,
      type,
      content,
      status: "unread", 
    });

    await newNotification.save();

    const token = await getBearerToken();

    const fcmUrl = `https://fcm.googleapis.com/v1/projects/beebarber-3a718/messages:send`; 
    const message = {
      message: {
        token: user.deviceTokens,
        notification: {
          title: "Thông báo mới", 
          body: content, 
        },
        data: {
          relates_id,
          type,
          content,
        },
      },
    };

    const response = await fetch(fcmUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error sending FCM notification:", errorResponse);
      return res.status(500).json({ message: "Gửi thông báo thất bại", error: errorResponse });
    }

    const result = await response.json();
    console.log("Notification sent successfully:", result);

    res.status(200).json({ message: "Thông báo đã được tạo và gửi thành công", notification: newNotification });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error });
  }
};


// Cập nhật thông báo
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { relates_id, type, content, status } = req.body;

    // Kiểm tra xem thông báo có tồn tại không
    const notificationExists = await Notification.findById(id);
    if (!notificationExists) {
      return res.status(404).json({ message: "Không tìm thấy thông báo" });
    }

    // Cập nhật các trường trong thông báo
    notificationExists.relates_id = relates_id || notificationExists.relates_id;
    notificationExists.type = type || notificationExists.type;
    notificationExists.content = content || notificationExists.content;
    notificationExists.status = status || notificationExists.status;
    notificationExists.updated_at = Date.now(); // Cập nhật thời gian sửa

    // Lưu thông báo đã sửa
    await notificationExists.save();

    res.status(200).json({ message: "Thông báo đã được cập nhật", notification: notificationExists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error });
  }
};
