const sequelize = require('../config/database');
const User = require('./user.model');
const Event = require('./event.model');
const Invite = require('./invite.model');

User.hasMany(Event, { foreignKey: 'creator_id', onDelete: 'CASCADE' });
Event.belongsTo(User, { foreignKey: 'creator_id' });

Event.hasMany(Invite, { foreignKey: 'event_id', onDelete: 'CASCADE' });
Invite.belongsTo(Event, { foreignKey: 'event_id' });

User.hasMany(Invite, { foreignKey: 'user_id' });
Invite.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { sequelize, User, Event, Invite };
