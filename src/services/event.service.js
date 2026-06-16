const EventModel = require('../models/event.model');
const InviteModel = require('../models/invite.model');
const UserModel = require('../models/user.model');

const createEvent = async (userId, { title, description, date, location }) => {
  const event = await EventModel.createEvent({
    title,
    description,
    date,
    location,
    creatorId: userId,
  });
  return event;
};

const updateEvent = async (userId, id, fields) => {
  const event = await EventModel.findEventById(id);
  if (!event) throw new Error('Event not found');
  if (event.creator_id !== userId) throw new Error('Not authorized to update this event');

  return EventModel.updateEvent(id, fields);
};

const listEvents = async (userId, { page = 1, limit = 10, search, sortBy = 'date', sortOrder = 'DESC', dateFrom, dateTo }) => {
  const offset = (page - 1) * limit;
  const allowedSortFields = ['date', 'title', 'created_at'];
  const allowedSortOrders = ['ASC', 'DESC'];

  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'date';
  const safeSortOrder = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

  const conditions = ['(e.creator_id = $1 OR ei.user_id = $1)'];
  const values = [userId];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`(e.title ILIKE $${values.length} OR e.description ILIKE $${values.length})`);
  }

  if (dateFrom) {
    values.push(dateFrom);
    conditions.push(`e.date >= $${values.length}`);
  }

  if (dateTo) {
    values.push(dateTo);
    conditions.push(`e.date <= $${values.length}`);
  }

  const where = conditions.join(' AND ');

  const { rows: events } = await require('../config/database').query(
    `SELECT DISTINCT e.* FROM events e
     LEFT JOIN event_invites ei ON ei.event_id = e.id
     WHERE ${where}
     ORDER BY e.${safeSortBy} ${safeSortOrder}
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, offset]
  );

  const { rows: countRows } = await require('../config/database').query(
    `SELECT COUNT(DISTINCT e.id) FROM events e
     LEFT JOIN event_invites ei ON ei.event_id = e.id
     WHERE ${where}`,
    values
  );

  return {
    events,
    total: parseInt(countRows[0].count),
    page,
    limit,
  };
};

const eventDetail = async (userId, id) => {
  const event = await EventModel.findEventById(id);
  if (!event) throw new Error('Event not found');

  const invites = await InviteModel.findInvitesByEventId(id);
  const isCreator = event.creator_id === userId;
  const isInvited = invites.some((i) => i.user_id === userId);

  if (!isCreator && !isInvited) throw new Error('Not authorized to view this event');

  return event;
};

const inviteUsers = async (userId, eventId, emails) => {
  const event = await EventModel.findEventById(eventId);
  if (!event) throw new Error('Event not found');
  if (event.creator_id !== userId) throw new Error('Not authorized to invite users to this event');

  const results = [];

  for (const email of emails) {
    const existingInvites = await InviteModel.findInvitesByEventId(eventId);
    const alreadyInvited = existingInvites.some((i) => i.email === email);

    if (alreadyInvited) {
      results.push({ email, status: 'already invited' });
      continue;
    }

    const user = await UserModel.findUserByEmail(email);
    await InviteModel.createInvite({ eventId, email, userId: user ? user.id : null });
    results.push({ email, status: 'invited' });
  }

  return results;
};

module.exports = { createEvent, updateEvent, listEvents, eventDetail, inviteUsers };
