const mongoose = require('mongoose');

const orderProductSchema = new mongoose.Schema({
    product_id: {
        type: [mongoose.Schema.Types.ObjectId], // Giả sử product_id là một ObjectId từ model khác
        ref:'Product',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // Giả sử user_id cũng là một ObjectId
        required: true,
    },
    order_date: {
        type: Date,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    status: {
        type: Number,
        enum: [1, 2, 3,4,5], 
        // 1 chờ xác nhận , 2 đã xác nhận , 3 đang giao hàng , 4 đã giao hàng , 5 đã hủy,
        default: 1,
    },
    price: {
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
});

// Tạo model từ schema
const Order_Product = mongoose.model('Order_Product', orderProductSchema);

module.exports = Order_Product;