const { Usuario } = require('../models/index');

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['password'] } });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { obtenerUsuarios };