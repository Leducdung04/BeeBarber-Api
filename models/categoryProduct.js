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
    imageUrl: {
        type: String,
        required: true
    }
}); 

const CategoryProduct = mogoose.model('CategoryProduct', category_productSchema);

module.exports = CategoryProduct;