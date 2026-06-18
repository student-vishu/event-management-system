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

module.exports = { Event, createEvent, findEventById, updateEvent };
