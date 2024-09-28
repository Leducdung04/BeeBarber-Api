const express = require("express");
const router = express.Router();


const {get_list_banner,addBanner} = require('../controllers/bannerController');
const { createVoucher, updateVoucher, getVouchers, getValidVouchers, getVoucherByCode } = require('../controllers/voucherController');
const { getUserVouchers, useVoucher } = require('../controllers/uservoucherController');

// restful Api banner 
router.get('/get_list_banner',get_list_banner)
router.post('/addBanner',addBanner)


// RESTful API cho Voucher
router.post('/vouchers', createVoucher);  // Tạo voucher mới
router.put('/vouchers/:voucher_id', updateVoucher);  // Cập nhật voucher
router.get('/vouchers', getVouchers);  // Lấy tất cả voucher
router.get('/vouchers/valid', getValidVouchers);  // Lấy tất cả voucher còn hiệu lực
router.get('/vouchers/:voucher_code', getVoucherByCode);  // Lấy voucher theo mã


// RESTful API cho UserVoucher
router.get('/user_vouchers/:user_id', getUserVouchers);  // Lấy danh sách voucher của người dùng
router.put('/user_vouchers/:userVoucher_id/use', useVoucher);  // Sử dụng voucher


module.exports = router;
