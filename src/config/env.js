require('dotenv').config();
const { ENV } = require('../constants');

module.exports = {
  port: process.env.PORT || ENV.DEFAULT_PORT,

  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

  resetTokenExpiry: process.env.RESET_TOKEN_EXPIRY || ENV.DEFAULT_RESET_TOKEN_EXPIRY,
};
