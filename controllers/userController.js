exports.loginPhone = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^(\+84|0)\d{9}$/;
    if (!phone.match(phoneRegex)) {
      return res.status(400).json({ message: "Số điện thoại không hợp lệ!" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "Số điện thoại hoặc mật khẩu không chính xác!" });
    }

    // Kiểm tra mật khẩu đã mã hóa
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Số điện thoại hoặc mật khẩu không chính xác!" });
    }

    // Tạo JWT token sau khi đăng nhập thành công
    const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: "1d" });
    const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: "7d" });

    // Không bao gồm mật khẩu trong phản hồi
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      image: user.image,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints,
      status: user.status,
      deviceTokens: user.deviceTokens,
    };

    // Trả về thông tin người dùng và token
    return res.status(200).json({
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