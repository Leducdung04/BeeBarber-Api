const mongoose = require("mongoose");

// Định nghĩa schema cho Notifications
const notificationSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",  // Liên kết với bảng User
    required: true 
  },
  type: { 
    type: String, 
    enum: ["review", "booking", "order"],
    required: true ,
    default: "order"
  },
  content: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["unread", "read"],  // Trạng thái đọc thông báo
    default: "unread" 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
});

// Tạo model từ schema
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
