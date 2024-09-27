import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState(''); // State for username
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/register', { username, email, password }); // Include username in the request
            if (response.data.message === 'OTP sent to your email!') {
                setSuccessMessage('OTP sent! Please check your email.');
                setError('');
                setOtpSent(true);
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Error occurred. Please try again.');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/verify-otp', { email, otp });
            setSuccessMessage(response.data.message);
            setError('');
            if (response.data.message === 'User registered successfully and verified!') {
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            setError('Error occurred during OTP verification. Please try again.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-teal-600">Register</h2>
                
                {/* Username Input */}
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                />
                
                {/* Email Input */}
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                />
                
                {/* Password Input */}
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                />
                
                {/* Register Button */}
                <button
                    onClick={handleRegister}
                    className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 focus:outline-none"
                >
                    Register
                </button>
                
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}

                {otpSent && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter your OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 mt-4 mb-4"
                        />
                        <button
                            onClick={handleVerifyOtp}
                            className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 focus:outline-none"
                        >
                            Verify OTP
                        </button>
                    </>
                )}

                <p className="mt-4 text-center">
                    Already have an account? 
                    <button
                        onClick={() => navigate('/login')}
                        className="text-teal-600 underline bg-transparent border-none cursor-pointer pl-2"
                    >
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
