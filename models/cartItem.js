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
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}); 

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;