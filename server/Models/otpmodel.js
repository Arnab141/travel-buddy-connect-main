
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {    
        type: String,
    },
    otp: String,
    createdAt: {
        type: Date, 
        default: Date.now
    }
})


module.exports = mongoose.model('Otp', otpSchema);  