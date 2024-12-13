const CartItem = require('../models/cartItem');
const Cart = require('../models/cart')
const Product = require('../models/product')

exports.get_list_cartItem = async (req, res, next) => {
    try {
        const { cart_id } = req.params;
        const cartItems = await CartItem.find({ cart_id });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};


exports.add_cartItem = async (req, res, next) => {
    try {
        const { cart_id } = req.params;
        const cart = await Cart.findById({ _id: cart_id });
        if (!cart) {
            return res.status(404).json({ msg: "Người dùng không có giỏ hàng." });
        }

        const product = await Product.findById(req.body.product_id);
        if (!product) {
            return res.status(404).json({ msg: "Sản phẩm không tồn tại." });
        }
        const requestedQuantity = parseInt(req.body.quantity);

        const existingCartItem = await CartItem.findOne({
            cart_id: cart._id,
            product_id: req.body.product_id
        });
        const currentQuantity = existingCartItem ? existingCartItem.quantity : 0;
        const totalQuantity = currentQuantity + requestedQuantity;
        if (totalQuantity > product.quantity) {
            return res.status(400).json({
                msg: `Số lượng sản phẩm vượt quá số lượng tồn kho. Còn lại: ${product.quantity - currentQuantity}`,
            });
        }
        if (existingCartItem) {
            existingCartItem.quantity = totalQuantity;
            existingCartItem.total = parseFloat(existingCartItem.total) + parseFloat(req.body.total);
            await existingCartItem.save();
        } else {
            await CartItem.create({
                cart_id: cart._id,
                product_id: req.body.product_id,
                quantity: requestedQuantity,
                total: req.body.total
            });
        }
        
        res.status(201).json({ msg: "Sản phẩm đã được thêm vào giỏ hàng thành công." });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};


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

exports.update_cartItem_quantity = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { quantity } = req.body;

        const cartItem = await CartItem.findById(id);
        if (!cartItem) {
            return res.status(404).json({ msg: "Không tìm thấy sản phẩm trong giỏ hàng." });
        }

        const product = await Product.findById(cartItem.product_id);
        if (!product) {
            return res.status(404).json({ msg: "Sản phẩm không tồn tại." });
        }

        if (quantity > product.quantity) {
            return res.status(400).json({
                msg: `Số lượng sản phẩm vượt quá số lượng tồn kho. Còn lại: ${product.quantity}`,
            });
        }

        const updatedCartItem = await CartItem.findOneAndUpdate(
            { _id: id },
            {
                quantity: quantity,
            },
            { new: true } 
        );

        res.status(200).json({
            msg: "Cập nhật số lượng sản phẩm thành công.",
        });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};


