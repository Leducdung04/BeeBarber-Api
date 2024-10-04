const Service = require("../models/service");
const mongoose = require("mongoose")

exports.getListService = async (req, res, next) => {
  try {
    const service = await Service.find().sort({ createdAt: -1 });

    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

exports.addService = async (req, res, next) => {
  try {
    const { id_category, description, price, duration, name } = req.body;
    const { file } = req;
    let images = null;
    if (req.file) {
      images = `${req.protocol}://localhost:3000/uploads/${req.file.filename}`;
    }
    const newService = new Service({
      id_category,
      description,
      price,
      duration,
      images,
      name,
    });

    const result = await newService.save();

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Server Error" });
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_category, description, price, duration, name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ!" });
    }

    const currentService = await Service.findById(id);
    if (!currentService) {
      return res.status(404).json({ message: "Service không tồn tại" });
    }
    let images = currentService.images;

    if (req.file) {
      images = `${req.protocol}://localhost:3000/uploads/${req.file.filename}`; // Cập nhật image mới
    }
    const result = await Service.findByIdAndUpdate(
      id,
      { id_category, description, price, duration, images, name },
      { new: true }
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Server Error" });
  }
};
