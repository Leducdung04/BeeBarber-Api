const Product = require('../models/product');
const ProductModel = require('../models/product');
exports.get_list_product = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ createdAt: 1 }).populate("category_id");
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

exports.get_list_product_by_category = async (req, res, next) => {
    try {
        const { category_id} = req.query;
        const filter =  category_id ? { category_id} :{ };
        const products = await Product.find(filter).sort({ createdAt: 1 }).populate("category_id");
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

exports.addProduct = async (req,res)=>{
  try{
      const {categoryId,name,import_price,price_selling,description,quantity} = req.body
      let image = null;
      if (req.file) {image = `${req.protocol}://localhost:3000/uploads/${req.file.filename}`;}
      const newProduct = new Product({
          category_id:categoryId,
          name:name,
          image:image,
          import_price:import_price,
          price_selling:price_selling,
          description:description,
          quantity:quantity
      })
      const productExists = await ProductModel.findOne({name:name})
      if(productExists){
         res.status(404).json({status:404, message:"product already exists"})
      }else{
          const addProduct = await newProduct.save()
          if(addProduct){
              res.status(201).json({status:201, message:"Create new product successfully", data:addProduct})
          }else{
              res.status(404).json({status:404, message:"Create new product failed"})
          }
      }
  }catch(error){
      res.status(500).json({status:500, message:`${error}`})
  }
}
  exports.update_product = async (req, res, next) => {
    try {
      let image = req.body.image; 
      if (req.file) {
        image = `${req.protocol}://localhost:3000/uploads/${req.file.filename}`;
      }
  
      const result = await Product.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body, image },
        { new: true }
      );
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({ msg: error.message });
    }
  };
  
  exports.get_product_detail = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await Product.findById(id)
      .populate("category_id");
      res.status(200).json({ data});
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }


exports.search_products_by_name = async (req, res, next) => {
  try {
    const {name} = req.query;
    const filter =  name ? {name} :{ };
    const products = await Product.find(filter).sort({ createdAt: 1 }).populate("category_id");
    res.status(200).json({ products});
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}
exports.updateQuantityProduct = async (req,res)=>{
  try {
      const _id = req.params.id
      const updateProduct = await Product.findByIdAndUpdate(_id,{
          quantity: 0,
          status: false
           },{
              new:true
           })
           if(updateProduct){
              res.status(200).json({
                  status:200,
                  message:"update product successfully",
                  data:updateProduct
              })
           }else{
              res.status(401).json({
                  status:401,
                  message:"update product failed"
              })
           }
  } catch (error) {
      res.status(500).json({status:500, message: `${error}`})
  }
}