const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Patient = sequelize.define('Patient', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER },
  gender: { type: DataTypes.ENUM('Male','Female','Other') },
  blood: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING },
  dept: { type: DataTypes.STRING },
  doctorId: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT }
}, { tableName: 'patients', timestamps: true });

module.exports = Patient;
