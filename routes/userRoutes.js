const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/user'); // Adjust the path as necessary
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail as the service
    auth: {
        user: process.env.EMAIL, // Your Gmail from .env
        pass: process.env.EMAIL_PASSWORD, // Your Gmail password from .env
    },
});


// Registration route
// Function to generate a random 6-digit OTP


// Registration route
router.post('/register', async (req, res) => {
    const { email, password, username } = req.body; // Include username

    try {
        // Check if the user already exists
        let existingUser = await User.findOne({ email });

        // If user exists and is not verified, regenerate OTP and send it again
        if (existingUser && !existingUser.verified) {
            existingUser.generateOtp(); // Generate a new OTP

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Your New OTP Code',
                text: `Your OTP is ${existingUser.otp}. It expires in 5 minutes.`,
            };

            await transporter.sendMail(mailOptions);
            await existingUser.save();

            return res.status(200).json({ message: 'OTP sent to your email!' });
        }

        // If user is verified, return an error (optional)
        if (existingUser && existingUser.verified) {
            return res.status(400).json({ message: 'User already registered and verified.' });
        }

        // If user doesn't exist, proceed with normal registration
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            username, // Add username to new user
        });
        newUser.generateOtp(); // Generate OTP for the new user

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is ${newUser.otp}. It expires in 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        await newUser.save();

        res.status(200).json({ message: 'OTP sent to your email!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user.' });
    }
});

router.get('/protected-route', authenticateToken, (req, res) => {
    console.log('Protected route accessed by:', req.user); // Debug log
    res.status(200).json({ message: 'This is a protected route!', user: req.user });
});


// Verification route
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        // Check if OTP is valid
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // Check if OTP has expired
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired.' });
        }

        // If valid, mark the user as verified
        user.verified = true; // Set the verified status to true
        user.otp = null; // Clear the OTP
        user.otpExpires = null; // Clear the expiry time

        await user.save(); // Save the updated user

        res.status(200).json({ message: 'User registered successfully and verified!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error verifying OTP.', error: err });
    }
});


// Import necessary libraries
const jwt = require('jsonwebtoken');

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        // Check if the user is verified
        if (!user.verified) {
            return res.status(403).json({ message: 'Email not verified. Please verify your email first.' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Respond with the token
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error during login.' });
    }
});


const fetchProtectedData = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/protected-route', {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);
};





module.exports = router;
