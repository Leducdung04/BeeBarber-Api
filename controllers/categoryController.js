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
exports.changeStatusCategoryService = async (req,res)=>{
  try {
    const id = req.params.id
    console.log(id)
    const category = await Category.findById({_id:id})
    if(category){
     const updateCategoryService = await  Category.findByIdAndUpdate(category._id,{
      status: false
    },{
      new: true
    })
    if(updateCategoryService){
         return res.json({message:"update status successfully", data: updateCategoryService})
    }else{
         return res.json({message: "Update category service failed"})
    }
    }else{
      return res.json({message: "Not found category service"})
    }
    } catch (error) {
     return res.status(500).json({status:500, message: `${error}`})
  }
}
exports.getCategoryService = async (req,res)=>{
  try {
    const id = req.params.id
    const category = await Category.findById(id)
    if(category){
      return res.json({message: "Get category service successfully", data: category})
    }else{
      return res.json({message: "Get category service failed"})
    }
  } catch (error) {
    return res.json({message: `${error}`})
  }
}
