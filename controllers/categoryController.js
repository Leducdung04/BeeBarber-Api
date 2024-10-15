const Category = require('../models/category')
const mongoose = require("mongoose");

exports.getListCategory = async(req,res,next) => {
    try {
        const category = await Category.find().sort({createdAt : -1,})
        res.status(200).json(category);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
}

exports.addCategory = async(req,res,next) =>{
    try {
        const {name,description} = req.body;
        const { file } = req;
        let image = null;

        if (req.file) {
            image = `${req.protocol}://localhost:3000/uploads/${req.file.filename}`;
        }
        const newCategory = new Category({name,description,image});
        const result = await newCategory.save()
        res.status(201).json(result)
    } catch (error) {
        console.error(error);
        res.status(400).json({message: 'Server Error'});      
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
