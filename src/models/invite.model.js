const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invite = sequelize.define('Invite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'event_invites',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

const createInvite = ({ eventId, email, userId }) =>
  Invite.create({ event_id: eventId, email, user_id: userId || null });

const findInvitesByEmail = (email) => Invite.findAll({ where: { email } });

const linkUserToInvites = (email, userId) =>
  Invite.update({ user_id: userId }, { where: { email, user_id: null } });

const findInvitesByEventId = (eventId) => Invite.findAll({ where: { event_id: eventId } });

module.exports = { Invite, createInvite, findInvitesByEmail, linkUserToInvites, findInvitesByEventId };
