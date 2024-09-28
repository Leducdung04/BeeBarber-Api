const Voucher = require('../models/voucher');


// Lấy danh sách tất cả voucher
exports.getVouchers = async (req, res, next) => {
    try {
        const vouchers = await Voucher.find();  // Lấy tất cả voucher từ DB
        res.status(200).json(vouchers);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Server Error' });
    }
};

// Lấy danh sách voucher còn hiệu lực
exports.getValidVouchers = async (req, res, next) => {
    try {
        const now = new Date();
        const vouchers = await Voucher.find({ expiration_date: { $gte: now }, quantity: { $gt: 0 } });  // Lấy những voucher còn hiệu lực và còn số lượng
        res.status(200).json(vouchers);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Server Error' });
    }
};

// Lấy voucher theo mã voucher
exports.getVoucherByCode = async (req, res, next) => {
    try {
        const { voucher_code } = req.params;
        const voucher = await Voucher.findOne({ voucher_code });

        if (!voucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }

        res.status(200).json(voucher);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Server Error' });
    }
};

// Thêm voucher mới
exports.createVoucher = async (req, res, next) => {
    try {
        const { voucher_code, description, discount_percent, max_discount, expiration_date, quantity } = req.body;

        const newVoucher = new Voucher({ 
            voucher_code, 
            description, 
            discount_percent, 
            max_discount, 
            expiration_date, 
            quantity 
        });

        const result = await newVoucher.save();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Server Error' });
    }
}

// Sửa voucher
exports.updateVoucher = async (req, res, next) => {
    try {
        const { voucher_id } = req.params;
        const { description, discount_percent, max_discount, expiration_date, quantity } = req.body;

        const voucher = await Voucher.findById(voucher_id);

        if (!voucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }

        voucher.description = description;
        voucher.discount_percent = discount_percent;
        voucher.max_discount = max_discount;
        voucher.expiration_date = expiration_date;
        voucher.quantity = quantity;

        const updatedVoucher = await voucher.save();
        res.status(200).json(updatedVoucher);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Server Error' });
    }
}
