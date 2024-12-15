const Category_Product = require("../models/categoryProduct");
const mongoose = require("mongoose");
const Product = require("../models/product")

exports.get_list_Category_Product = async (req, res, next) => {
  try {
    const { status } = req.query; 
    const query = status ? { status: status === 'true' } : {}; 
    const category_product = await Category_Product.find(q);


    res.status(200).json(category_product);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

exports.add_Category_Product = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { file } = req;
    let image = null;
    if (req.file) {
      image = `${req.protocol}://localhost:3000/uploads/${req.file.filename}`;
    }
    const newCategory = new Category_Product({
      name,
      description,
      image,
    });
    const result = await newCategory.save();
    if (result) {
      return res.status(201).json({ success: true, message: "Create new category product successfully", data: result });
    } else {
      return res.json({ success: false, message: "Create new category product failed" })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.update_Category_Product = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ!" });
    }

    // Check if the category product exists
    const currentCategoryProduct = await Category_Product.findById(id);
    if (!currentCategoryProduct) {
      return res.status(404).json({ message: "Thể loại sản phẩm không tồn tại" });
    }

    // Handle image upload if a new file is provided
    let image = currentCategoryProduct.image;
    if (req.file) {
      image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    // Update the category product with new data
    const updatedCategoryProduct = await Category_Product.findByIdAndUpdate(
      id,
      { name, description, status, image },
      { new: true }
    );

    res.status(200).json(updatedCategoryProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};


exports.getCategoryProduct = async (req, res) => {
  try {
    const id = req.params.id
    const category = await Category_Product.findById(id)
    if (category) {
      return res.json({ message: "Get category product successfully", data: category })
    } else {
      return res.json({ message: "Get category product failed" })
    }
  } catch (error) {
    return res.json({ message: `${error}` })
  }
}

// exports.changeStatusCategoryProduct = async (req,res)=>{
//   try {
//     const id = req.params.id
//     console.log(id)
//     const category = await Category_Product.findById({_id:id})
//     if(category){
//      const updateCategoryService = await  Category_Product.findByIdAndUpdate(category._id,{
//       status: false
//     },{
//       new: true
//     })
//     if(updateCategoryService){
//          return res.json({message:"update status successfully", data: updateCategoryService})
//     }else{
//          return res.json({message: "Update category product failed"})
//     }
//     }else{
//       return res.json({message: "Not found category product"})
//     }
//     } catch (error) {
//      return res.status(500).json({status:500, message: `${error}`})
//   }
// }

exports.changeStatusCategoryProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const productCategory = await Category_Product.findById(id);
    if (productCategory) {
      // Toggle the status dynamically
      const updatedCategoryProduct = await Category_Product.findByIdAndUpdate(
        id,
        { status: !productCategory.status },
        { new: true }
      );
      if (updatedCategoryProduct) {
        return res.json({
          message: "Status updated successfully",
          data: updatedCategoryProduct,
        });
      } else {
        return res.json({ message: "Failed to update product status" });
      }
    } else {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: `${error}` });
  }
}

exports.deleteCategoryProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Category_Product.findByIdAndDelete(id);

    const products = await Product.find({ category_id: id });
    if (products.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa thể loại khi đang có sản phẩm đang sử dụng',
      });
    }

    if (result) {
      res.json({ success: true, message: 'Category Product deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Category Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
}


