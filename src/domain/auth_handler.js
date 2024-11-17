const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const { getUserGroups, getUserById } = require('./user_handler');

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key';
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret_key';

// Generera Access Token
exports.generateAccessToken = (user) => {
    const groups = getUserGroups ? getUserGroups(user.id) : [];
    const payload = {
        id: user.id,
        username: user.username,
        groups
    };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' });
};


// Generera Refresh Token
exports.generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
};

// Generera CSRF Token
exports.generateCsrfToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Validate Access Token
exports.validateAccessToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        console.error("Token verification error:", error.message);
        return null;
    }
};

// Validate Refresh Token
exports.validateRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_SECRET_KEY);
    } catch (error) {
        console.error("Refresh Token Validation Error:", error.message);
        return null;
    }
};

// Hash Password
exports.cryptPassword = async (plainPassword) => {
    const saltRounds = 10;
    if (!plainPassword || typeof plainPassword !== 'string') {
        throw new Error("Valid plain password is required.");
    }
    return await bcrypt.hash(plainPassword, saltRounds);
};

exports.compareHashedPasswords = async (plainPassword, hashedPassword) => {
    console.log("Plain password:", plainPassword);
    console.log("Hashed password:", hashedPassword);
    if (!plainPassword || !hashedPassword) {
        throw new Error("Both plainPassword and hashedPassword are required.");
    }
    return await bcrypt.compare(plainPassword, hashedPassword);
};

