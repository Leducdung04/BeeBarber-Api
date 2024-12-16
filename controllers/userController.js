const User = require("../models/user");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRETKEY = "BeeBarber-Fpoly";
const Transporter = require('../config/mail');

// Hàm tạo mã số ngẫu nhiên 6 chữ số
const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOtpToEmail = async (req, res) => {
  try {
      const { email } = req.body; // Lấy email từ request body

      // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ 
              status: 400, 
              messenger: "Email không tồn tại trong hệ thống!" 
          });
      }

      const randomCode = generateRandomCode(); // Tạo mã ngẫu nhiên

      const mailOptions = {
          from: "beebarber4@gmail.com", // Email gửi đi
          to: email, // Email nhận
          subject: "Mã xác thực của bạn", // Tiêu đề email
          text: `Mã xác thực của bạn là: ${randomCode}`, // Nội dung email
      };

      // Gửi email
      await Transporter.sendMail(mailOptions);

      // Lưu mã OTP và thời gian hết hạn vào cơ sở dữ liệu
      user.otp = randomCode; // Lưu mã OTP
      user.otpExpiration = Date.now() + 1 * 60 * 1000; // Hết hạn sau 1 phút
      await user.save();

      res.json({
          status: 200,
          code: randomCode,
          messenger: "Mã xác thực đã được gửi đến email của bạn.",
      });
  } catch (error) {
      console.log(error);
      res.json({
          status: 500,
          messenger: "Đã xảy ra lỗi khi gửi mã xác thực.",
          error: error.message
      });
  }
};
// xác thwucj otp
exports.verifyOtp = async (req, res) => {
  try {
      const { email, otp } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ status: 400, messenger: "Người dùng không tồn tại!" });
      }

      // Kiểm tra mã OTP
      const isOtpValid = user.otp === otp && user.otpExpiration > Date.now();
      if (isOtpValid) {
          // Xác thực thành công, có thể xóa OTP
          user.otp = null;
          user.otpExpiration = null;
          await user.save();
          return res.status(200).json({ status: 200, messenger: "Xác thực thành công!" });
      } else {
          return res.status(400).json({ status: 400, messenger: "Mã OTP không chính xác hoặc đã hết hạn!" });
      }
  } catch (error) {
      console.log(error);
      res.status(500).json({ status: 500, messenger: "Lỗi máy chủ", error: error.message });
  }
};

// Hàm đổi mật khẩu mà không cần nhập mật khẩu cũ
exports.updatePassword = async (req, res) => {
    try {
        const { email } = req.params; // Lấy email từ tham số URL
        const { newPassword } = req.body; // Lấy mật khẩu mới từ request body

        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 404, messenger: "Người dùng không tồn tại!" });
        }

        // Mã hóa mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword; // Cập nhật mật khẩu mới

        // Lưu thay đổi vào cơ sở dữ liệu
        await user.save();

        res.status(200).json({
            status: 200,
            messenger: "Mật khẩu đã được cập nhật thành công!",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, messenger: "Lỗi máy chủ", error: error.message });
    }
};

exports.updateUserById = async (req, res) => {
  try {
      const { id } = req.params; // Lấy ID từ params
      const { name, phone, email } = req.body; // Lấy thông tin từ request body

      // Tìm người dùng theo ID
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({
              status: 404,
              messenger: "Người dùng không tồn tại."
          });
      }

      // Cập nhật thông tin người dùng
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (email) user.email = email;

      await user.save(); // Lưu thay đổi vào cơ sở dữ liệu

      res.json({
          status: 200,
          messenger: "Thông tin người dùng đã được cập nhật.",
          user: {
              id: user._id,
              name: user.name,
              phone: user.phone,
              email: user.email
          }
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({
          status: 500,
          messenger: "Đã xảy ra lỗi khi cập nhật thông tin.",
          error: error.message
      });
  }
};

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
    const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: "7d" });

    // Không bao gồm mật khẩu trong phản hồi
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email:user.email,
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
    const { phone, password, deviceTokens, name, role, email } = req.body;

    // Kiểm tra nếu số điện thoại hoặc mật khẩu không được cung cấp
    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: "Số điện thoại và mật khẩu là bắt buộc" });
    }

    // Kiểm tra nếu email đã được cung cấp
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email là bắt buộc" });
    }

    // Kiểm tra xem số điện thoại đã tồn tại chưa
    const existingUserByPhone = await User.findOne({ phone });
    if (existingUserByPhone) {
      return res
        .status(210)
        .json({ status: 210, message: "Số điện thoại đã được đăng ký" });
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingUserByMail = await User.findOne({ email });
    if (existingUserByMail) {
      return res
        .status(210)
        .json({ status: 210, message: "Email đã được đăng ký" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo mới người dùng
    const newUser = new User({
      name: name || null,
      phone: phone,
      email: email,
      role: role || "user",
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
      deviceTokens: deviceTokens,
    };

    // Trả về phản hồi
    res.status(200).json({
      status: 200,
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
exports.getAllUser = async(req,res)=>{
  const users = await User.find()
  if(users){
    return res.json({message:"Get all user success", data: users})
  }else{
    return res.json({message: "Get all user failed"})
  }
}

exports.getAllCustomer = async(req,res,next) =>{
  const users = await User.find({ role: "user" })
  if(users){
    return res.json({message:"Get all user success", data: users})
  }else{
    return res.json({message: "Get all user failed"})
  }
}

exports.lockupUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isLocked = !user.isLocked;
    await user.save();
    res.status(200).json({ message: "User locked status updated", user });
  } catch (error) {
    console.error("Error updating user locked status:", error);
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
};
