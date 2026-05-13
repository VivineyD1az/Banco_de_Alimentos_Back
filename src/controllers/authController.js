const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/index');

// Login
const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre_completo: usuario.nombre_completo,
        correo: usuario.correo,
        rol: usuario.rol,
        telefono: usuario.telefono
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Registrar usuario (solo admin)
const registrar = async (req, res) => {
  try {
    const { nombre_completo, correo, password, rol, telefono } = req.body;

    // Verificar si ya existe
    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre_completo,
      correo,
      password: hash,
      rol: rol || 'voluntario',
      telefono
    });

    res.status(201).json({
      id: usuario.id,
      nombre_completo: usuario.nombre_completo,
      correo: usuario.correo,
      rol: usuario.rol
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener perfil propio
const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar perfil
const actualizarPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    const { nombre_completo, telefono } = req.body;
    await usuario.update({ nombre_completo, telefono });
    res.json({
      id: usuario.id,
      nombre_completo: usuario.nombre_completo,
      correo: usuario.correo,
      rol: usuario.rol,
      telefono: usuario.telefono
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cambiar contraseña
const cambiarPassword = async (req, res) => {
  try {
    const { password_actual, password_nuevo } = req.body;
    const usuario = await Usuario.findByPk(req.usuario.id);

    const valido = await bcrypt.compare(password_actual, usuario.password);
    if (!valido) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
    }

    const hash = await bcrypt.hash(password_nuevo, 10);
    await usuario.update({ password: hash });

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login, registrar, obtenerPerfil, actualizarPerfil, cambiarPassword };