const mogoose = require('mongoose');

const category_productSchema = new mogoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: true
    },
    image: {
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        default: true
    }
}); 

const CategoryProduct = mogoose.model('CategoryProduct', category_productSchema);

module.exports = CategoryProduct;