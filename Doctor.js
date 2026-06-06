const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Doctor = sequelize.define('Doctor', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('Doctor','Nurse','Specialist'), defaultValue: 'Doctor' },
  dept: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  qual: { type: DataTypes.STRING },
  exp: { type: DataTypes.INTEGER },
  avail: { type: DataTypes.STRING }
}, { tableName: 'doctors', timestamps: true });

module.exports = Doctor;
