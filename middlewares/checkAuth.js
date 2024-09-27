const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from Bearer header

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access - Token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.userId = decoded.id; // Attach userId to request object
        next(); // Move to next middleware/route handler
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized access - Invalid token' });
    }
};

module.exports = checkAuth;
