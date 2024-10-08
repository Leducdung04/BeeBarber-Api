const Order_Product = require('../models/oder_product');

exports.addOrderProduct = async (req, res, next) => {
    try {
        const { product_id, user_id, number, appoint_date, status, price, user_voucher_id } = req.body;

        const newOrderProduct = new Order_Product({
            product_id,
            user_id,
            number,
            appoint_date,
            status,
            price,
            user_voucher_id
        });

        const result = await newOrderProduct.save();

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Server Error' });
    }
}
exports.updateOrderProduct = async (req, res, next) => {
    try {
        const { id } = req.params; // Lấy ID từ params
        const updateData = req.body; // Lấy dữ liệu từ body

        const updatedOrderProduct = await Order_Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedOrderProduct) {
            return res.status(404).json({ message: 'Order product not found' });
        }

        res.status(200).json(updatedOrderProduct);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Server Error' });
    }
}
exports.getListOrderProducts = async (req, res, next) => {
    try {
        const orderProducts = await Order_Product.find().sort({ createdAt: -1 });

        res.status(200).json(orderProducts);
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: error.message });
    }
}