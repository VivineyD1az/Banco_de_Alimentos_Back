const Usuario = require('./Usuario');
const Donante = require('./Donante');
const Producto = require('./Producto');
const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Donacion = sequelize.define('Donacion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: true },
  donante_id: { type: DataTypes.INTEGER },
  cantidad: { type: DataTypes.FLOAT },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'donaciones', timestamps: true });

const DonacionProducto = sequelize.define('DonacionProducto', {
  donacion_id: { type: DataTypes.INTEGER },
  producto_id: { type: DataTypes.INTEGER }
}, { tableName: 'donacion_productos', timestamps: false });

Usuario.hasMany(Donacion, { foreignKey: 'usuario_id' });
Donacion.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Donante.hasMany(Donacion, { foreignKey: 'donante_id' });
Donacion.belongsTo(Donante, { foreignKey: 'donante_id' });
Donacion.belongsToMany(Producto, { through: DonacionProducto, foreignKey: 'donacion_id' });
Producto.belongsToMany(Donacion, { through: DonacionProducto, foreignKey: 'producto_id' });

module.exports = { sequelize, Usuario, Donante, Producto, Donacion, DonacionProducto };