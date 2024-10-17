const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    barber_id: {
        type: mongoose.Schema.Types.ObjectId, // Giả sử barber_id là một ObjectId từ model khác
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // Giả sử user_id cũng là một ObjectId
        required: true,
    },
    service_id: {
        type: mongoose.Schema.Types.ObjectId, // Giả sử service_id từ một model khác
        required: true,
    },
    appointment_time: {
        type: String,
        required: true,
    },
    appointment_date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'canceled'], // Trạng thái của cuộc hẹn
        default: 'pending',
    },
    price: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Tạo model từ schema
const Appointment = mongoose.model('appointment', appointmentSchema);

module.exports = Appointment;