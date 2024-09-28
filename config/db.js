const mongoose = require('mongoose'); 

// Thay thế <password> bằng mật khẩu thực tế, và mã hóa URL nếu cần
//const local = "mongodb+srv://leducdung02072004:g4H7FdXialfs66Cn@beebarber.ynx9m.mongodb.net/?retryWrites=true&w=majority&appName=BeeBarber";
const local = "mongodb://localhost:27017/BEEBARBER"

const connect = async () => {
    try {
        await mongoose.connect(local);  // Không cần useNewUrlParser và useUnifiedTopology
        console.log('Connection success');
    } catch (error) {
        console.error('Connection error:', error);
    }
};

module.exports = { connect };
