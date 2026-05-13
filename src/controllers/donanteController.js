const { Donante } = require('../models/index');

const obtenerDonantes = async (req, res) => {
  try {
    const donantes = await Donante.findAll();
    res.json(donantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const obtenerDonantePorId = async (req, res) => {
  try {
    const donante = await Donante.findByPk(req.params.id);
    if (!donante) return res.status(404).json({ error: 'Donante no encontrado' });
    res.json(donante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const crearDonante = async (req, res) => {
  try {
    const donante = await Donante.create(req.body);
    res.status(201).json(donante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const actualizarDonante = async (req, res) => {
  try {
    const donante = await Donante.findByPk(req.params.id);
    if (!donante) return res.status(404).json({ error: 'Donante no encontrado' });
    await donante.update(req.body);
    res.json(donante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const eliminarDonante = async (req, res) => {
  try {
    const donante = await Donante.findByPk(req.params.id);
    if (!donante) return res.status(404).json({ error: 'Donante no encontrado' });
    await donante.destroy();
    res.json({ mensaje: 'Donante eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  obtenerDonantes,
  obtenerDonantePorId,
  crearDonante,
  actualizarDonante,
  eliminarDonante
};