const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Entrega = sequelize.define(
  'Entrega',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    beneficiario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'entregas',
    timestamps: true,
  }
);

module.exports = Entrega;