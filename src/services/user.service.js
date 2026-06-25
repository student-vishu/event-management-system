const UserModel = require('../repositories/user.repository');
const InviteModel = require('../repositories/invite.repository');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const { setWithExpiry, get, del } = require('./redis.service');
const { validate, registerSchema, loginSchema, changePasswordSchema, updatePasswordSchema } = require('../utils/validators');
const env = require('../config/env');
const crypto = require('crypto');

const register = async ({ name, email, password }) => {
  validate(registerSchema, { name, email, password });

  const existing = await UserModel.findUserByEmail(email);
  if (existing) throw new Error('Email already registered');

  const passwordHash = await hashPassword(password);
  const user = await UserModel.createUser({ name, email, passwordHash });

  await InviteModel.linkUserToInvites(email, user.id);

  const token = generateToken({ userId: user.id });
  return { token, user };
};

const login = async ({ email, password }) => {
  validate(loginSchema, { email, password });

  const user = await UserModel.findUserByEmail(email);
  if (!user) throw new Error('Invalid email or password');

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) throw new Error('Invalid email or password');

  await InviteModel.linkUserToInvites(email, user.id);

  const token = generateToken({ userId: user.id });
  return { token, user };
};

const logout = async (token, tokenExp) => {
  const ttl = tokenExp - Math.floor(Date.now() / 1000);
  if (ttl > 0) await setWithExpiry(`blacklist:${token}`, '1', ttl);
  return { message: 'Logged out successfully' };
};

const changePassword = async (userId, { oldPassword, newPassword }) => {
  validate(changePasswordSchema, { oldPassword, newPassword });

  const user = await UserModel.findUserById(userId);
  if (!user) throw new Error('User not found');

  const valid = await comparePassword(oldPassword, user.password_hash);
  if (!valid) throw new Error('Old password is incorrect');

  const passwordHash = await hashPassword(newPassword);
  await UserModel.updatePassword(userId, passwordHash);
  return { message: 'Password changed successfully' };
};

const resetPassword = async (email) => {
  const user = await UserModel.findUserByEmail(email);
  if (!user) return { message: 'If this email is registered, you will receive a reset token' };

  const token = crypto.randomBytes(32).toString('hex');
  await setWithExpiry(`reset:${token}`, user.id.toString(), Number(env.resetTokenExpiry));

  return { message: `If this email is registered, you will receive a reset token. Token: ${token}` };
};

const updatePassword = async ({ token, newPassword }) => {
  validate(updatePasswordSchema, { token, newPassword });

  const userId = await get(`reset:${token}`);
  if (!userId) throw new Error('Invalid or expired reset token');

  const passwordHash = await hashPassword(newPassword);
  await UserModel.updatePassword(userId, passwordHash);
  await del(`reset:${token}`);

  return { message: 'Password updated successfully' };
};

module.exports = { register, login, logout, changePassword, resetPassword, updatePassword };
