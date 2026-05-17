const { Beneficiario } = require('../models/index');

const obtenerBeneficiarios = async (req, res) => {
  try {
    const beneficiarios = await Beneficiario.findAll();
    res.json(beneficiarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const obtenerBeneficiarioPorId = async (req, res) => {
  try {
    const beneficiario = await Beneficiario.findByPk(req.params.id);
    if (!beneficiario) return res.status(404).json({ error: 'Beneficiario no encontrado' });
    res.json(beneficiario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const crearBeneficiario = async (req, res) => {
  try {
    const beneficiario = await Beneficiario.create(req.body);
    res.status(201).json(beneficiario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const actualizarBeneficiario = async (req, res) => {
  try {
    const beneficiario = await Beneficiario.findByPk(req.params.id);
    if (!beneficiario) return res.status(404).json({ error: 'Beneficiario no encontrado' });
    await beneficiario.update(req.body);
    res.json(beneficiario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const eliminarBeneficiario = async (req, res) => {
  try {
    const beneficiario = await Beneficiario.findByPk(req.params.id);
    if (!beneficiario) return res.status(404).json({ error: 'Beneficiario no encontrado' });
    await beneficiario.destroy();
    res.json({ mensaje: 'Beneficiario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  obtenerBeneficiarios,
  obtenerBeneficiarioPorId,
  crearBeneficiario,
  actualizarBeneficiario,
  eliminarBeneficiario
};