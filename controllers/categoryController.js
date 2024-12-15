const Category = require('../models/category')
const mongoose = require("mongoose");
const Service = require("../models/service")

exports.getListCategory = async (req, res, next) => {
  try {
    const category = await Category.find({status:true}).sort({ createdAt: -1})
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

exports.addCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    let image = null;

    if (req.file) {
      image = `${req.protocol}://localhost:3000/uploads/${req.file.filename}`;
    }
    const newCategory = new Category({ name, description, image });

    const result = await newCategory.save()

    if (result) {
      res.status(201).json({ success: true, result })
    } else {
      res.status(400).json({ success: false, result })
    }

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Server Error' });
  }
}

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ!" });
    }

    const currentCategory = await Category.findById(id);
    if (!currentCategory) {
      return res.status(404).json({ message: "Category không tồn tại" });
    }

    let image = currentCategory.image;

    if (req.file) {
      image = `${req.protocol}://localhost:3000/uploads/${req.file.filename}`; // Cập nhật image mới
    }

    const result = await Category.findByIdAndUpdate(
      id,
      { name, description, image },
      { new: true }
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Server Error' });
  }
};

// exports.updateCategoryStatus = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const updatedCategory = await Category.findByIdAndUpdate(
//       id,
//       { status: status }, // Chỉ cập nhật trường status
//     );

//     // Kiểm tra xem Category có tồn tại không
//     if (!updatedCategory) {
//       return res.status(404).json({ message: 'Category không tồn tại.' });
//     }

//     // Trả về phản hồi thành công
//     return res.status(200).json({
//       message: 'Cập nhật trạng thái category thành công.',
//       category: updatedCategory,
//     });
//   } catch (error) {
//     console.error('Lỗi khi cập nhật status của category:', error);

//     // Trả về lỗi nếu có vấn đề trong quá trình xử lý
//     return res.status(500).json({
//       message: 'Đã xảy ra lỗi trong quá trình cập nhật.',
//       error: error.message,
//     });
//   }
// };

exports.updateCategoryStatus = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const category = await Category.findById(id);
    if (category) {
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { status: !category.status },
        { new: true }
      );
      if (updatedCategory) {
        return res.json({
          message: "Status updated successfully",
          data: updatedCategory,
        });
      } else {
        return res.json({ message: "Failed to update category status" });
      }
    } else {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: `${error}` });
  }
};


exports.getCategoryService = async (req, res) => {
  try {
    const id = req.params.id
    const category = await Category.findById(id)
    if (category) {
      return res.json({ message: "Get category service successfully", data: category })
    } else {
      return res.json({ message: "Get category service failed" })
    }
  } catch (error) {
    return res.json({ message: `${error}` })
  }
}

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Category.findByIdAndDelete(id);

    const services = await Service.find({ id_category: id });
    if (services.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa thể loại khi đang có dịch vụ đang sử dụng',
      });
    }
    if (result) {
      res.json({ success: true, message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
}