const { default: mongoose } = require('mongoose');
const Payment = require('../models/payments');
const Appointment = require('../models/appointments');
exports.addPayment = async (req, res, next) => {
    try {
        const { related_id,pay_type, pay_method,user_id,user_voucher_id,time,date,status,price} = req.body;
        
        const newPayment = new Payment({
           related_id,
           pay_type,
           pay_method,
           user_id,
           user_voucher_id,
           time,
           date,
           status,
           price
        });

        const result = await newPayment.save();

        res.status(200).json({
            status: 200,
            message: 'Payment added successfully',
            data:result
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Server Error' });
    }
}


exports.updatePayment_Canceled_ById = async (req, res, next) => {
    try {
        const { paymentId } = req.params;  
        const { bank_account } = req.body;  

        // Tìm và cập nhật trạng thái Payment
        const updatedPayment = await Payment.findByIdAndUpdate(
            paymentId, 
            {
                bank_account: bank_account || null,
                status: "canceled"  
            },
            { new: true }  // Trả về dữ liệu đã cập nhật
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Lấy `related_id` từ payment để tìm appointment liên quan
        const appointmentId = updatedPayment.related_id;

        // Tìm và cập nhật trạng thái của Appointment
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { appointment_status: "canceled" },
            { new: true } // Trả về dữ liệu đã cập nhật
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Payment and Appointment statuses updated successfully',
            data: {
                payment: updatedPayment,
                appointment: updatedAppointment
            }
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Server Error' });
    }
};

exports.updatePaymentStatus = async (req, res, next) => {
    try {
        const { paymentId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(paymentId)) {
            return res.status(400).json({ message: "Invalid payment ID format" });
        }

        const {  status } = req.body;
        const updatedPayment = await Payment.findByIdAndUpdate(
            paymentId,
            {
                status: status 
            },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.status(200).json({
            status: 200,
            message: "Payment status updated successfully",
            data: updatedPayment
        });

        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

