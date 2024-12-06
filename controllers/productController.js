const Product = require('../models/product');
const CartItem = require("../models/cartItem")

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
    const { category_id } = req.query;
    const filter = category_id ? { category_id } : {};
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
    if (result) {
      res.status(201).json({ success: true, result })
    } else {
      res.status(400).json({ success: false, result })
    }

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
    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}


exports.search_products_by_name = async (req, res, next) => {
  try {
    const { name } = req.query;
    const filter = name ? { name } : {};
    const products = await Product.find(filter).sort({ createdAt: 1 }).populate("category_id");
    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}
exports.updateQuantityProduct = async (req, res) => {
  try {
    const _id = req.params.id
    const updateProduct = await Product.findByIdAndUpdate(_id, {
      quantity: 0,
      status: false
    }, {
      new: true
    })
    if (updateProduct) {
      res.status(200).json({
        status: 200,
        message: "update product successfully",
        data: updateProduct
      })
    } else {
      res.status(401).json({
        status: 401,
        message: "update product failed"
      })
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: `${error}` })
  }
}

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);

    const cartItems = await CartItem.find({ id_category: id });
    if (cartItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa sản phẩm',
      });
    }

    if (result) {
      res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
}