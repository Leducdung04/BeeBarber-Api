const mongoose = require("mongoose");
const Banner = require("../models/banner");
const Uploads = require("../config/upload")

exports.addBanner = async (req, res, next) => {
  try {
    const { status, target_screen } = req.body;
    const { file } = req;
    let image = null;
    if (req.file) {image = `${req.protocol}://localhost:3000/uploads/${req.file.filename}`;}
    const newBanner = new Banner({
      image,
      status,
      target_screen,
    });
    const result = await newBanner.save();
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Server Error" });
  }
};

exports.updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, target_screen } = req.body;

    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ!" });
    }

    // Tìm banner hiện tại
    const currentBanner = await Banner.findById(id);
    if (!currentBanner) {
      return res.status(404).json({ message: "Banner không tồn tại" });
    }

    // Kiểm tra nếu có file được tải lên
    let image = currentBanner.image; // Giữ nguyên image cũ
    if (req.file) {
      image = `${req.protocol}://localhost:3000/uploads/${req.file.filename}`; // Cập nhật image mới
    }

    // Cập nhật banner với các thông tin mới
    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      {
        image: image, // Sử dụng image mới hoặc giữ nguyên cái cũ
        status: status,
        target_screen: target_screen,
      },
      { new: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({ message: "Banner không tồn tại" });
    }

    res.status(200).json({
      message: "Cập nhật banner thành công",
      data: updatedBanner,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};


exports.updateBannerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ!" });
    }

    // Cập nhật status
    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!updatedBanner) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy banner với ID này!" });
    }

    // Trả về banner đã được cập nhật
    return res.status(200).json({
      message: "Cập nhật status thành công",
      data: updatedBanner,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.get_list_banner = async (req, res, next) => {
  try {
    const banner = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json(banner);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

exports.get_list_banner_ByStatus = async (req, res, next) => {
  try {
    const banner = await Banner.find({ status: true }).sort({ createdAt: -1 });
    res.status(200).json(banner);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

