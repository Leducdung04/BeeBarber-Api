const mongoose = require("mongoose");

// Định nghĩa schema cho Barber
const barberSchema = new mongoose.Schema({
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
  status: { 
    type: Boolean, 
    default: true  
  }
});

// Tạo model từ schema
const Barber = mongoose.model("Barber", barberSchema);

module.exports = Barber;
