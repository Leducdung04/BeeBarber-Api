const mongoose = require("mongoose");

const productShema = new mongoose.Schema({
  category_id: {
    type: mongoose.Types.ObjectId,
    ref: "CategoryProduct",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  import_price: {
    type: Number,
    required: true,
  },
  price_selling: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity:{
    type:Number,
    require:true
  },
  status: {
    type: Boolean,
    default: true,
  },
  soldQuantity:{
    type:Number
  }
});

const Product = mongoose.model("Product", productShema);

module.exports = Product;
