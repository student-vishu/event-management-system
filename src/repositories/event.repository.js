const { Op } = require('sequelize');
const Event = require('../models/event.model');
const Invite = require('../models/invite.model');

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

const findAllForUser = async ({ userId, safeSortBy, safeSortOrder, safeLimit, offset, search, dateFrom, dateTo }) => {
  const conditions = [
    {
      [Op.or]: [
        { creator_id: userId },
        { '$Invites.user_id$': userId },
      ],
    },
  ];

  if (search) {
    conditions.push({
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ],
    });
  }

  if (dateFrom) conditions.push({ date: { [Op.gte]: dateFrom } });
  if (dateTo) conditions.push({ date: { [Op.lte]: dateTo } });

  const { count, rows } = await Event.findAndCountAll({
    where: { [Op.and]: conditions },
    include: [{ model: Invite, required: false }],
    distinct: true,
    order: [[safeSortBy, safeSortOrder]],
    limit: safeLimit,
    offset,
    subQuery: false,
  });

  return { events: rows, total: count };
};

module.exports = { createEvent, findEventById, updateEvent, findAllForUser };
