const mongoose = require("mongoose");

// Định nghĩa schema cho Banner
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, unique: true, trim: true },
  email: { type: String, unique: true, trim: true, lowercase: true},
  date: {  type: Date, default: Date.now },
  role: { type: String, enum: ["user", "cashier", "admin"], default: "user" },
  loyaltyPoints: { type: Number, default: 0 },
  password: {type: String },
  status: { type: Boolean, default: true },
  deviceTokens: { type: String, default: null },
});

// Tạo model từ schema
const User = mongoose.model("User", userSchema);

module.exports = User;
