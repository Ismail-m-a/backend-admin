const jwt = require('jsonwebtoken');

exports.extractUserId = (req, res, next) => {
    // token från header eller cookies
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.error("Token not found in cookies or headers.");
        return res.status(401).json({ message: 'Authentication required. Token missing.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.authorId = decoded.id; 
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};
