const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Beneficiario = sequelize.define(
  'Beneficiario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nombre_completo: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    correo: {
      type: DataTypes.STRING,
    },

    telefono: {
      type: DataTypes.STRING,
    },

    direccion: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'beneficiarios',
    timestamps: true,
  }
);

module.exports = Beneficiario;