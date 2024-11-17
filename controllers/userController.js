const User = require("../models/user");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRETKEY = "BeeBarber-Fpoly";

exports.loginEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không chính xác!" });
    }

    // Kiểm tra mật khẩu đã mã hóa
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không chính xác!" });
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

// exports.loginPhone = async (req, res) => {
//   try {
//     const { phone, password } = req.body;
//     const user = await User.findOne({ phone });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ message: "phone hoặc mật khẩu không chính xác!" });
//     }

//     // Kiểm tra mật khẩu đã mã hóa
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res
//         .status(400)
//         .json({ message: "phone hoặc mật khẩu không chính xác!" });
//     }
//     // Tạo JWT token sau khi đăng nhập thành công
//     const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: "1d" });
//     const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, {
//       expiresIn: "7d",
//     });

//     // Không bao gồm mật khẩu trong phản hồi
//     const userWithoutPassword = {
//       _id: user._id,
//       name: user.name,
//       phone: user.phone,
//       email: user.email,
//       image: user.image,
//       role: user.role,
//       loyaltyPoints: user.loyaltyPoints,
//       status: user.status,
//       deviceTokens: user.deviceTokens,
//     };

//     // Trả về thông tin người dùng và token
//     return res.status(200).json({
//       message: "Đăng nhập thành công",
//       data: userWithoutPassword,
//       token: token,
//       refreshToken: refreshToken,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Lỗi máy chủ" });
//   }
// };

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

// exports.SigupUser = async (req, res, next) => {
//   try {
//     const {
//       name,
//       phone,
//       email,
//       image,
//       role,
//       loyaltyPoints,
//       password,
//       status,
//       deviceTokens,
//     } = req.body;

//     // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
//     const hashedPassword = await bcrypt.hash(password, 10); // Sử dụng salt rounds là 10

//     // Tạo người dùng mới với mật khẩu đã mã hóa
//     const newUser = new User({
//       name,
//       phone,
//       email,
//       image,
//       role,
//       loyaltyPoints,
//       password: hashedPassword, // Mật khẩu mã hóa
//       status,
//       deviceTokens,
//     });

//     const result = await newUser.save();

//     // Tạo token sau khi đăng ký thành công
//     const accessToken = JWT.sign({ id: result._id }, SECRETKEY, {
//       expiresIn: "1d",
//     });
//     const refreshToken = JWT.sign({ id: result._id }, SECRETKEY, {
//       expiresIn: "7d",
//     });

//     const userWithoutPassword = {
//       _id: result._id,
//       name: result.name,
//       phone: result.phone,
//       email: result.email,
//       image: result.image,
//       role: result.role,
//       loyaltyPoints: result.loyaltyPoints,
//       status: result.status,
//       deviceTokens: result.deviceTokens,
//     };

//     // Trả về phản hồi với token và dữ liệu người dùng (không có password)
//     res.status(201).json({
//       status: 200,
//       message: "Đăng ký thành công",
//       data: userWithoutPassword,
//       token: accessToken,
//       refreshToken: refreshToken,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: "Server Error" });
//   }
// };

exports.SigupUser = async (req, res, next) => {
  try {
    const { phone, password, email } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Số điện thoại và mật khẩu là bắt buộc" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Số điện thoại đã được đăng ký" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      phone,
      password: hashedPassword,
      email: email || null // Chỉ thêm email nếu nó có giá trị
    });

    const result = await newUser.save();

    const accessToken = JWT.sign({ id: result._id }, SECRETKEY, { expiresIn: "1d" });
    const refreshToken = JWT.sign({ id: result._id }, SECRETKEY, { expiresIn: "7d" });

    const userWithoutPassword = {
      _id: result._id,
      phone: result.phone,
      email: result.email,
    };

    res.status(201).json({
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


exports.checkPhoneNumber = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Số điện thoại là bắt buộc" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(200).json({ registered: true }); // Trả về registered: true nếu có người dùng
    }

    res.status(200).json({ registered: false }); // Trả về registered: false nếu không có người dùng
  } catch (err) {
    console.error("Lỗi kiểm tra số điện thoại:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


exports.checkPhoneAndGetId = async (req, res, next) => {
  try {
    const { phone } = req.body;

    // Kiểm tra xem số điện thoại có được nhập hay không
    if (!phone) {
      return res.status(400).json({ message: "Số điện thoại là bắt buộc" });
    }

    // Tìm kiếm người dùng trong cơ sở dữ liệu
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      // Nếu tìm thấy người dùng, trả về ID của họ
      return res.status(200).json({
        registered: true,
        userId: existingUser._id // Trả về ID người dùng
      });
    }

    // Nếu không tìm thấy người dùng, trả về thông tin tương ứng
    res.status(200).json({ registered: false });
  } catch (err) {
    console.error("Lỗi kiểm tra số điện thoại:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Chuyển đổi thông tin người dùng thành định dạng mà bạn muốn
      const userWithoutPassword = {
          _id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          birthDate: user.birthDate ? user.birthDate.toISOString().split('T')[0] : null, // Chuyển đổi thành định dạng YYYY-MM-DD
          role: user.role,
          loyaltyPoints: user.loyaltyPoints,
          status: user.status,
          deviceTokens: user.deviceTokens,
      };

      res.status(200).json(userWithoutPassword); // Trả về thông tin người dùng đã chuyển đổi
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params; // Lấy ID từ params
    const {
      name,
      phone,
      email,
      birthDate, // Thêm trường birthDate
      role,
      loyaltyPoints,
      password,
      status,
      deviceTokens,
    } = req.body;

    // Tìm người dùng theo ID
    const user = await User.findById(id);

    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng với ID này!" });
    }

    // Cập nhật thông tin người dùng
    user.name = name !== undefined ? name : user.name;
    user.phone = phone !== undefined ? phone : user.phone;
    user.email = email !== undefined ? email : user.email;
    user.birthDate = birthDate !== undefined ? birthDate : user.birthDate; // Cập nhật trường birthDate
    user.role = role !== undefined ? role : user.role;
    user.loyaltyPoints =
      loyaltyPoints !== undefined ? loyaltyPoints : user.loyaltyPoints;
    user.status = status !== undefined ? status : user.status; // Đảm bảo `status` được cập nhật
    user.deviceTokens =
      deviceTokens !== undefined ? deviceTokens : user.deviceTokens;

    // Kiểm tra nếu có mật khẩu mới thì mã hóa và cập nhật
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Mã hóa mật khẩu mới
      user.password = hashedPassword;
    }

    // Lưu người dùng sau khi cập nhật
    const updatedUser = await user.save();

    // Không bao gồm mật khẩu trong phản hồi
    const userWithoutPassword = {
      _id: updatedUser._id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      email: updatedUser.email,
      birthDate: updatedUser.birthDate ? updatedUser.birthDate.toISOString().split('T')[0] : null, // Đảm bảo rằng giá trị là dạng date
      role: updatedUser.role,      role: updatedUser.role,
      loyaltyPoints: updatedUser.loyaltyPoints,
      status: updatedUser.status,
      deviceTokens: updatedUser.deviceTokens,
    };

    // Trả về phản hồi với dữ liệu người dùng đã cập nhật
    res.status(200).json({
      message: "Cập nhật người dùng thành công",
      data: userWithoutPassword,
      
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};


exports.updateLoyaltyPoints = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID của người dùng từ params
    const { points } = req.body; // Số điểm cần cộng thêm từ body

    // Kiểm tra xem ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ!" });
    }

    // Tìm người dùng theo ID
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
      message: "Cập nhật điểm thưởng thành công",
      data: userWithoutPassword,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

