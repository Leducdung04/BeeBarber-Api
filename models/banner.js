const mongoose = require('mongoose');

// Định nghĩa schema cho Banner
const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,  // Bắt buộc phải có tiêu đề
        trim: true,      // Loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi
    },
    imageUrl: {
        type: String,
        required: true,  // Bắt buộc phải có đường dẫn ảnh
    },
    description: {
        type: String,
        default: "",     // Mặc định là chuỗi rỗng nếu không có mô tả
    },
    status: {
        type: Boolean,
        default: true,   // Mặc định banner đang được hiển thị
    },
    target_screen: {
        type: String,
        enum: ['pay', 'history','mobile'],  // Cho phép chỉnh sửa giá trị cho trư��ng này với danh sách giá trị cho phép
        default: 'home'      // Mặc đ��nh target_screen là desktop
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now,  // Tự động gán thời gian tạo
    // }
});

// Tạo model từ schema
const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
