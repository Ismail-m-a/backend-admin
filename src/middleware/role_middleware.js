const { getUserById } = require('../domain/user_handler');

exports.checkAdmin = async (req, res, next) => {
    try {
        // Ensure the authenticated user is populated in req.user (via isLoggedIn middleware)
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
        }

        // Fetch user information to verify their role
        const user = await getUserById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Authenticated user not found.' });
        }

        // Check if the user has the admin role
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges are required.' });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error in checkAdmin middleware:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
