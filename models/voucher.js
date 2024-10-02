const mongoose = require('mongoose');

// Định nghĩa schema cho Voucher
const voucherSchema = new mongoose.Schema({
    voucher_code: {
        type: String,
        required: true,  // Bắt buộc phải có mã voucher
        unique: true,    // Mã voucher phải là duy nhất
        trim: true       // Loại bỏ khoảng trắng thừa
    },
    description: {
        type: String,
        default: "",     // Mặc định là chuỗi rỗng nếu không có mô tả
    },
    discount_percent: {
        type: Number,
        required: true   // Bắt buộc phải có phần trăm giảm giá
    },
    max_discount: {
        type: Number,
        required: true   // Bắt buộc phải có giá trị giảm giá tối đa
    },
    expiration_date: {
        type: Date,
        required: true   // Bắt buộc phải có ngày hết hạn
    },
    quantity: {
        type: Number,
        required: true   // Bắt buộc phải có số lượng
    },
    createdAt: {
        type: Date,
        default: Date.now  // Tự động gán thời gian tạo
    }
});

// Tạo model từ schema
const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;
