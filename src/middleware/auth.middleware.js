const { verifyToken } = require('../utils/jwt');
const { get } = require('../services/redis.service');
const UserModel = require('../repositories/user.repository');
const { AUTH } = require('../constants');

const authMiddleware = async (req) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith(AUTH.BEARER_PREFIX) ? authHeader.slice(AUTH.BEARER_PREFIX_LENGTH) : null;

    if (!token) return null;

    const blacklisted = await get(`blacklist:${token}`);
    if (blacklisted) return null;

    const decoded = verifyToken(token);

    const user = await UserModel.findUserById(decoded.userId);
    if (!user) return null;

    if (user.password_changed_at) {
      const passwordChangedAt = Math.floor(new Date(user.password_changed_at).getTime() / 1000);
      if (decoded.iat < passwordChangedAt) return null;
    }

    return { ...user.toJSON(), token, tokenExp: decoded.exp };
  } catch (err) {
    return null;
  }
};

module.exports = { authMiddleware };
