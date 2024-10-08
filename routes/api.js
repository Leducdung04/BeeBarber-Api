const express = require("express");
const router = express.Router();


const { createVoucher, updateVoucher, getVouchers, getValidVouchers, getVoucherByCode } = require('../controllers/voucherController');
const { getUserVouchers, useVoucher } = require('../controllers/uservoucherController');
const {get_list_banner,addBanner,updateBanner,updateBannerStatus,get_list_banner_ByStatus} = require('../controllers/bannerController');
const {SigupUser,loginEmail,loginPhone,updateUser,updateLoyaltyPoints}  = require('../controllers/userController');
const {getListCategory,addCategory} = require('../controllers/categoryController');
const {add_Category_Product,get_list_Category_Product} = require('../controllers/categoryProductController')
const Upload = require("../config/upload");

// restful Api banner 
router.get('/get_list_banner',get_list_banner)
router.get('/get_list_banner_ByStatus',get_list_banner_ByStatus)
router.post('/addBanner',Upload.single("image"),addBanner)

router.put('/updateBanner/:id',Upload.single("image"),updateBanner)
router.put('/updateBannerStatus/:id',updateBannerStatus)

// restful Api user
router.post('/Singup',SigupUser)
router.post('/loginEmail',loginEmail)
router.post('/loginPhone',loginPhone)
router.put('/updateUser/:id',updateUser)
router.put('updateLoyaltyPoints/:id',updateLoyaltyPoints)

// RESTful API cho Voucher
router.post('/vouchers', createVoucher);  // Tạo voucher mới
router.put('/vouchers/:voucher_id', updateVoucher);  // Cập nhật voucher
router.get('/vouchers', getVouchers);  // Lấy tất cả voucher
router.get('/vouchers/valid', getValidVouchers);  // Lấy tất cả voucher còn hiệu lực
router.get('/vouchers/:voucher_code', getVoucherByCode);  // Lấy voucher theo mã


// RESTful API cho UserVoucher
router.get('/user_vouchers/:user_id', getUserVouchers);  // Lấy danh sách voucher của người dùng
router.put('/user_vouchers/:userVoucher_id/use', useVoucher);  // Sử dụng voucher


// RESTful API cho Category
router.get('/getListCategory', getListCategory)
router.post('/addCategory',Upload.single("image"),addCategory)

// RESTful API cho CategoryProduct
router.get('/get_list_Category_Product', get_list_Category_Product)
router.post('/add_category_product',Upload.single("image"),add_Category_Product)

module.exports = router;
