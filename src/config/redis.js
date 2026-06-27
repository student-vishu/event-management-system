const redis = require('redis');
const env = require('./env');

const client = redis.createClient({
  socket: {
    host: env.redis.host,
    port: env.redis.port,
  },
});

client.on('error', (err) => console.error('Redis error:', err));

module.exports = client;
