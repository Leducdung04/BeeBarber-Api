const Notification = require("../models/notifications");  
const User = require("../models/user");                  

// Thêm thông báo mới
exports.createNotification = async (req, res) => {
  try {
    const { user_id, relates_id, type, content } = req.body;

    // Kiểm tra xem user_id có hợp lệ không
    const userExists = await User.findById(user_id);
    if (!userExists) {
      return res.status(400).json({ message: "Người dùng không hợp lệ" });
    }

    // Tạo mới thông báo
    const newNotification = new Notification({
      user_id,
      relates_id,
      type,
      content,
      status: "unread",  // Mặc định là chưa đọc
    });

    // Lưu vào cơ sở dữ liệu
    await newNotification.save();

    res.status(201).json({ message: "Thông báo đã được tạo thành công", notification: newNotification });
  } catch (error) {
    console.error(error);
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
