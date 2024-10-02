const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    cart_id: {
        type: String,
        required: true
    },
    product_id: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    total: {
        type: String,
        required: true
    }
}); 

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;