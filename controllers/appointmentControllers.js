const { default: mongoose } = require('mongoose');
const Appointment = require('../models/appointments');
const Payment = require('../models/payments');
const userId = new mongoose.Types.ObjectId("673caf51f316d5ff65f18607");
const User = require('../models/user');
const Notification = require('../models/notifications');

const Service = require('../models/service');
exports.appointment_total = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        console.log(`${startDate}#${endDate}`)

        const startTime = new Date(startDate);
        const endTime = new Date(endDate);

        const appointments = await Appointment.find({
            appointment_status: "completed",
            timeCompleted: { $gte: startTime, $lte: endTime }
        })
            .populate('service_id')
            .populate('barber_id');

        let uniqueService = [];
        let totalAmount = 0;
        const dailyTotalPrices = {};
        const dailyTotalService = {};

        appointments.forEach(appointment => {
            const date = appointment.timeCompleted.toISOString().slice(0, 10);
            if (!dailyTotalPrices[date]) {
                dailyTotalPrices[date] = 0;
            }
            if (!dailyTotalService[date]) {
                dailyTotalService[date] = 0;
            }
            const revenue = appointment.price
            dailyTotalPrices[date] += parseFloat(revenue);

            let totalService = 0
            appointment.service_id.map((service) => {
                totalService += 1
            })
            dailyTotalService[date] += totalService
        })

        const sortedDates = Object.keys(dailyTotalPrices).sort();
        const labels = sortedDates;
        const prices = sortedDates.map(date => dailyTotalPrices[date]);
        const services = sortedDates.map(date => dailyTotalService[date]);

        for (const appointment of appointments) {
            totalAmount += appointment.price

            for (const service of appointment.service_id) {
                const existingService = uniqueService.find(item => item._id && service._id && item._id.toString() === service._id.toString());

                if (!existingService) {
                    uniqueService.push({
                        _id: service._id,
                        name: service.name,
                        duration: service.duration,
                        price: service.price,
                        images: service.images,
                        description: service.description
                    });
                }
            }
        }
        return res.json({ message: "successfully", total: totalAmount, uniqueService, labels, prices, services })
    } catch (error) {
        return res.status(500).json({ message: `${error}` })
    }
}

exports.addAppointment = async (req, res, next) => {
    try {
        const { barber_id, user_id, service_id, appointment_time, appointment_date, status, price } = req.body;

        // Chuyển đổi ngày từ định dạng dd/mm/yyyy
        const formattedDate = convertToDate(appointment_date);

        const newAppointment = new Appointment({
            barber_id,
            user_id,
            service_id,
            appointment_time,
            appointment_date: formattedDate,
            status,
            price
        });
        const result = await newAppointment.save();

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Lỗi máy chủ' });
    }
}

