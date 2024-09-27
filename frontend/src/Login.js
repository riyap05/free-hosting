import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onSuccessfulLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token); // Store the token in local storage
                onSuccessfulLogin(); // Update authentication state
                navigate('/'); // Redirect to home after successful login
            } else {
                setError('Invalid credentials or unverified email.');
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Error occurred. Please try again.');
            } else {
                setError('Error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="flex items-center justify-center flex-grow">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center text-teal-600">Login</h2>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                    />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 focus:outline-none"
                    >
                        Login
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <p className="mt-4 text-center">
                        Not a user? 
                        <button
                            onClick={() => navigate('/register')}
                            className="text-teal-600 underline bg-transparent border-none cursor-pointer pl-2"
                        >
                            Register here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
