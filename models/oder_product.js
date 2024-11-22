const mongoose = require('mongoose');

const orderProductSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId, // Giả sử product_id là một ObjectId từ model khác
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // Giả sử user_id cũng là một ObjectId
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
    appointment_date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'canceled'], // Trạng thái của đơn hàng
        default: 'pending',
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