exports.addAppointmentAdmin = async (req, res, next) => {
    try {
        const { barber_id, service_id, appointment_time, appointment_date, appointment_status, status, price } = req.body;
        const payment = req.body.payment; // Retrieve payment data from request body

        // Check for required appointment data
        if (!userId || !barber_id || !service_id || !appointment_time || !appointment_date || !price) {
            return res.status(400).json({ message: 'Thiếu thông tin lịch hẹn' });
        }

        // Create a new Appointment
        const newAppointment = new Appointment({
            barber_id,
            user_id: userId,
            service_id,
            appointment_time,
            appointment_date,
            appointment_status,
            status,
            price
        });

        // Save the Appointment and get the result
        const appointmentResult = await newAppointment.save();

        // Create a payment object with default values if payment data is not provided
        let paymentResult;
        if (!payment) {
            paymentResult = new Payment({
                related_id: appointmentResult._id, // Link payment to the appointment
                pay_type: 'booking', // Default pay type
                pay_method: 'cash', // Assuming cash for in-person payments
                user_id: userId,
                time: appointment_time,
                date: appointment_date,
                price: price,
                pay_method_status: 'Success', // Assuming success for in-person payments
                createdAt: new Date()
            });
            paymentResult = await paymentResult.save(); // Save the payment record
        } else {
            // Validate payment data if provided
            const requiredPaymentFields = ['pay_type', 'pay_method', 'time', 'date', 'price'];
            for (const field of requiredPaymentFields) {
                if (!payment[field]) {
                    return res.status(400).json({ message: `Thiếu trường thanh toán: ${field}` });
                }
            }
            payment.price = parseFloat(payment.price); // Ensure the price is a number
            if (isNaN(payment.price) || payment.price <= 0) {
                return res.status(400).json({ message: 'Invalid price format in payment' });
            }

            // Create the payment object based on provided data
            const newPayment = new Payment({
                related_id: appointmentResult._id, // Link payment to the appointment
                ...payment,
            });
            paymentResult = await newPayment.save(); // Save the payment record
        }

        // Respond with the results
        res.status(201).json({
            status: 201,
            message: 'Appointment added successfully',
            appointment: appointmentResult,
            payment: paymentResult, // Include payment result if available
        });
    } catch (err) {
        console.error('Error adding appointment:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};
exports.addAppointmentWithPayment = async (req, res) => {
    try {
        // Lấy dữ liệu từ `req.body`
        const appointment = req.body.appointment;
        const payment = req.body.payment;

        // Kiểm tra dữ liệu đầu vào
        if (!appointment || !payment) {
            return res.status(400).json({ message: 'Missing appointment or payment data' });
        }
        // Kiểm tra từng trường quan trọng trong `appointment`
        const requiredFields = ['barber_id', 'user_id', 'service_id', 'appointment_time', 'appointment_date', 'price'];
        for (const field of requiredFields) {
            if (!appointment[field]) {
                return res.status(400).json({ message: `Missing required field: ${field}` });
            }
        }
        appointment.price = parseInt(appointment.price);
        if (isNaN(appointment.price)) {
            return res.status(400).json({ message: 'Invalid price format in appointment' });
        }

        // Tạo một đối tượng Appointment mới
        const newAppointment = new Appointment(appointment);

        // Lưu Appointment và lấy `_id` của nó để dùng làm `related_id` cho Payment
        const appointmentResult = await newAppointment.save();

        // Gắn `related_id` và tạo đối tượng Payment
        const newPayment = new Payment({
            related_id: appointmentResult._id,
            ...payment,
        });

        // const newNotification = new Notification({
        //     user_id: appointment.user_id,
        //       type:"order" ,
        //       content: `Bạn có lịch hẹn cắt tóc tại BeeBarber vào lúc ngày ${appointment. appointment_time} ${appointment.appointment_date} `,
        // })

        if (isNaN(newPayment.price)) {
            return res.status(400).json({ message: 'Invalid price format in payment' });
        }

        const paymentResult = await newPayment.save();

        // await newNotification.save();
        res.status(201).json({
            status: 201,
            message: 'Appointment and Payment added successfully',
            appointment: appointmentResult,
            payment: paymentResult,
        });
    } catch (err) {
        console.error('Error adding appointment with payment:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};



exports.updateAppointment = async (req, res, next) => {
    try {
        const { id } = req.params; // Lấy ID từ params
        const updateData = req.body; // Lấy dữ liệu từ body

        const updatedAppointment = await Appointment.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json(updatedAppointment);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Server Error' });
    }
}


exports.updateAppointmentTime = async (req, res, next) => {
    try {
        const { id } = req.params; // Lấy ID của cuộc hẹn từ URL params
        const { appointment_time, appointment_date } = req.body; // Lấy dữ liệu từ body request

        // Kiểm tra nếu thiếu dữ liệu cần thiết
        if (!appointment_time || !appointment_date) {
            return res.status(400).json({ message: 'appointment_time and appointment_date are required' });
        }

        // Tìm và cập nhật thông tin
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { 
                appointment_time, 
                appointment_date 
            },
            { new: true } // Trả về tài liệu đã cập nhật
        );
        // Kiểm tra nếu không tìm thấy cuộc hẹn
        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Trả về kết quả thành công
        res.status(200).json({
            message: 'Appointment updated successfully',
            data: updatedAppointment,
        });
    } catch (err) {
        console.error('Error updating appointment:', err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
}
exports.getListAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 })
            .populate('barber_id')
            .populate('user_id')
            .populate('service_id');

        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: error.message });
    }
}

exports.getAppointmentsByUserId = async (req, res, next) => {
    try {
        const { user_id } = req.params;

        // Kiểm tra nếu không có user_id được cung cấp
        if (!user_id) {
            return res.status(400).json({ msg: "user_id is required" });
        }

        // Tìm tất cả các lịch hẹn của người dùng
        const appointments = await Appointment.find({
            user_id,
            status: true,
        })
            .populate('barber_id') // Lấy thông tin từ bảng Barber
            .populate('service_id') // Lấy thông tin từ bảng Service
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất

        // Tìm tất cả các thanh toán liên quan đến user_id
        const payments = await Payment.find({ user_id, status: true });

        // Gắn thông tin thanh toán tương ứng vào mỗi lịch hẹn
        const result = appointments.map(appointment => {
            const relatedPayment = payments.find(
                payment => String(payment.related_id) === String(appointment._id)
            );
            return {
                ...appointment._doc,
                payment: relatedPayment || null,
            };
        });

        // Trả về danh sách lịch hẹn kèm thanh toán
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: error.message });
    }
};

