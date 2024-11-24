const Category_Product = require("../models/categoryProduct");

exports.get_list_Category_Product = async (req, res, next) => {
  try {
    const category_product = await Category_Product.find();

    res.status(200).json(category_product);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

exports.add_Category_Product = async (req, res, next) => {
  try {
    const { name, description} = req.body;
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
    if(result){
      return res.status(201).json({message:"Create new category product successfully", data:result});
    }else{
      return res.json({message: "Create new category product failed"})
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.update_Category_Product = async (req, res, next) => {
  try {
    const result = await Category_Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
exports.getCategoryProduct = async (req,res)=>{
  try {
    const id = req.params.id
    const category = await Category_Product.findById(id)
    if(category){
      return res.json({message: "Get category product successfully", data: category})
    }else{
      return res.json({message: "Get category product failed"})
    }
  } catch (error) {
    return res.json({message: `${error}`})
  }
}
exports.changeStatusCategoryProduct = async (req,res)=>{
  try {
    const id = req.params.id
    console.log(id)
    const category = await Category_Product.findById({_id:id})
    if(category){
     const updateCategoryService = await  Category_Product.findByIdAndUpdate(category._id,{
      status: false
    },{
      new: true
    })
    if(updateCategoryService){
         return res.json({message:"update status successfully", data: updateCategoryService})
    }else{
         return res.json({message: "Update category product failed"})
    }
    }else{
      return res.json({message: "Not found category product"})
    }
    } catch (error) {
     return res.status(500).json({status:500, message: `${error}`})
  }
}
