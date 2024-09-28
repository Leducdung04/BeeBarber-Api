const mongoose = require('mongoose'); 

const local = "mongodb+srv://leducdung02072004:g4H7FdXialfs66Cn@beebarber.ynx9m.mongodb.net/BeeBarber?retryWrites=true&w=majority&appName=BeeBarber"

const connect = async () => {
    try {
        await mongoose.connect(local);  // Không cần useNewUrlParser và useUnifiedTopology
        console.log('Connection success');
    } catch (error) {
        console.error('Connection error:', error);
    }
};

module.exports = { connect };
