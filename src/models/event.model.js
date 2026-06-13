const pool = require('../config/database');

const EventModel = {
  async create({ title, description, date, location, creatorId }) {
    const { rows } = await pool.query(
      'INSERT INTO events (title, description, date, location, creator_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, date, location, creatorId]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async update(id, { title, description, date, location }) {
    const { rows } = await pool.query(
      'UPDATE events SET title = $1, description = $2, date = $3, location = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [title, description, date, location, id]
    );
    return rows[0];
  },

  async findAllForUser(userId) {
    const { rows } = await pool.query(
      `SELECT DISTINCT e.* FROM events e
       LEFT JOIN event_invites ei ON ei.event_id = e.id
       WHERE e.creator_id = $1 OR ei.user_id = $1
       ORDER BY e.date DESC`,
      [userId]
    );
    return rows;
  },
};

module.exports = EventModel;
