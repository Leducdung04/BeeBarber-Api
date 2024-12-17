const Barber = require("../models/barber");  // Model Barber đã định nghĩa
const User = require("../models/user"); 
const mongoose = require("mongoose");     // Model User (liên kết với user_id)

exports.get_list_barber = async (req, res, next) => {
  try {
    const banner = await Barber.find({status: true}).sort({ _id: -1 });
    res.status(200).json(banner);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
exports.get_list_barberStatus = async (req, res, next) => {
  try {
    
    const banner = await Barber.find({ status: true }).sort({ _id: -1 });
    res.status(200).json(banner);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
// Thêm mới barber
exports.createBarber = async (req, res) => {
  try {
    const { name, experience, status } = req.body;
    let image = null;
    if (req.file) {image = `${req.protocol}://localhost:3000/uploads/${req.file.filename}`;}
    // Tạo mới barber
    const newBarber = new Barber({
      name,
      experience,
      image,
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
    const {name, experience, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ!" });
    }

    // Tìm banner hiện tại
    const barberExists = await Barber.findById(id);
    if (!barberExists) {
      return res.status(404).json({ message: "Banner không tồn tại" });
    }

    // Kiểm tra nếu có file được tải lên
    let image = barberExists.image; // Giữ nguyên image cũ
    if (req.file) {
      image = `${req.protocol}://localhost:3000/uploads/${req.file.filename}`; // Cập nhật image mới
    }

    // Cập nhật các trường trong barber
    barberExists.name = name || barberExists.name;  
    barberExists.experience = experience || barberExists.experience;
    barberExists.image = image || barberExists.image;
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
