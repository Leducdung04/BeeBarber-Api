const express = require("express");
const router = express.Router();

const { createVoucher, updateVoucher, getVouchers, getValidVouchers, getVoucherByCode } = require('../controllers/voucherController');
const { getUserVouchers, useVoucher } = require('../controllers/uservoucherController');
const {get_list_banner,addBanner,updateBanner,updateBannerStatus,get_list_banner_ByStatus} = require('../controllers/bannerController');
const {SigupUser,loginPhone,getUserDetailById, getAllUser, lockupUser, sendOtpToEmail, verifyOtp, updatePassword, updateUserById, getAllCustomer }  = require('../controllers/userController');
const {add_Category_Product,get_list_Category_Product, getCategoryProduct, deleteCategoryProduct, update_Category_Product, changeStatusCategoryProduct} = require('../controllers/categoryProductController')
const Upload = require("../config/upload");
const {getListService,addService,updateService,getListServiceByCategory,getGroupedServices, changeStatusService, deleteService, updateStatus} = require('../controllers/serviceController');
const {getListCategory,addCategory,updateCategory, changeStatusCategoryService, getCategoryService, deleteCategory, updateCategoryStatus} = require('../controllers/categoryController');
const { createReview, updateReview } = require("../controllers/reviewsControllers");
const { createBarber, updateBarber,get_list_barber, get_list_barberStatus } = require("../controllers/barberController");
const { getNotifications,createNotification, updateNotification, getNotificationsByUserId, createScheduleNotification, getNotificationsByStatus } = require("../controllers/notificationController");
const {get_list_product,add_product,update_product,get_list_product_by_category,get_product_detail,search_products_by_name, updateQuantityProduct, deleteProduct, changeProductStatus} = require("../controllers/productController")
const {get_list_cartItem,add_cartItem,delete_cartItem,update_cartItem, update_cartItem_quantity} = require("../controllers/cartItemController");
const {get_user_cart,add_cart,update_cart} = require("../controllers/cartController")

// restful Api notifications
router.post("/notifications/createNotification",createNotification)
const { addAppointment, getAppointmentsWithPayments, addAppointmentWithPayment, getAppointmentsByUserId, updateAppointmentStatusToCanceled, updateAppointmentStatusToCanceled_ByZaloPay, updateAppointmentStatus, getAppointmentsAdmin, updateAppointmentStatusAdmin, appointment_total, getBookedTimesForBarber, addAppointmentAdmin, updateAppointmentTime, updateAppointment, getAppointmentAdminById } = require("../controllers/appointmentControllers");

const { addPayment, updatePayment_Canceled_ById, updatePaymentStatus } = require("../controllers/paymentsController");
const { addOrderWithPayment, getOrdersByUserId, updateOderStatusToCanceled, updateOderStatusToCanceled_ByZaloPay, getAllOrdersAdmin, addOrderProduct, updateOrderStatus, totalAmount, getOrderByOrderId } = require("../controllers/order_productController");

// restful Api banner 
router.get('/get_list_banner',get_list_banner)
router.get('/get_list_banner_ByStatus',get_list_banner_ByStatus)
router.post('/addBanner',Upload.single("image"),addBanner)

router.put('/updateBanner/:id',Upload.single("image"),updateBanner)
router.put('/updateBannerStatus/:id',updateBannerStatus)

// restful Api user
router.post('/SignUp',SigupUser)
router.post('/loginPhone',loginPhone)
router.get('/users/getUserDetailById/:id',getUserDetailById)
router.get('/user/get_all_user', getAllUser)
router.get('/users', getAllUser)
router.get('/user/get_all_customer', getAllCustomer)
router.get('/user/lock_user/:id', lockupUser)
router.put('/updateUser/:id', updateUserById);
router.post('/sendOtp', sendOtpToEmail); 
router.post('/verifyOtp', verifyOtp);
router.put('/updatePassword/:email', updatePassword);

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
router.get('/services/getListServiceByCategory',getListServiceByCategory)
router.get('/getGroupedServices',getGroupedServices)
router.put('/services/update_status_service/:id',changeStatusService)
router.delete('/services/delete_service/:id',deleteService)
router.put('/services/updateStatus/:id',updateStatus)

//RESTful API cho Category
router.get('/categorys/get_list_category',getListCategory)
router.post('/categorys/add_category',Upload.single("image"),addCategory)
router.put('/categorys/update_category/:id',Upload.single("image"),updateCategory)
router.put('/categorys/change_category_status/:id',updateCategoryStatus)
router.delete('/categorys/delete_category/:id',deleteCategory)

