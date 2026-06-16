const { verifyToken } = require('../utils/jwt');
const { get } = require('../services/redis.service');
const UserModel = require('../models/user.model');

const authMiddleware = async (req) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return null;

  const blacklisted = await get(`blacklist:${token}`);
  if (blacklisted) return null;

  const decoded = verifyToken(token);
  const user = await UserModel.findUserById(decoded.userId);

  return { ...user, token, tokenExp: decoded.exp };
};

module.exports = { authMiddleware };
