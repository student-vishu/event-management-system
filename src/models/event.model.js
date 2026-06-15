const pool = require('../config/database');

const EventModel = {
  async createEvent({ title, description, date, location, creatorId }) {
    const { rows } = await pool.query(
      'INSERT INTO events (title, description, date, location, creator_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, date, location, creatorId]
    );
    return rows[0];
  },

  async findEventById(id) {
    const { rows } = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async updateEvent(id, fields) {
    const allowed = ['title', 'description', 'date', 'location'];
    const updates = [];
    const values = [];

    allowed.forEach((key) => {
      if (key in fields) {
        values.push(fields[key]);
        updates.push(`${key} = $${values.length}`);
      }
    });

    if (updates.length === 0) throw new Error('No fields to update');

    values.push(id);
    const query = `UPDATE events SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;

    const { rows } = await pool.query(query, values);
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