// RESTful API cho CategoryProduct
router.get('/categoryProducts/get_list_Category_Product', get_list_Category_Product)
router.post('/categoryProducts/add_category_product',Upload.single("image"),add_Category_Product)
router.get('/categoryProducts/get_category_product/:id', getCategoryProduct)
router.put('/categoryProducts/update_status_category_product/:id', changeStatusCategoryProduct)
router.delete('/categoryProducts/delete_category_product/:id',deleteCategoryProduct)
router.put("/categoryProducts/update_category_product/:id",Upload.single("image"),update_Category_Product)

// RESTful API cho Review 
router.post('/reviews', createReview);
router.put('/reviews/:id', updateReview);

// RESTful API cho Barber
router.get('/get_list_barber', get_list_barber)
router.get('/get_list_barberStatus', get_list_barberStatus)

router.post('/add_Barbers',Upload.single("image"), createBarber);
router.put('/Update_Barbers/:id',Upload.single("image"), updateBarber);

// RESTful API cho Notifications
router.get('/notifications/getNotifications',getNotificationsByStatus)
router.post('/notifications', createNotification);
router.put('/notifications/:id', updateNotification);
router.post('/notifications/schedule',createScheduleNotification)
router.get('/notifications/:user_id',getNotificationsByUserId)
// router.get('/getnotifications/:user_id', getNotificationsByUserId);

//Restful API cho Product
router.get('/products/get_list_product', get_list_product)
router.get('/products/get_list_product_by_category', get_list_product_by_category);
router.post('/products/add_product',Upload.single("image"),add_product)
router.put('/products/update_product/:id',Upload.single("image"),update_product);
router.put('/products/update_product_status/:id',changeProductStatus);
router.get('/products/get_product_detail/:id',get_product_detail)
router.get('/products/search_product_by_name',search_products_by_name)
router.put("/products/update_quantity_product/:id", updateQuantityProduct)
router.delete("/products/delete_product/:id",deleteProduct)

//Restful API cho cart
router.get('/carts/get_user_cart/:user_id',get_user_cart);
router.post('/carts/add_cart/:user_id',add_cart)
router.put("/carts/update_cart",update_cart);

//Restful API cho cartItem
router.get('/cartItems/get_list_cartItem/:cart_id',get_list_cartItem);
router.post('/cartItems/add_cartItem/:cart_id',add_cartItem);
router.delete('/cartItems/delete_cartItem/:id',delete_cartItem);
router.put('/cartItems/update_cart',update_cartItem)
router.patch('/cartItems/update_cart_quantity/:id/quantity',update_cartItem_quantity)

// RESTful API Appointment
router.post('/add_Appointment',addAppointment)
router.post('/addAppointmentWithPayment',addAppointmentWithPayment)
router.post('/addAppointmentAdmin',addAppointmentAdmin)
router.put('/updateAppointmentStatusToCanceled/:appointmentId',updateAppointmentStatusToCanceled)
router.put('/updateAppointmentStatusToCanceled_ByZaloPay/:appointmentId',updateAppointmentStatusToCanceled_ByZaloPay)
router.put('/updateAppointmentStatus/:id',updateAppointmentStatus)
router.put('/updateAppointmentTime/:id',updateAppointmentTime)
   // lấy danh sách thời gian bận 
router.get('/getBookedTimesForBarber/:barberId/:appointmentDate',getBookedTimesForBarber)
    // admin
router.get('/getAppointmentsAdmin',getAppointmentsAdmin)
router.get('/getAppointmentAdminById/:id',getAppointmentAdminById)
router.put('/updateAppointmentStatusAdmin/:appointmentId',updateAppointmentStatusAdmin)


// oder 
router.post('/add_order/:id', addOrderProduct)
router.post('/updateOrderStatus/:id', updateOrderStatus)
router.get('/revenue', totalAmount)
router.post('/addOrderWithPayment',addOrderWithPayment)
router.get('/getOrdersByUserId/:user_id',getOrdersByUserId);
router.put('/updateOderStatusToCanceled/:oderId',updateOderStatusToCanceled)
router.put('/updateOderStatusToCanceled_ByZaloPay/:oderId',updateOderStatusToCanceled_ByZaloPay)
   // admin
router.get('/getOrdersAdmin',getAllOrdersAdmin)
router.get('/getOrderById/:orderId', getOrderByOrderId)

// router.get('/getAppointmentsByIduser/:userId',getAppointmentsWithPayments)
router.get('/getAppointmentsByIduser/:user_id',getAppointmentsByUserId)
router.get("/appointment_total", appointment_total)

// Restful API Payments
router.post('/new_payment',addPayment);
router.put('/updatePayment_Canceled_ById/:paymentId',updatePayment_Canceled_ById)
router.put('/updatePaymentStatus_ById/:appointmentId',updatePaymentStatus)


module.exports = router;
