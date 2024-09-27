const express = require("express");
const router = express.Router();


const {get_list_banner,addBanner} = require('../controllers/bannerController');

// restful Api banner 
router.get('/get_list_banner',get_list_banner)
router.post('/addBanner',addBanner)

//Service API
router.get('/get_list_service',getListService)
router.post('/add_service',addService)
router.put('/update_service/:id',updateService)

//Category API
router.get('/get_list_category',getListCategory)
router.post('/add_category',addCategory)
router.put('/update_category/:id',updateCategory)

module.exports = router;