exports.getAppointmentsAdmin = async (req, res, next) => {
    try {
        // Lấy tất cả các lịch hẹn với status true
        const appointments = await Appointment.find().populate('user_id')
            .populate('barber_id') // Lấy thông tin từ bảng Barber
            .populate('service_id') // Lấy thông tin từ bảng Service
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất

        // Tìm tất cả các thanh toán có status true
        const payments = await Payment.find();

        // Gắn thông tin thanh toán tương ứng vào mỗi lịch hẹn
        const result = appointments.map(appointment => {
            const relatedPayment = payments.find(
                payment => String(payment.related_id) === String(appointment._id)
            );
            return {
                ...appointment._doc,
                payment: relatedPayment || null,
            };
        });

        // Trả về danh sách lịch hẹn kèm thanh toán


        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: error.message });
    }
};

exports.getAppointmentAdminById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findById(id)
            .populate('user_id')
            .populate('barber_id')
            .populate('service_id');
        console.log(appointment)


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid appointment ID' });
        }


        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }
        const payment = await Payment.findOne({ related_id: appointment._id });

        const result = {
            ...appointment._doc,
            payment: payment || null,
        };

        console.log(result);

        // Send the response
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: error.message });
    }
};


exports.updateAppointmentStatusToCanceled = async (req, res) => {
    try {
        const { appointmentId } = req.params; // Lấy ID từ URL

        // Kiểm tra định dạng của appointmentId
        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            return res.status(400).json({ message: "Invalid appointment ID format" });
        }

        // Tìm và cập nhật trạng thái của Appointment
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { appointment_status: "canceled" }, // Cập nhật trạng thái
            { new: true } // Trả về dữ liệu đã cập nhật
        );

        // Nếu không tìm thấy Appointment
        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Trả về phản hồi thành công
        res.status(200).json({
            status: 200,
            message: 'Appointment status updated successfully',
            data: updatedAppointment,
        });
    } catch (error) {
        console.error("Error updating appointment status:", error);
        res.status(500).json({ message: 'Server Error', error });
    }
};


// exports.updateAppointmentStatusToCanceled_ByZaloPay = async (req, res) => {
//     const session = await mongoose.startSession(); // Khởi tạo session để quản lý transaction
//     session.startTransaction();

//     try {
//         const { appointmentId } = req.params; // Lấy ID từ URL

//         // Kiểm tra định dạng của appointmentId
//         if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
//             return res.status(400).json({ message: "Invalid appointment ID format" });
//         }

//         // Tìm và cập nhật trạng thái của Appointment
//         const updatedAppointment = await Appointment.findByIdAndUpdate(
//             appointmentId,
//             { appointment_status: "canceled" }, // Cập nhật trạng thái
//             { new: true, session } // Trả về dữ liệu đã cập nhật, dùng session để đảm bảo transaction
//         );

//         // Nếu không tìm thấy Appointment
//         if (!updatedAppointment) {
//             await session.abortTransaction(); // Hủy transaction
//             session.endSession();
//             return res.status(404).json({ message: 'Appointment not found' });
//         }

