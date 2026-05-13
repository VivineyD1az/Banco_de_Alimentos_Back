const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Donante = sequelize.define('Donante', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_completo: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING },
  direccion: { type: DataTypes.STRING }
}, { tableName: 'donantes', timestamps: true });

module.exports = Donante;