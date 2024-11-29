// const jwt = require('jsonwebtoken');

// // Middleware to check if the user is logged in
// exports.isLoggedIn = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1]; // Expecting 'Bearer <token>'
    
//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized: No token provided' });
//     }
    
//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Replace with your secret
//         req.user = decoded; // Add user info to the request object
//         next(); // Proceed to the next middleware/controller
//     } catch (error) {
//         console.error('Token verification error:', error);
//         return res.status(401).json({ message: 'Unauthorized: Invalid token' });
//     }
// };

