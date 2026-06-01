const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EntregaProducto = sequelize.define(
  'EntregaProducto',
  {
    entrega_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    cantidad: {
      type: DataTypes.FLOAT,
      defaultValue: 1,
    },
  },
  {
    tableName: 'entrega_productos',
    timestamps: false,
  }
);

module.exports = EntregaProducto;