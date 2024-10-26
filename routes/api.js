const express = require("express");
const router = express.Router();

const { createVoucher, updateVoucher, getVouchers, getValidVouchers, getVoucherByCode } = require('../controllers/voucherController');
const { getUserVouchers, useVoucher } = require('../controllers/uservoucherController');
const {get_list_banner,addBanner,updateBanner,updateBannerStatus,get_list_banner_ByStatus} = require('../controllers/bannerController');
const {SigupUser,loginEmail,loginPhone,updateUser,updateLoyaltyPoints}  = require('../controllers/userController');
const {add_Category_Product,get_list_Category_Product} = require('../controllers/categoryProductController')
const Upload = require("../config/upload");
const {getListService,addService,updateService,getListServiceByCategory,getGroupedServices} = require('../controllers/serviceController');
const {getListCategory,addCategory,updateCategory } = require('../controllers/categoryController');
const { createReview, updateReview } = require("../controllers/reviewsControllers");
const { createBarber, updateBarber,get_list_barber } = require("../controllers/barberController");
const { createNotification, updateNotification } = require("../controllers/notificationController");
const {get_list_product,add_product,update_product} = require("../controllers/productController")



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

//RESTful API cho Service 
router.get('/services/get_list_service',getListService)
router.post('/services/add_service',Upload.single("images"),addService)
router.put('/services/update_service/:id',Upload.single("images"),updateService)
router.get('/services/getListServiceByCategory/:id_category',getListServiceByCategory)
router.get('/getGroupedServices',getGroupedServices)

//RESTful API cho Category
router.get('/categorys/get_list_category',getListCategory)
router.post('/categorys/add_category',Upload.single("image"),addCategory)
router.put('/categorys/update_category/:id',Upload.single("image"),updateCategory)


// RESTful API cho CategoryProduct
router.get('/categoryProducts/get_list_Category_Product', get_list_Category_Product)
router.post('/categoryProducts/add_category_product',Upload.single("image"),add_Category_Product)

// RESTful API cho Review 
router.post('/reviews', createReview);
router.put('/reviews/:id', updateReview);

// RESTful API cho Barber
router.get('/get_list_barber', get_list_barber)
router.post('/add_Barbers',Upload.single("image"), createBarber);
router.put('/Update_Barbers/:id',Upload.single("image"), updateBarber);

// RESTful API cho Notifications
router.post('/notifications', createNotification);
router.put('/notifications/:id', updateNotification);

//Restful API cho Product
router.get('/products/get_list_product',get_list_product)

module.exports = router;
