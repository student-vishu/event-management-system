const bcrypt = require('bcryptjs');
const { HASH } = require('../constants');

const hashPassword = (password) => bcrypt.hash(password, HASH.SALT_ROUNDS);

const comparePassword = (password, hash) => bcrypt.compare(password, hash);

module.exports = { hashPassword, comparePassword };
