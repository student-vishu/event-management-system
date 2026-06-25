const Invite = require('../models/invite.model');

const createInvite = ({ eventId, email, userId }) =>
  Invite.create({ event_id: eventId, email, user_id: userId || null });

const findInvitesByEmail = (email) => Invite.findAll({ where: { email } });

const linkUserToInvites = (email, userId) =>
  Invite.update({ user_id: userId }, { where: { email, user_id: null } });

const findInvitesByEventId = (eventId) => Invite.findAll({ where: { event_id: eventId } });

module.exports = { createInvite, findInvitesByEmail, linkUserToInvites, findInvitesByEventId };
