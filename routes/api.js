const express = require("express");
const router = express.Router();


const {get_list_banner,addBanner} = require('../controllers/bannerController');

// restful Api banner 
router.get('/get_list_banner',get_list_banner)
router.post('/addBanner',addBanner)





module.exports = router;
