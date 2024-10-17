const Review = require("../models/reviews");  // Model Review đã định nghĩa
const Barber = require("../models/barber");  // Model Barber (liên kết với barber_id)
const Service = require("../models/service"); // Model Service (liên kết với services_id)

// Thêm đánh giá mới
exports.createReview = async (req, res) => {
  try {
    const { barber_id, services_id, comment, rating_barber, rating_services } = req.body;

    // Kiểm tra xem barber và service có tồn tại không
    const barberExists = await Barber.findById(barber_id);
    const serviceExists = await Service.findById(services_id);

    if (!barberExists) {
      return res.status(400).json({ message: "Barber không tồn tại" });
    }

    if (!serviceExists) {
      return res.status(400).json({ message: "Dịch vụ không hợp lệ" });
    }

    // Tạo mới đánh giá
    const newReview = new Review({
      barber_id,
      services_id,
      comment,
      rating_barber,
      rating_services,
      status: "pending",  // Mặc định status là pending
    });

    // Lưu vào cơ sở dữ liệu
    await newReview.save();

    res.status(201).json({ message: "Đánh giá đã được tạo thành công", review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error });
  }
};

// Cập nhật đánh giá
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { barber_id, services_id, comment, rating_barber, rating_services, status } = req.body;

    // Kiểm tra xem đánh giá có tồn tại không
    const reviewExists = await Review.findById(id);
    if (!reviewExists) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }

    // Nếu có barber_id hoặc services_id mới, kiểm tra xem chúng có hợp lệ không
    if (barber_id) {
      const barberExists = await Barber.findById(barber_id);
      if (!barberExists) {
        return res.status(400).json({ message: "Barber không tồn tại" });
      }
    }

    if (services_id) {
      const serviceExists = await Service.findById(services_id);
      if (!serviceExists) {
        return res.status(400).json({ message: "Dịch vụ không hợp lệ" });
      }
    }

    // Cập nhật các trường trong đánh giá
    reviewExists.barber_id = barber_id || reviewExists.barber_id;
    reviewExists.services_id = services_id || reviewExists.services_id;
    reviewExists.comment = comment || reviewExists.comment;
    reviewExists.rating_barber = rating_barber || reviewExists.rating_barber;
    reviewExists.rating_services = rating_services || reviewExists.rating_services;
    reviewExists.status = status || reviewExists.status;
    reviewExists.updated_at = Date.now(); // Cập nhật thời gian sửa

    // Lưu đánh giá đã sửa
    await reviewExists.save();

    res.status(200).json({ message: "Đánh giá đã được cập nhật", review: reviewExists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error });
  }
};
