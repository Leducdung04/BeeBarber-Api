const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    barber_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Barber",
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    service_id: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: "Service",
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
    appointment_status: {
        type: String,
        enum: ['pending', 'completed', 'canceled'], 
        default: 'pending',
    },
    status:{
        type: Boolean,
        default: true,
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