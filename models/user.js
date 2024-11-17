
const mongoose = require("mongoose");

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true, trim: true },  // Bắt buộc phải có số điện thoại
  password: { type: String, required: true },  // Bắt buộc phải có mật khẩu
  name: { type: String, trim: true, default: null },  // Không bắt buộc, có thể cập nhật sau
  email: { type: String, unique: false, sparse: true, default: null},  // Chỉ cho phép một bản ghi với email cụ thể
  date: { type: Date, default: Date.now },
  birthDate: { type: Date, default: null }, 
  role: { type: String, enum: ["user", "cashier", "admin"], default: "user" },
  loyaltyPoints: { type: Number, default: 0 },
  status: { type: Boolean, default: true },
  deviceTokens: { type: String, default: null },
});

// Tạo model từ schema
const User = mongoose.model("User", userSchema);

module.exports = User;
