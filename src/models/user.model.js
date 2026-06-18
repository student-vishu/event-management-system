const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

const findUserByEmail = (email) => User.findOne({ where: { email } });

const findUserById = (id) => User.findByPk(id);

const createUser = ({ name, email, passwordHash }) =>
  User.create({ name, email, password_hash: passwordHash });

const updatePassword = (id, passwordHash) =>
  User.update({ password_hash: passwordHash }, { where: { id } });

module.exports = { User, findUserByEmail, findUserById, createUser, updatePassword };
