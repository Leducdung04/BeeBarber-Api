const UserVoucher = require('../models/userVoucher');

// Lấy danh sách các voucher của người dùng
exports.getUserVouchers = async (req, res, next) => {
    try {
        const { user_id } = req.params;

        const userVouchers = await UserVoucher.find({ user_id }).populate('voucher_id');
        res.status(200).json(userVouchers);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Server Error' });
    }
}

// Sử dụng voucher
exports.useVoucher = async (req, res, next) => {
    try {
        const { userVoucher_id } = req.params;

        const userVoucher = await UserVoucher.findById(userVoucher_id);

        if (!userVoucher || userVoucher.status === 'Used') {
            return res.status(400).json({ message: 'Voucher already used or not found' });
        }

        userVoucher.status = 'Used';
        userVoucher.used_date = new Date();

        const updatedUserVoucher = await userVoucher.save();
        res.status(200).json(updatedUserVoucher);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Server Error' });
    }
}
