const CartItem = require('../models/cartItem');
const Cart = require('../models/cart')

exports.get_list_cartItem = async (req, res, next) => {
    try {
        const {cart_id} = req.params;
        const cartItems = await CartItem.find({ cart_id });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};


exports.add_cartItem = async (req, res, next) => {
    try {
        const {cart_id} = req.params;
        const cart = await Cart.findById({ _id: cart_id});
        if (!cart) {
            return res.status(404).json({ msg: "Người dùng không có giỏ hàng." });
        }
        let cartItem = await CartItem.findOne({
            cart_id: cart._id,
            product_id: req.body.product_id
        });

        if (cartItem) {
            cartItem.quantity = parseInt(cartItem.quantity) + parseInt(req.body.quantity);
            cartItem.total = parseFloat(cartItem.total) + parseFloat(req.body.total);
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({
                cart_id: cart._id,
                product_id: req.body.product_id,
                quantity: req.body.quantity,
                total: req.body.total
            });
        }
        console.log('Incoming cart_id:', cart_id);
        console.log('Request body:', req.body);        
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}


exports.delete_cartItem = async (req, res, next) => {
    try {
        const result = await CartItem.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: "Không tìm thấy sản phẩm." });
        }
        res.status(200).json({ msg: "Sản Phẩm Xóa Thành Công" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

exports.update_cartItem = async (req, res, next) => {
    try {
        const result = await CartItem.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ msg: "Không tìm thấy sản phẩm" });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}
