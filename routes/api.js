const express = require("express");
const router = express.Router();

const { createVoucher, updateVoucher, getVouchers, getValidVouchers, getVoucherByCode } = require('../controllers/voucherController');
const { getUserVouchers, useVoucher } = require('../controllers/uservoucherController');
const {get_list_banner,addBanner,updateBanner,updateBannerStatus,get_list_banner_ByStatus} = require('../controllers/bannerController');
const {SigupUser,loginPhone,getUserDetailById}  = require('../controllers/userController');
const {add_Category_Product,get_list_Category_Product} = require('../controllers/categoryProductController')
const Upload = require("../config/upload");
const {getListService,addService,updateService,getListServiceByCategory,getGroupedServices, changeStatusService} = require('../controllers/serviceController');
const {getListCategory,addCategory,updateCategory, changeStatusCategoryService, getCategoryService} = require('../controllers/categoryController');
const { createReview, updateReview } = require("../controllers/reviewsControllers");
const { createBarber, updateBarber,get_list_barber } = require("../controllers/barberController");
const { createNotification, updateNotification, getNotifications } = require("../controllers/notificationController");
const {get_list_product,add_product,update_product,get_list_product_by_category,get_product_detail,search_products_by_name} = require("../controllers/productController")
const {get_list_cartItem,add_cartItem,delete_cartItem,update_cartItem} = require("../controllers/cartItemController");
const {get_user_cart,add_cart,update_cart} = require("../controllers/cartController")
const { addAppointment, getAppointmentsWithPayments, addAppointmentWithPayment, getAppointmentsByUserId, updateAppointmentStatusToCanceled, updateAppointmentStatusToCanceled_ByZaloPay } = require("../controllers/appointmentControllers");
const { addPayment, updatePayment_Canceled_ById, updatePaymentStatus } = require("../controllers/paymentsController");

// restful Api banner 
router.get('/get_list_banner',get_list_banner)
router.get('/get_list_banner_ByStatus',get_list_banner_ByStatus)
router.post('/addBanner',Upload.single("image"),addBanner)

router.put('/updateBanner/:id',Upload.single("image"),updateBanner)
router.put('/updateBannerStatus/:id',updateBannerStatus)

// restful Api user
router.post('/Singup',SigupUser)
router.post('/loginPhone',loginPhone)
router.get('/users/getUserDetailById/:id',getUserDetailById)

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
router.get('/services/update_status_service/:id',changeStatusService)

//RESTful API cho Category
router.get('/categorys/get_list_category',getListCategory)
router.post('/categorys/add_category',Upload.single("image"),addCategory)
router.put('/categorys/update_category/:id',Upload.single("image"),updateCategory)
router.get('/categorys/update_status_category/:id',changeStatusCategoryService)
router.get("/categorys/get_category/:id", getCategoryService)


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
router.get("/notifications/getNotifications", getNotifications);
router.post('/notifications', createNotification);
router.put('/notifications/:id', updateNotification);

//Restful API cho Product
router.get('/products/get_list_product', get_list_product)
router.get('/products/get_list_product_by_category', get_list_product_by_category);
router.post('/products/add_product',Upload.single("image"),add_product)
router.put('/products/update_product/:id',Upload.single("image"),update_product);
router.get('/products/get_product_detail/:id',get_product_detail)
router.get('/products/search_product_by_name',search_products_by_name)

//Restful API cho cart
router.get('/carts/get_user_cart',get_user_cart);
router.post('/carts/add_cart',add_cart)
router.put("/carts/update_cart",update_cart);

//Restful API cho cartItem
router.get('/cartItems/get_list_cartItem',get_list_cartItem);
router.post('/cartItems/add_cartItem',add_cartItem);
router.delete('/cartItems/delete_cartItem/:id',delete_cartItem);
router.put('/cartItems/update_cart',update_cartItem)

// RESTful API Appointment
router.post('/add_Appointment',addAppointment)
router.post('/addAppointmentWithPayment',addAppointmentWithPayment)
router.put('/updateAppointmentStatusToCanceled/:appointmentId',updateAppointmentStatusToCanceled)
router.put('/updateAppointmentStatusToCanceled_ByZaloPay/:appointmentId',updateAppointmentStatusToCanceled_ByZaloPay)

// router.get('/getAppointmentsByIduser/:userId',getAppointmentsWithPayments)
router.get('/getAppointmentsByIduser/:user_id',getAppointmentsByUserId)

// Restful API Payments
router.post('/new_payment',addPayment);
router.put('/updatePayment_Canceled_ById/:paymentId',updatePayment_Canceled_ById)
router.put('/updatePaymentStatus_ById/:appointmentId',updatePaymentStatus)


module.exports = router;
