const { sequelize } = require('../config/database');

const Usuario = require('./Usuario');
const Donante = require('./Donante');
const Producto = require('./Producto');

const Beneficiario = require('./Beneficiario');
const Entrega = require('./Entrega');
const EntregaProducto = require('./EntregaProducto');

const { DataTypes } = require('sequelize');

/* ==========================
   DONACIONES
========================== */

const Donacion = sequelize.define(
  'Donacion',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    donante_id: {
      type: DataTypes.INTEGER,
    },

    cantidad: {
      type: DataTypes.FLOAT,
    },

    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'donaciones',
    timestamps: true,
  }
);

const DonacionProducto = sequelize.define(
  'DonacionProducto',
  {
    donacion_id: DataTypes.INTEGER,
    producto_id: DataTypes.INTEGER,
  },
  {
    tableName: 'donacion_productos',
    timestamps: false,
  }
);

/* ==========================
   ASOCIACIONES DONACIONES
========================== */

Usuario.hasMany(Donacion, {
  foreignKey: 'usuario_id',
});

Donacion.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
});

Donante.hasMany(Donacion, {
  foreignKey: 'donante_id',
});

Donacion.belongsTo(Donante, {
  foreignKey: 'donante_id',
});

Donacion.belongsToMany(Producto, {
  through: DonacionProducto,
  foreignKey: 'donacion_id',
});

Producto.belongsToMany(Donacion, {
  through: DonacionProducto,
  foreignKey: 'producto_id',
});

/* ==========================
   ASOCIACIONES ENTREGAS
========================== */

Beneficiario.hasMany(Entrega, {
  foreignKey: 'beneficiario_id',
});

Entrega.belongsTo(Beneficiario, {
  foreignKey: 'beneficiario_id',
});

Entrega.belongsToMany(Producto, {
  through: EntregaProducto,
  foreignKey: 'entrega_id',
});

Producto.belongsToMany(Entrega, {
  through: EntregaProducto,
  foreignKey: 'producto_id',
});

/* ==========================
   EXPORTS
========================== */

module.exports = {
  sequelize,

  Usuario,
  Donante,
  Producto,

  Beneficiario,
  Entrega,
  EntregaProducto,

  Donacion,
  DonacionProducto,
};