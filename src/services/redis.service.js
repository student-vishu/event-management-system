const client = require('../config/redis');

const setWithExpiry = (key, value, seconds) => client.setEx(key, seconds, value);

const get = (key) => client.get(key);

const del = (key) => client.del(key);

module.exports = { setWithExpiry, get, del };
