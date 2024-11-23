const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    related_id: {
        type: String,
        required: true,
    },
    pay_type: {
        type: String, 
        enum: ['booking', 'oder'], 
        default: 'booking',
    },
    pay_method: {
        type: String, 
        enum: ['ZaloPay', 'cash'], 
        default: 'cash',
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    user_voucher_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "userVoucher",
    },
    time: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    pay_method_status: {
        type: String,
        enum: ['Unpaid', 'Success', 'canceled','Norefundyet','Refunded'], 
        // chưa thanh toán,đã thanh toán, Đã hủy lịch,chưa hoàn tiền, Đã hoàn tiền,
        default: 'Unpaid',
    },
    status: {
        type: Boolean,
        default: true,
    },
    price: {
        type: Number,
        required: true,
    },
    
    bank_account:{
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Tạo model từ schema
const Payment = mongoose.model('payment', paymentSchema);

module.exports = Payment;