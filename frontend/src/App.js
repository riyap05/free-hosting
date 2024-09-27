import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUploadForm from './FileUploadForm';
import Login from './Login';
import Register from './Register';
import Header from './Header'; // Import the Header
import { isLoggedIn } from './isLoggedIn';// Import your utility function
import Home from './Home';

const App = () => {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Disable scrolling
        document.body.style.overflow = 'hidden';

        // Enable scrolling when component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        setIsAuthenticated(isLoggedIn()); // Use the utility function to check login status
    }, []);

    const handleSuccessfulLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token on logout
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
            <Routes>
                <Route
                    path="/"
                    element={isAuthenticated ? <FileUploadForm /> : <Home />}
                />
                <Route path="/login" element={<Login onSuccessfulLogin={handleSuccessfulLogin} />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
};

export default App;
