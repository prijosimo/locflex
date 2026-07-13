// AUTH MIDDLEWARE to protects routes that require a logged-in user

const jwt = require('jsonwebtoken');

    const authenticateToken = (req, res, next) => {
    // The token is sent in the authorization header as "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

  // If no token was provided, reject the request
    if (!token) {
        return res.status(401).json({ error: 'Access denied — no token provided' });
    }

    try {
        // Verifying the token using the secret key from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attaching the users ID to the request so route handlers can use it
        req.userId = decoded.userId;

        // Calling next() to pass control to the actual route handler
        next();
    } catch (err) {
        // If the token is expired, reject the request
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// Exporting the middleware so it can be used in any route file
module.exports = authenticateToken;