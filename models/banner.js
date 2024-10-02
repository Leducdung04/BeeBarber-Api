const mongoose = require('mongoose');

// Định nghĩa schema cho Banner
const bannerSchema = new mongoose.Schema({
    title: {
        type: String,  // Bắt buộc phải có tiêu đề
        trim: true,      // Loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi
    },
    image: {
        type: String, 
    },
    description: {
        type: String     // Mặc định là chuỗi rỗng nếu không có mô tả
    },
    status: {
        type: Boolean,
        default: true,   // Mặc định banner đang được hiển thị
    },
    target_screen: {
        type: String,
        enum: ['pay', 'history','mobile'],  // Cho phép chỉnh sửa giá trị cho trư��ng này với danh sách giá trị cho phép
        default: 'pay'      // Mặc đ��nh target_screen là desktop
    }
});

// Tạo model từ schema
const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
