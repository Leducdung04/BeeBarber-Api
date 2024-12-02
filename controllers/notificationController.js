const Notification = require("../models/notifications");
const User = require("../models/user");
const { GoogleAuth } = require('google-auth-library');
const schedule = require("node-schedule");
const { fromZonedTime, toDate } = require('date-fns-tz');
let rule = new schedule.RecurrenceRule();

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
    const { user_id, status } = req.query;

    const filter = { user_id };

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
    const { user_id, relates_id, type, content, schedule } = req.body;

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
    res.status(200).json({ message: "Thông báo đã được tạo và gửi thành công", notification: newNotification });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error });
  }
};


exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'read' && status !== 'unread') {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const notificationExists = await Notification.findById(id);
    if (!notificationExists) {
      return res.status(404).json({ message: "Không tìm thấy thông báo" });
    }

    notificationExists.status = status;
    notificationExists.updated_at = Date.now();

    await notificationExists.save();

    res.status(200).json({
      message: "Thông báo đã được cập nhật",
      notification: notificationExists,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error });
  }
};


exports.getNotificationsByUserId = async (req, res, next) => {
  try {
    const { user_id } = req.params; // Lấy user_id từ params

    // Tìm tất cả thông báo theo user_id
    const notifications = await Notification.find({ user_id })
      .sort({ created_at: -1 }); // Sắp xếp giảm dần theo thời gian tạo

    // Kiểm tra nếu không có thông báo nào
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found for this user.' });
    }

    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createScheduleNotification = async (req, res) => {
  try {
    const { user_id, relates_id, type, content, schedule: scheduleTime } = req.body;
    console.log("Received schedule request with data:", req.body);

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).json({ message: "Người dùng không hợp lệ" });
    }

    const newNotification = new Notification({
      user_id,
      relates_id,
      type,
      content,
      schedule: scheduleTime,
      status: "unread",
    });

    await newNotification.save();

    if (scheduleTime) {
      const utcDate = new Date(scheduleTime); 
      if (isNaN(utcDate.getTime())) {
        console.error("Invalid scheduleTime:", scheduleTime);
        return res.status(400).json({ message: "Invalid schedule time." });
      }

      if (utcDate <= new Date()) {
        console.error("Cannot schedule notification in the past:", utcDate);
        return res.status(400).json({ message: "Schedule time must be in the future." });
      }
      schedule.scheduleJob(newNotification._id.toString(), testDate, async () => {
        const token = await getBearerToken();
        const fcmUrl = `https://fcm.googleapis.com/v1/projects/beebarber-3a718/messages:send`;
        const message = {
          message: {
            token: user.deviceTokens,
            notification: {
              title: "Thông báo đặt lịch",
              body: content,
            },
            data: {
              relates_id,
              type,
              content,
            },
          },
        };
        console.log("Message",message);
        try {
          const response = await fetch(fcmUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
          });

          if (response.ok) {
            console.log(`Notification sent successfully: ${newNotification._id}`);
          } else {
            const errorResponse = await response.json();
            console.error("Error sending FCM notification:", errorResponse);
          }
        } catch (err) {
          console.error("Error during scheduled notification:", err);
        }
      });
    }

    res.status(200).json({
      message: "Thông báo được tạo và sẽ được gửi đi",
      notification: newNotification,
    });
  } catch (error) {
    console.error("Error creating scheduled notification:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

