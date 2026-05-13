const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Producto = sequelize.define('Producto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  categoria: { type: DataTypes.STRING },
  tipo: { type: DataTypes.ENUM('perecedero', 'no_perecedero'), allowNull: false },
  cantidad: { type: DataTypes.FLOAT, defaultValue: 0 },
  fecha_vencimiento: { type: DataTypes.DATE },
  estado: { type: DataTypes.STRING, defaultValue: 'disponible' }
}, { tableName: 'productos', timestamps: true });

module.exports = Producto;