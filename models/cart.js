const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true 
    },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;