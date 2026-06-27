const EventModel = require('../repositories/event.repository');
const InviteModel = require('../repositories/invite.repository');
const UserModel = require('../repositories/user.repository');
const { validate, createEventSchema, updateEventSchema, inviteUsersSchema } = require('../utils/validators');
const { notFoundError, forbiddenError } = require('../utils/errors');
const { EVENT } = require('../constants');

const createEvent = async (userId, { title, description, date, location }) => {
  validate(createEventSchema, { title, description, date, location });

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
  validate(updateEventSchema, fields);

  const event = await EventModel.findEventById(id);
  if (!event) throw notFoundError('Event not found');
  if (event.creator_id !== userId) throw forbiddenError('Not authorized to update this event');

  return EventModel.updateEvent(id, fields);
};

const listEvents = async (userId, { page = EVENT.DEFAULT_PAGE, limit = EVENT.DEFAULT_LIMIT, search, sortBy = EVENT.DEFAULT_SORT_BY, sortOrder = EVENT.DEFAULT_SORT_ORDER, dateFrom, dateTo }) => {
  const safePage = Math.max(1, parseInt(page) || EVENT.DEFAULT_PAGE);
  const safeLimit = Math.min(Math.max(1, parseInt(limit) || EVENT.DEFAULT_LIMIT), EVENT.MAX_LIMIT);
  const offset = (safePage - 1) * safeLimit;

  const safeSortBy = EVENT.ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : EVENT.DEFAULT_SORT_BY;
  const safeSortOrder = EVENT.ALLOWED_SORT_ORDERS.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : EVENT.DEFAULT_SORT_ORDER;

  const { events, total } = await EventModel.findAllForUser({
    userId,
    safeSortBy,
    safeSortOrder,
    safeLimit,
    offset,
    search,
    dateFrom,
    dateTo,
  });

  return {
    events,
    total,
    page: safePage,
    limit: safeLimit,
  };
};

const eventDetail = async (userId, id) => {
  const event = await EventModel.findEventById(id);
  if (!event) throw notFoundError('Event not found');

  const invites = await InviteModel.findInvitesByEventId(id);
  const isCreator = event.creator_id === userId;
  const isInvited = invites.some((i) => i.user_id === userId);

  if (!isCreator && !isInvited) throw forbiddenError('Not authorized to view this event');

  return event;
};

const inviteUsers = async (userId, eventId, emails) => {
  validate(inviteUsersSchema, { emails });

  const event = await EventModel.findEventById(eventId);
  if (!event) throw notFoundError('Event not found');
  if (event.creator_id !== userId) throw forbiddenError('Not authorized to invite users to this event');

  const creator = await UserModel.findUserById(userId);
  const existingInvites = await InviteModel.findInvitesByEventId(eventId);
  const results = [];

  for (const email of emails) {
    if (email === creator.email) {
      results.push({ email, status: 'cannot invite yourself' });
      continue;
    }

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
