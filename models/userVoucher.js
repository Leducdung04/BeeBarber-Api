const mongoose = require('mongoose');

// Định nghĩa schema cho UserVoucher
const userVoucherSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,  // Tham chiếu tới User
        required: true,
        ref: 'User'  // Khóa ngoại tới bảng User
    },
    voucher_id: {
        type: mongoose.Schema.Types.ObjectId,  // Tham chiếu tới Voucher
        required: true,
        ref: 'Voucher'  // Khóa ngoại tới bảng Voucher
    },
    issued_date: {
        type: Date,
        default: Date.now  // Tự động gán ngày phát hành voucher cho user
    },
    used_date: {
        type: Date  // Ngày voucher được sử dụng (nếu có)
    },
    status: {
        type: String,
        enum: ['Unused', 'Used'],  // Chỉ chấp nhận giá trị 'Unused' hoặc 'Used'
        default: 'Unused'          // Mặc định là 'Unused'
    }
});

// Tạo model từ schema
const UserVoucher = mongoose.model('userVoucher', userVoucherSchema);

module.exports = UserVoucher;
