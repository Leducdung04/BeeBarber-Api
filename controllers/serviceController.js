const Service = require("../models/service");
const Appointment = require("../models/appointments")
const mongoose = require("mongoose")

exports.getListService = async (req, res, next) => {
  try {
    const service = await Service.find().sort({ createdAt: -1 }).populate("id_category");

    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

exports.getGroupedServices = async (req, res, next) => {
  try {
    const groupedServices = await Service.aggregate([
      {
        $lookup: {
          from: "categories", // Tên của collection Category trong database (thường là dạng số nhiều)
          localField: "id_category",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      {
        $unwind: "$categoryDetails" // Trả về một đối tượng category thay vì mảng
      },
      {
        $group: {
          _id: "$categoryDetails", // Sử dụng toàn bộ đối tượng category làm _id
          data: { $push: "$$ROOT" } // Đẩy toàn bộ document của service vào mảng "data"
        }
      }
    ]);

    res.status(200).json(groupedServices);
  } catch (error) {
    console.error(error); // In lỗi ra console để kiểm tra chi tiết
    res.status(500).json({ msg: error.message });
  }
};

exports.getListServiceByCategory = async (req, res, next) => {
  try {
    const { id_category } = req.params;

    // Tìm các dịch vụ dựa trên id_category
    const services = await Service.find({ status:true ,id_category }).sort({ createdAt: -1 });

    res.status(200).json(services);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

exports.addService = async (req, res, next) => {
  try {
    const { id_category, description, price, duration, name } = req.body;
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
    if (result) {
      return res.status(201).json({ success: true, message: "Create new service successfully", data: result });
    } else {
      return res.json({ success: false, message: "Create new service failed" })
    }

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

// exports.changeStatusService = async (req, res) => {
//   try {
//     const id = req.params.id
//     const serviceAuth = await Service.findById(id)
//     if (serviceAuth) {
//       const serviceUpdate = await Service.findByIdAndUpdate(serviceAuth._id, {
//         status: false
//       }, {
//         new: true
//       })
//       if (serviceUpdate) {
//         return res.json({ message: "Update service successfully", data: serviceUpdate })
//       } else {
//         return res.json({ message: "Update service failed" })
//       }
//     }
//   } catch (error) {
//     return res.status(500).json({ message: `${error}` })
//   }
// }

exports.changeStatusService = async (req, res) => {
  try {
    const id = req.params.id;

    const service = await Service.findById(id);
    if (service) {
      const updatedService = await Service.findByIdAndUpdate(
        id,
        { status: !service.status },
        { new: true }
      );
      if (updatedService) {
        return res.json({
          message: "Status updated successfully",
          data: updatedService,
        });
      } else {
        return res.json({ message: "Failed to update service status" });
      }
    } else {
      return res.status(404).json({ message: "Service not found" });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: `${error}` });
  }
}

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Service.findByIdAndDelete(id);

    const appointments = await Appointment.find({ id_service: id });
    if (appointments.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa dịch vụ này',
      });
    }
    if (result) {
      res.json({ success: true, message: 'Service deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
}

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL
    const { status } = req.body; // Lấy giá trị status từ body của request

    // Cập nhật trạng thái của dịch vụ
    const result = await Service.findByIdAndUpdate(
      id,
      { status }, // Cập nhật trường status
      { new: true } // Trả về tài liệu đã được cập nhật
    );

    if (result) {
      res.json({ success: true, message: 'Status updated successfully', data: result });
    } else {
      res.status(404).json({ success: false, message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};


