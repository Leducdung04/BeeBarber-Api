const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');

// Lấy danh sách giỏ hàng của người dùng
exports.get_list_cart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.user._id }).populate('items.product_id');
        if (!cart) {
            return res.status(404).json({ msg: "Giỏ hàng trống" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Thêm giỏ hàng mới cho người dùng nếu chưa có
exports.add_Cart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user_id: req.user._id });
        if (!cart) {
            cart = new Cart({ user_id: req.user._id });
            await cart.save();
        }
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Cập nhật giỏ hàng của người dùng (thêm, xóa hoặc sửa)
exports.update_Cart = async (req, res) => {
    try {
        const result = await Cart.findOneAndUpdate({ user_id: req.user._id }, req.body, { new: true });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
