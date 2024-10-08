const mongoose = require('mongoose');

// Định nghĩa schema cho Banner
const bannerSchema = new mongoose.Schema({
    image: {
        type: String, 
    },
    status: {
        type: Boolean,
        default: true,   
    },
    target_screen: {
        type: String,
        enum: ['barber', 'product','hairstyle','mobile'],  
        default: 'mobile'   
    }
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
