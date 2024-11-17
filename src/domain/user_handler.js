const { v4: uuidv4 } = require('uuid');
const { User } = require('../../models');
const authHandler = require('./auth_handler');

// Addera ny user
exports.addUser = async (user) => {
    if (!user.password) throw new Error("Password is required to create a user.");

    user.id = uuidv4(); // Generera unique ID
    user.password = await authHandler.cryptPassword(user.password); // Hash lösenord
    return await User.create({
        id: user.id,
        username: user.username,
        password: user.password,
        email: user.email,
        role: user.role,
        grupp: user.grupp || null,
        field: user.field || null,
        isActive: user.isActive,
        warning: user.warning,
        isBlocked: user.isBlocked,
        isAdmin: user.isAdmin,
        lastLogin: user.lastLogin,
        lastPasswordChange: user.lastPasswordChange,
        createdBy: user.createdBy,
        updatedBy: user.updatedBy,
        deletedAt: user.deletedAt,
    });
};

// hämta all users
exports.getUsers = async () => {
    return await User.findAll({ attributes: { exclude: ['password'] } });
};


exports.getUserByUsername = async (username) => {
    return await User.findOne({ where: { username } });
};



// Hämta user med ID
exports.getUserById = async (id) => {
    return await User.findByPk(id, { attributes: { exclude: ['password'] } });
};

// Radera user med ID
exports.deleteUserById = async (id) => {
    return await User.destroy({ where: { id } });
};

// Updatera user med ID
exports.updateUserById = async (id, updates) => {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(updates);
};

// Varna user med ID
exports.warnUserById = async (id, warningMessage) => {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update({ warning: warningMessage });
};

// Blockera user med ID
exports.blockUserById = async (id) => {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update({ isBlocked: true });
};
