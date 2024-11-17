const { getUserById } = require('../domain/user_handler');

exports.checkAdmin = async (req, res, next) => {
    try {
        const userId = req.body.userId || req.params.userId || req.query.userId; 
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        const user = await getUserById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        next();
    } catch (error) {
        console.error('Error in checkAdmin middleware:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