//         // Tìm payment liên quan và cập nhật trạng thái pay_method_status
//         const relatedPayment = await Payment.findOneAndUpdate(
//             { related_id: appointmentId }, // Liên kết payment thông qua related_id
//             { pay_method_status: "canceled" }, // Cập nhật trạng thái
//             { new: true, session } // Trả về dữ liệu đã cập nhật, dùng session để đảm bảo transaction
//         );

//         // Nếu không tìm thấy Payment
//         if (!relatedPayment) {
//             await session.abortTransaction(); // Hủy transaction
//             session.endSession();
//             return res.status(404).json({ message: 'Payment not found' });
//         }

//         // Commit transaction khi mọi thứ hoàn tất
//         await session.commitTransaction();
//         session.endSession();

//         // Trả về phản hồi thành công
//         res.status(200).json({
//             status: 200,
//             message: 'Appointment and payment status updated successfully',
//             data: {
//                 appointment: updatedAppointment,
//                 payment: relatedPayment,
//             },
//         });
//     } catch (error) {
//         // Rollback transaction nếu có lỗi
//         await session.abortTransaction();
//         session.endSession();

//         console.error("Error updating appointment and payment status:", error);
//         res.status(500).json({ message: 'Server Error', error });
//     }
// };

exports.updateAppointmentStatusToCanceled_ByZaloPay = async (req, res) => {
    const session = await mongoose.startSession(); // Khởi tạo session để quản lý transaction
    session.startTransaction();

    try {
        const { appointmentId } = req.params; // Lấy ID từ URL
        const { bank_account } = req.body; // Lấy bank_account từ body request

        // Kiểm tra định dạng của appointmentId
        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            return res.status(400).json({ message: "Invalid appointment ID format" });
        }

        // Tìm và cập nhật trạng thái của Appointment
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { appointment_status: "canceled" }, // Cập nhật trạng thái
            { new: true, session } // Trả về dữ liệu đã cập nhật, dùng session để đảm bảo transaction
        );

        // Nếu không tìm thấy Appointment
        if (!updatedAppointment) {
            await session.abortTransaction(); // Hủy transaction
            session.endSession();
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Tìm payment liên quan và cập nhật trạng thái pay_method_status và bank_account
        const relatedPayment = await Payment.findOneAndUpdate(
            { related_id: appointmentId }, // Liên kết payment thông qua related_id
            {
                pay_method_status: "Norefundyet", // Cập nhật trạng thái
                bank_account: bank_account || null, // Cập nhật bank_account, mặc định null nếu không có giá trị
            },
            { new: true, session } // Trả về dữ liệu đã cập nhật, dùng session để đảm bảo transaction
        );

        // Nếu không tìm thấy Payment
        if (!relatedPayment) {
            await session.abortTransaction(); // Hủy transaction
            session.endSession();
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Commit transaction khi mọi thứ hoàn tất
        await session.commitTransaction();
        session.endSession();

        // Trả về phản hồi thành công
        res.status(200).json({
            status: 200,
            message: 'Appointment and payment status updated successfully',
            data: {
                appointment: updatedAppointment,
                payment: relatedPayment,
            },
        });
    } catch (error) {
        // Rollback transaction nếu có lỗi
        await session.abortTransaction();
        session.endSession();

        console.error("Error updating appointment and payment status:", error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.updateAppointmentStatusAdmin = async (req, res) => {
    const session = await mongoose.startSession(); // Khởi tạo session để quản lý transaction
    session.startTransaction();

    try {
        const { appointmentId } = req.params; // Lấy ID từ URL
        const { appointment_status, pay_method_status } = req.body; // Lấy bank_account từ body request

        // Kiểm tra định dạng của appointmentId
        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            return res.status(400).json({ message: "Invalid appointment ID format" });
        }

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                status: 404,
                message: "Appointment not found",
            });
        }

        appointment.appointment_status = appointment_status;
        switch (appointment_status) {
            case "completed":
                appointment.timeCompleted = new Date();
                break;
            case "canceled":
                appointment.timeCanceled = new Date();
                break;
            case "Evaluate":
                appointment.timeEvaluate = new Date();
                break;
        }

        await appointment.save();
        // Tìm payment liên quan và cập nhật trạng thái pay_method_status và bank_account
        const relatedPayment = await Payment.findOneAndUpdate(
            { related_id: appointmentId }, // Liên kết payment thông qua related_id
            {
                pay_method_status: pay_method_status, // Cập nhật trạng thái// Cập nhật bank_account, mặc định null nếu không có giá trị
            },
            { new: true, session } // Trả về dữ liệu đã cập nhật, dùng session để đảm bảo transaction
        );

        // Nếu không tìm thấy Payment
        if (!relatedPayment) {
            await session.abortTransaction(); // Hủy transaction
            session.endSession();
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Commit transaction khi mọi thứ hoàn tất
        await session.commitTransaction();
        session.endSession();

        // Trả về phản hồi thành công
        res.status(200).json({
            status: 200,
            message: 'Appointment and payment status updated successfully',
            data: {
                appointment: appointment,
                payment: relatedPayment,
            },
        });
    } catch (error) {
        // Rollback transaction nếu có lỗi
        await session.abortTransaction();
        session.endSession();

        console.error("Error updating appointment and payment status:", error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.updateAppointmentStatus = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { appointment_status } = req.body; 

        const validStatuses = ['pending', 'inuse', 'complete_payment', 'completed', 'canceled'];
        if (!validStatuses.includes(appointment_status)) {
            return res.status(400).json({ message: 'Invalid appointment status' });
        }

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.appointment_status = appointment_status;
        switch (appointment_status) {
            case "completed":
                appointment.timeCompleted = new Date();
                break;
            case "canceled":
                appointment.timeCanceled = new Date();
                break;
            default:
                break;
        }

        let updatedPayment = null;
        if (appointment_status === 'complete_payment') {
            const payment = await Payment.findOne({ related_id: appointment._id });
            if (!payment) {
                return res.status(404).json({ message: 'Payment not found for this appointment' });
            }

            payment.pay_method_status = 'Success';
            updatedPayment = await payment.save();
        }

        const updatedAppointment = await appointment.save();

        res.status(200).json({
            message: 'Appointment status updated successfully',
            appointment: updatedAppointment,
            payment: updatedPayment,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


const listTimes = [
    '8:00', '8:20', '8:40', '9:00', '9:20', '9:40',
    '10:00', '10:20', '10:40', '11:00', '11:20', '11:40',
    '12:00', '12:20', '12:40', '13:00', '13:20', '13:40',
    '14:00', '14:20', '14:40', '15:00', '15:20', '15:40',
    '16:00', '16:20', '16:40', '17:00', '17:20', '17:40',
    '18:00', '18:20', '18:40', '19:00', '19:20', '19:40',
    '20:00', '20:20', '20:40',
];

// Hàm kiểm tra lịch hẹn và tính thời gian làm việc
exports.getBookedTimesForBarber = async (req, res, next) => {
    try {
        const { barberId, appointmentDate } = req.params;


        // Kiểm tra và chuyển đổi appointmentDate
        if (!appointmentDate || isNaN(Date.parse(appointmentDate))) {
            return res.status(400).json({ error: "Invalid or missing appointmentDate." });
        }

        const parsedDate = new Date(appointmentDate);

        // Tìm tất cả các lịch hẹn của barber vào ngày cụ thể
        const appointments = await Appointment.find({
            barber_id: barberId,
            appointment_date: {
                $gte: new Date(parsedDate.setHours(0, 0, 0, 0)), // Đầu ngày
                $lt: new Date(parsedDate.setHours(23, 59, 59, 999)), // Cuối ngày
            },
        }).populate("service_id"); // Lấy thông tin dịch vụ của từng lịch hẹn

        // Lấy danh sách thời gian đã đặt
        const bookedTimes = appointments.map(app => app.appointment_time);

        // Tính tổng thời gian làm việc dựa trên duration của từng dịch vụ
        let totalWorkingTime = 0;
        appointments.forEach(app => {
            app.service_id.forEach(service => {
                totalWorkingTime += service.duration; // Cộng thời gian từng dịch vụ
            });
        });

        // Loại bỏ các thời gian đã đặt ra khỏi listTimes
        const availableTimes = listTimes.filter(time => !bookedTimes.includes(time));

        return res.status(200).json({
            bookedTimes,
            availableTimes,
            totalWorkingTime, // Tổng thời gian làm việc (tính bằng phút)
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "An error occurred while fetching appointments." });
    }
};


