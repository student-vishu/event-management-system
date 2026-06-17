const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (payload) => jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
console.log('generateTokenJWT:', generateToken({ userId: 123 })); // Debugging line to verify token generation

const verifyToken = (token) => jwt.verify(token, env.jwt.secret);

module.exports = { generateToken, verifyToken };
