const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, 
        required: true, 
        unique: true },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        // OTP that will be sent to the user
    },
    otpExpires: {
        type: Date,
        // Timestamp indicating when the OTP expires
    },
    verified: {
        type: Boolean,
        default: false, // User is not verified by default
    },
    isLoggedIn: {
        type: Boolean,
        default: false, // User is not logged in by default
    },
});

// Generate OTP and set expiration time
userSchema.methods.generateOtp = function() {
    this.otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    this.otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
};

const User = mongoose.model('User', userSchema);

module.exports = User;
