const Product = require('../models/product');

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

exports.add_product = async (req, res, next) => {
    try {
      let image = null;
      if (req.file) {
        image = `${req.protocol}://localhost:3000/uploads/${req.file.filename}`;
      }
      
      const newProduct = new Product({
        ...req.body,
        image,
      });
      const result = await newProduct.save();
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({ msg: "Server Error" });
    }
  };
  
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
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({ msg: error.message });
    }
  };
  
