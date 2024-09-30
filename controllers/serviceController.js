const Service = require("../models/service");

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
    const { id_category, description, price, duration, images, name } =
      req.body;
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
    const {id} = req.params;
    const { id_category, description, price, duration, images, name } =
      req.body;
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
