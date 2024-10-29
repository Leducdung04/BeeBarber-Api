const mongoose = require('mongoose');

const productShema = new mongoose.Schema({
    CategoryId: {
        type: mongoose.Types.ObjectId,
        ref: "CategoryProduct", 
        required: true
    },
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

const Product = mongoose.model('Product', productShema);

module.exports = Product;