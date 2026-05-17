const bcrypt = require('bcryptjs');
const { Usuario } = require('../models/index');

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nombre_completo, correo, telefono, rol, password } = req.body;
    
    // Contraseña por defecto si no se envía
    const passParaHashear = password || 'Banco2024*';
    const hash = await bcrypt.hash(passParaHashear, 10);

    const usuario = await Usuario.create({
      nombre_completo,
      correo,
      telefono,
      rol: rol || 'voluntario',
      password: hash
    });

    const resultado = usuario.toJSON();
    delete resultado.password;
    
    res.status(201).json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    await usuario.update(req.body);
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};