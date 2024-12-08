const { default: mongoose } = require('mongoose');
const Appointment = require('../models/appointments');
const Payment = require('../models/payments');
const User = require('../models/user');
const Service = require('../models/service');
exports.appointment_total = async (req,res) =>{
    try {
        const { startDate, endDate } = req.query;
  
        console.log(`${startDate}#${endDate}`)
  
        const startTime = new Date(startDate);
        const endTime = new Date(endDate);
    
        const appointments = await Appointment.find({
          appointment_status: "completed",
          timeCompleted: {$gte: startTime, $lte: endTime }
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
          appointment.service_id.map((service)=>{
            totalService += 1
          })
          dailyTotalService[date] += totalService
        })

        const sortedDates = Object.keys(dailyTotalPrices).sort();
        const labels = sortedDates;
        const prices = sortedDates.map(date => dailyTotalPrices[date]);
        const services = sortedDates.map(date  => dailyTotalService[date]);

        for (const appointment of appointments){
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
        return res.json({message: "successfully",total:totalAmount, uniqueService,labels, prices,services })
    }catch(error){
        return res.status(500).json({message: `${error}`})
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

exports.addAppointmentWithPayment = async (req, res) => {
    try {
        // Lấy dữ liệu từ `req.body`
        const  appointment = req.body.appointment;
        const  payment  = req.body.payment;

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

        if (isNaN(newPayment.price)) {
            return res.status(400).json({ message: 'Invalid price format in payment' });
        }

        const paymentResult = await newPayment.save();

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
exports.getListAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });

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
        console.log(result);
        
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
        const { appointment_status, pay_method_status} = req.body; // Lấy bank_account từ body request

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
        const { id } = req.params; // Lấy ID từ params
        
        // Cập nhật status thành false
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id, 
            { status: false }, // Dữ liệu cần cập nhật
            { new: true } // Trả về document sau khi cập nhật
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Trả về bản ghi đã cập nhật
        res.status(200).json(updatedAppointment);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Server Error' });
    }
};
