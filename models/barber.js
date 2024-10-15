const mongoose = require("mongoose");

// Định nghĩa schema cho Barber
const barberSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",  // Giả sử user_id liên kết đến bảng User
    required: true 
  },
  experience: { 
    type: Number, 
    required: true 
  },
  image: { 
    type: String, 
    default: null 
  },
  start_time: { 
    type: String,  // Giả sử thời gian làm việc được lưu dưới dạng chuỗi (HH:mm)
    required: true 
  },
  end_time: { 
    type: String,  // Giả sử thời gian kết thúc công việc là chuỗi (HH:mm)
    required: true 
  },
  status: { 
    type: Boolean, 
    default: true  // Trạng thái mặc định là hoạt động
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date 
  }
});

// Tạo model từ schema
const Barber = mongoose.model("Barber", barberSchema);

module.exports = Barber;
