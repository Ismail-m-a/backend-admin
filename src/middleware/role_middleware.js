// auth_middleware.js
const { getUserById } = require('../domain/user_handler');

exports.checkAdmin = (req, res, next) => {
    const userId = req.body.authorId || req.params.userId; // Assumes user ID is provided in request

    // Retrieve the user to check their role
    const user = getUserById(userId);

    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next(); // If user is an admin, proceed to the next middleware or route handler
};
