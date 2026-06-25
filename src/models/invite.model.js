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

module.exports = Invite;
