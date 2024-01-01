const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        console.log('Headers:', req.headers);
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new Error('Authorization header is missing');
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new Error('Token is missing from Authorization header');
        }
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT secret is not defined in environment variables');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        let errorMessage = 'Authentication failed';
        if (error instanceof jwt.JsonWebTokenError) {
            errorMessage = 'Invalid JWT token';
        } else if (error instanceof jwt.TokenExpiredError) {
            errorMessage = 'JWT token has expired';
        }
        if (process.env.NODE_ENV === 'development') {
            console.error('Auth Middleware Error:', error);
        }
        return res.status(401).json({ message: errorMessage });
    }
};

module.exports = authMiddleware;
