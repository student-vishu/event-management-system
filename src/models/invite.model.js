const pool = require('../config/database');

const InviteModel = {
  async createInvite({ eventId, email, userId }) {
    const { rows } = await pool.query(
      'INSERT INTO event_invites (event_id, email, user_id) VALUES ($1, $2, $3) RETURNING *',
      [eventId, email, userId || null]
    );
    return rows[0];
  },

  async findInvitesByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM event_invites WHERE email = $1',
      [email]
    );
    return rows;
  },

  async linkUserToInvites(email, userId) {
    await pool.query(
      'UPDATE event_invites SET user_id = $1 WHERE email = $2 AND user_id IS NULL',
      [userId, email]
    );
  },

  async findInvitesByEventId(eventId) {
    const { rows } = await pool.query(
      'SELECT * FROM event_invites WHERE event_id = $1',
      [eventId]
    );
    return rows;
  },
};

module.exports = InviteModel;
