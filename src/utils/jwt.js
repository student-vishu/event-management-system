const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (payload) => jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

const verifyToken = (token) => jwt.verify(token, env.jwt.secret);

module.exports = { generateToken, verifyToken };
