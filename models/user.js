const mongoose = require("mongoose");

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true, trim: true },  // Bắt buộc phải có số điện thoại
  password: { type: String, required: true },  // Bắt buộc phải có mật khẩu
  name: { type: String, trim: true, default: null },  // Không bắt buộc, có thể cập nhật sau
  role: { type: String, enum: ["user", "admin"], default: "user" },
  loyaltyPoints: { type: Number, default: 0 },
  status: { type: Boolean, default: true },
  location: {
    province: { type: String, required: true, trim: true }, // Tỉnh/Thành phố
    district: { type: String, required: true, trim: true }, // Quận/Huyện
    commune: { type: String, required: true, trim: true },     // Xã/Thị trấn
    street: { type: String, required: false, trim: true },  // Tòa nhà/Tên đường (không bắt buộc)
  },
  deviceTokens: { type: String, default: null },
  isLocked: {
    type: Boolean,
    default: false
  }
});

// Tạo model từ schema
const User = mongoose.model("User", userSchema);

module.exports = User;