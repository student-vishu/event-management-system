const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  creator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Event;
