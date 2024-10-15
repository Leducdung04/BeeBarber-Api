const Barber = require("../models/barber");  // Model Barber đã định nghĩa
const User = require("../models/user");      // Model User (liên kết với user_id)

// Thêm mới barber
exports.createBarber = async (req, res) => {
  try {
    const { user_id, experience, image, start_time, end_time, status } = req.body;

    // Kiểm tra xem user_id có hợp lệ và có phải là một barber không
    const userExists = await User.findById(user_id);
    if (!userExists || userExists.role !== "barber") {
      return res.status(400).json({ message: "Người dùng không hợp lệ hoặc không phải là barber" });
    }

    // Tạo mới barber
    const newBarber = new Barber({
      user_id,
      experience,
      image,
      start_time,
      end_time,
      status
    });

    // Lưu vào cơ sở dữ liệu
    await newBarber.save();

    res.status(201).json({ message: "Barber đã được tạo thành công", barber: newBarber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error });
  }
};

// Cập nhật barber
exports.updateBarber = async (req, res) => {
  try {
    const { id } = req.params;
    const { experience, image, start_time, end_time, status } = req.body;

    // Kiểm tra xem barber có tồn tại không
    const barberExists = await Barber.findById(id);
    if (!barberExists) {
      return res.status(404).json({ message: "Không tìm thấy barber" });
    }

    // Cập nhật các trường trong barber
    barberExists.experience = experience || barberExists.experience;
    barberExists.image = image || barberExists.image;
    barberExists.start_time = start_time || barberExists.start_time;
    barberExists.end_time = end_time || barberExists.end_time;
    barberExists.status = status !== undefined ? status : barberExists.status;  // Trạng thái true/false
    barberExists.updated_at = Date.now(); // Cập nhật thời gian sửa

    // Lưu barber đã sửa
    await barberExists.save();

    res.status(200).json({ message: "Barber đã được cập nhật", barber: barberExists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error });
  }
};
