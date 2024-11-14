const Appointment = require('../models/appointments');
<<<<<<< HEAD
const Payment = require('../models/payments');
=======
function convertToDate(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); 
}
>>>>>>> 7ec9e349527e202a419c0b988f65b3ced08ff024
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
<<<<<<< HEAD
            price 
        });

        const result = await newAppointment.save();
        
=======
            price
        });

        const result = await newAppointment.save();
>>>>>>> 7ec9e349527e202a419c0b988f65b3ced08ff024
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Lỗi máy chủ' });
    }
}

<<<<<<< HEAD
exports.addAppointmentWithPayment = async (req, res) => {
    try {
        // Lấy dữ liệu từ đối tượng `appointment` trong `req.body`
        const appointment = req.body.appointment;
        console.log('appointment: ' + appointment)
        // Tạo một đối tượng Appointment mới
        const newAppointment = new Appointment(appointment);

        // Lưu Appointment và lấy `_id` của nó để dùng làm `related_id` cho Payment
        const appointmentResult = await newAppointment.save();
        
        // Lấy dữ liệu từ đối tượng `payment` trong `req.body`
        let payment = req.body.payment;

        // Tạo một đối tượng Payment mới với `related_id` là `_id` của Appointment đã lưu
        const newPayment = new Payment({
            related_id: appointmentResult._id,  // Liên kết với Appointment đã tạo
            ...payment
        });

        const paymentResult = await newPayment.save();

        res.status(201).json({
            status: 201,
            message: 'Appointment and Payment added successfully',
            appointment: appointmentResult,
            payment: paymentResult
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Server Error' });
    }
}


=======
>>>>>>> 7ec9e349527e202a419c0b988f65b3ced08ff024
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

<<<<<<< HEAD
exports.getAppointmentsWithPayments = async (req, res) => {
    try {
        const { userId } = req.params;

        // Truy vấn danh sách appointment theo user_id và kết hợp với đối tượng payment
        const appointments = await Appointment.find({ user_id: userId })
            .populate('barber_id') // Lấy thông tin barber
            .populate('service_id') // Lấy thông tin service
            .lean(); // Trả về đối tượng JSON thuần

        // Lặp qua các appointment để tìm payment theo related_id là appointment._id
        const appointmentsWithPayments = await Promise.all(
            appointments.map(async (appointment) => {
                const payment = await Payment.findOne({ related_id: appointment._id.toString() });
                return { ...appointment, payment }; // Thêm đối tượng payment vào mỗi appointment
            })
        );

        res.status(200).json({
            status: 200,
            message: "Appointments with payments retrieved successfully",
            data: appointmentsWithPayments,
        });
    } catch (error) {
        console.error("Error retrieving appointments with payments:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
=======
// Lấy lịch sử cắt theo id
exports.getUserAppointments = async (req, res, next) => {
    try {
        const { user_id } = req.params; 

        // Tìm các cuộc hẹn cho ID người dùng đã cho
        const userAppointments = await Appointment.find({ user_id }).sort({ appointment_date: -1 });

        if (!userAppointments.length) {
            return res.status(404).json({ message: 'Không tìm thấy cuộc hẹn nào cho người dùng này' });
        }

        res.status(200).json(userAppointments);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Lỗi máy chủ' });
    }
}
>>>>>>> 7ec9e349527e202a419c0b988f65b3ced08ff024
