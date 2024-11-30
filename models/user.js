
const mongoose = require("mongoose");

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true, trim: true },  // Bắt buộc phải có số điện thoại
  password: { type: String, required: true },  // Bắt buộc phải có mật khẩu
  name: { type: String, trim: true, default: null },  // Không bắt buộc, có thể cập nhật sau
  email: { type: String, unique: true, sparse: true, trim: true, default: null }, // Email không bắt buộc
  role: { type: String, enum: ["user", "admin"], default: "user" },
  loyaltyPoints: { type: Number, default: 0 },
  status: { type: Boolean, default: true },
  deviceTokens: { type: String, default: null },
  isLocked: {
    type: Boolean,
    default: false
  },
  otp: { type: String, default: null }, // Trường lưu mã OTP
  otpExpiration: { type: Date, default: null } // Trường lưu thời gian hết hạn
});
  
// Tạo model từ schema
const User = mongoose.model("User", userSchema);

module.exports = User;