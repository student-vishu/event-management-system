const Event = require('../models/event.model');

const createEvent = ({ title, description, date, location, creatorId }) =>
  Event.create({ title, description, date, location, creator_id: creatorId });

const findEventById = (id) => Event.findByPk(id);

const updateEvent = async (id, fields) => {
  const allowed = ['title', 'description', 'date', 'location'];
  const updates = {};

  allowed.forEach((key) => {
    if (key in fields) updates[key] = fields[key];
  });

  if (Object.keys(updates).length === 0) throw new Error('No fields to update');

  await Event.update(updates, { where: { id } });
  return Event.findByPk(id);
};

module.exports = { createEvent, findEventById, updateEvent };
