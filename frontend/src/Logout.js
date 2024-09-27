import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout(); // Call the logout function passed as a prop
        navigate('/login'); // Redirect to the login page after logging out
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Are you sure you want to log out?</h2>
                <button
                    onClick={handleLogout}
                    className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
                >
                    Yes, Log Out
                </button>
                <button
                    onClick={() => navigate('/')} // Navigate back to home if user cancels
                    className="ml-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Logout;
