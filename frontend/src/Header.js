import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isLoggedIn } from './isLoggedIn'; // Import your utility function

const Header = ({ onLogout }) => {
    const [isLoggedInState, setIsLoggedInState] = useState(false);

    useEffect(() => {
        setIsLoggedInState(isLoggedIn()); // Check login status using the utility function
    }, []);

    return (
        <header className="flex justify-between p-4 bg-teal-600 text-white">
            <h1 className="text-xl">Hostify</h1>
            <div>
                {isLoggedInState ? (
                    <button onClick={onLogout} className="ml-4 text-white">Log Out</button>
                ) : (
                    <>
                        <Link to="/login" className="ml-4">
                            <button className="text-white">Log In</button>
                        </Link>
                        <Link to="/register" className="ml-4">
                            <button className="text-white">Register</button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
