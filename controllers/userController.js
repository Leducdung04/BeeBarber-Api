const User = require("../models/user");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRETKEY = "BeeBarber-Fpoly";
exports.loginPhone = async (req, res) => {
  try {
    const { phone, password, deviceTokens } = req.body;

    // Kiểm tra xem số điện thoại có được cung cấp không
    const user = await User.findOne({ phone });
    if (!user) {
      return res
        .status(210)
        .json({code:210, message: "Số điện thoại không tồn tại!" });
    }

    // Kiểm tra mật khẩu đã mã hóa
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(220)
        .json({code:220, message: "Số điện thoại hoặc mật khẩu không chính xác!" });
    }

    // Cập nhật deviceTokens nếu được cung cấp
    if (deviceTokens && deviceTokens !== user.deviceTokens) {
      user.deviceTokens = deviceTokens;
      await user.save(); // Lưu thay đổi vào cơ sở dữ liệu
    }

    // Tạo JWT token sau khi đăng nhập thành công
    const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: "1d" });
    const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, {
      expiresIn: "7d",
    });

    // Không bao gồm mật khẩu trong phản hồi
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints,
      status: user.status,
      deviceTokens:deviceTokens|| user.deviceTokens,
    };

    // Trả về thông tin người dùng và token
    return res.status(200).json({
      code:200,
      message: "Đăng nhập thành công",
      data: userWithoutPassword,
      token: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};



exports.SigupUser = async (req, res, next) => {
  try {
    const { phone, password, deviceTokens,name ,role} = req.body;

    // Kiểm tra nếu số điện thoại hoặc mật khẩu không được cung cấp
    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: "Số điện thoại và mật khẩu là bắt buộc" });
    }

    // Kiểm tra xem số điện thoại đã tồn tại chưa
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res
        .status(210)
        .json({ status:210,message: "Số điện thoại đã được đăng ký" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo mới người dùng
    const newUser = new User({
      name:name,
      phone:phone,
      role:role,
      password: hashedPassword,
      deviceTokens: deviceTokens || null,
    });

    // Lưu người dùng vào cơ sở dữ liệu
    const result = await newUser.save();

    // Tạo token truy cập và refresh
    const accessToken = JWT.sign({ id: result._id }, SECRETKEY, {
      expiresIn: "1d",
    });
    const refreshToken = JWT.sign({ id: result._id }, SECRETKEY, {
      expiresIn: "7d",
    });

    // Loại bỏ mật khẩu trước khi trả về dữ liệu
    const userWithoutPassword = {
      _id: result._id,
      name: result.name,
      loyaltyPoints: result.loyaltyPoints,
      phone: result.phone,
      email: result.email,
      deviceTokens: deviceTokens
    };

    // Trả về phản hồi
    res.status(200).json({
      status:200,
      message: "Đăng ký thành công",
      data: userWithoutPassword,
      token: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


exports.updateLoyaltyPoints = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID của người dùng từ params
    const { points } = req.body; // Số điểm cần cộng thêm từ body

    // Kiểm tra xem ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ!" });
    } // Tìm người dùng theo ID
    const user = await User.findById(id);

    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng với ID này!" });
    }

    // Cộng điểm mới vào điểm hiện tại
    user.loyaltyPoints = (user.loyaltyPoints || 0) + points;

    // Lưu lại người dùng sau khi cập nhật
    const updatedUser = await user.save();

    // Không bao gồm mật khẩu trong phản hồi
    const userWithoutPassword = {
      _id: updatedUser._id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      email: updatedUser.email,
      image: updatedUser.image,
      role: updatedUser.role,
      loyaltyPoints: updatedUser.loyaltyPoints,
      status: updatedUser.status,
      deviceTokens: updatedUser.deviceTokens,
    };

    // Trả về phản hồi với thông tin người dùng đã cập nhật
    res.status(200).json({
      status:200,
      message: "Cập nhật điểm thưởng thành công",
      data: userWithoutPassword,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

const mongoose = require("mongoose"); // Ensure this is at the top of your file

exports.getUserDetailById = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from the route parameters

    // Validate the user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ!" });
    }

    // Find the user by ID
    const user = await User.findById(id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng với ID này!" });
    }

    // Exclude the password field from the response
    const userData = {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      image: user.image,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints,
      status: user.status,
      location : user.location,
      deviceTokens: user.deviceTokens,
    };

    // Respond with the user's details
    return res.status(200).json({
      status: 200,
      message: "Lấy thông tin người dùng thành công",
      data: userData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
