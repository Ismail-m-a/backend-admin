// auth_middleware.js
const { getUserById } = require('../domain/user_handler');

exports.checkAdmin = (req, res, next) => {
    const userId = req.body.authorId || req.params.userId; // User Id ska skrivas i body request

    // Hämta user för Kontroll rollen
    const user = getUserById(userId);

    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next(); 
};
