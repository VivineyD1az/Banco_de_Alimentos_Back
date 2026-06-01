const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// ============================================
// MODELOS EXISTENTES
// ============================================

const Usuario = require('./Usuario');
const Donante = require('./Donante');
const Producto = require('./Producto');

// ============================================
// NUEVOS MODELOS
// ============================================

const Beneficiario = sequelize.define('Beneficiario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  tipo: { type: DataTypes.STRING },
  direccion: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING },
  correo: { type: DataTypes.STRING }
}, { tableName: 'beneficiarios', timestamps: true });

const Entrega = sequelize.define('Entrega', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  beneficiario_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'entregas', timestamps: true });

const EntregaProducto = sequelize.define('EntregaProducto', {
  entrega_id: { type: DataTypes.INTEGER },
  producto_id: { type: DataTypes.INTEGER }
}, { tableName: 'entrega_productos', timestamps: false });

// ============================================
// TABLAS PIVOTE DE DONACIONES
// ============================================

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

// ============================================
// ASOCIACIONES — DONACIONES
// ============================================

Usuario.hasMany(Donacion, { foreignKey: 'usuario_id' });
Donacion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Donante.hasMany(Donacion, { foreignKey: 'donante_id' });
Donacion.belongsTo(Donante, { foreignKey: 'donante_id' });

Donacion.belongsToMany(Producto, { through: DonacionProducto, foreignKey: 'donacion_id' });
Producto.belongsToMany(Donacion, { through: DonacionProducto, foreignKey: 'producto_id' });

// ============================================
// ASOCIACIONES — ENTREGAS
// ============================================

Entrega.belongsTo(Beneficiario, { foreignKey: 'beneficiario_id' });
Beneficiario.hasMany(Entrega, { foreignKey: 'beneficiario_id' });

Entrega.belongsToMany(Producto, { through: EntregaProducto, foreignKey: 'entrega_id' });
Producto.belongsToMany(Entrega, { through: EntregaProducto, foreignKey: 'producto_id' });

// ============================================
// EXPORTS
// ============================================

module.exports = {
  sequelize,
  Usuario,
  Donante,
  Producto,
  Donacion,
  DonacionProducto,
  Beneficiario,
  Entrega,
  EntregaProducto
};