const Appointment = require('../models/appointments');
function convertToDate(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); 
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
