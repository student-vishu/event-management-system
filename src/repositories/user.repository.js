const User = require('../models/user.model');

const findUserByEmail = (email) => User.findOne({ where: { email } });

const findUserById = (id) => User.findByPk(id);

const createUser = ({ name, email, passwordHash }) =>
  User.create({ name, email, password_hash: passwordHash });

const updatePassword = (id, passwordHash) =>
  User.update({ password_hash: passwordHash }, { where: { id } });

module.exports = { findUserByEmail, findUserById, createUser, updatePassword };
