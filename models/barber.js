const mongoose = require("mongoose");

// Định nghĩa schema cho Barber
const barberSchema = new mongoose.Schema({
  phone:{
    type:String,
    require:true
  },
  name: {
    type: String, 
    required: true, 
  },
  experience: { 
    type: Number, 
    required: true 
  },
  image: { 
    type: String, 
    default: null 
  },
  workingHours: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String },
},
  status: {
    type: Boolean, 
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
},
});

// Tạo model từ schema
const Barber = mongoose.model("Barber", barberSchema);

module.exports = Barber;
