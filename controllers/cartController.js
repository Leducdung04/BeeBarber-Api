const Cart = require('../models/cart');

exports.get_user_cart = async (req, res) => {
    try {
        const { user_id } = req.params;
        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            return res.status(404).json({ msg: "Giỏ hàng không tồn tại" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

exports.add_cart = async (req, res) => {
    try {
        const { user_id } = req.params; 
        let cart = await Cart.findOne({ user_id });
        if (cart) {
            return res.status(400).json({ msg: "Người Dùng Đã Có Giỏ Hàng" });
        }
        const newCart = new Cart({ user_id });
        const result = await newCart.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

exports.update_cart = async (req, res) => {
    try {
        const { user_id } = req.params; 
        const result = await Cart.findOneAndUpdate(
            { user_id },
            req.body,
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ msg: "Không tồn tại giỏ hàng này" });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};