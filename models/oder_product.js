const mongoose = require('mongoose');

const orderProductSchema = new mongoose.Schema({
  listProduct: [
    {
      idProduct: {
        type: mongoose.Schema.Types.ObjectId,
      },
      name: {
        type: String,
        default: "Name Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price_import: {
        type: Number,
        default: 0.0,
      },
      price_selling: {
        type: Number,
        default: 0.0,
      },
      image: {
        type: String,
      },
    },
  ],
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Giả sử user_id cũng là một ObjectId
    ref: "User",
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "deactive", "pending", "trading", "delivered"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ['ZaloPay', 'cash'],
    default: 'cash',
  },
  total_price_import: {
    type: Number,
    required: true,
  },
  total_price_sold: {
    type: Number,
    required: true,
  },
  user_voucher_id: {
    type: mongoose.Schema.Types.ObjectId, // Giả sử user_voucher_id là một ObjectId từ model khác
    default: null, // Có thể không có voucher
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  timeConfirm: {
    type: Date,
  },
    timeDelivery: {
        type: Date,
    },
    timeCancel: {
        type: Date,
    },
    timeSuccess: {
        type: Date,
   },
});

// Tạo model từ schema
const Order_Product = mongoose.model('Order_Product', orderProductSchema);

module.exports = Order_Product;