const express = require("express");
const router = express.Router();


const {get_list_banner,addBanner} = require('../controllers/bannerController');

// restful Api banner 
router.get('/get_list_banner',get_list_banner)
router.post('/addBanner',addBanner)


const {get_list_cart,add_Cart,update_Cart} = require('../controllers/cartController');

// restful Api cart 
router.get('/get_list_cart',get_list_cart)
router.post('/add_Cart',add_Cart)
router.put('/update_Cart/:id',update_Cart)


const {get_list_CartItem,addCartItem,updateCartItem} = require('../controllers/cartItemController');
// restful Api cartItem 
router.get('/get_list_CartItem',get_list_CartItem)
router.post('/addCartItem',addCartItem)
router.put('/updateCartItem/:id',updateCartItem)



const {get_list_product,add_product,update_product} = require('../controllers/productController');

// restful Api product 
router.get('/get_list_product',get_list_product)
router.post('/add_product',add_product)
router.put('/update_product/:id',update_product)


const {get_list_Category_Product,add_Category_Product,update_Category_Product} = require('../controllers/categoryProductController');

// restful Api categoryProduct
router.get('/get_list_Category_Product',get_list_Category_Product)
router.post('/add_Category_Product',add_Category_Product)
router.put('/update_Category_Product/:id',update_Category_Product)


module.exports = router;
