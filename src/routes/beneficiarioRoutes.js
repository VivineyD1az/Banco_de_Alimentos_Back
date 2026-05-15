const express = require('express');
const router = express.Router();
const {
  obtenerBeneficiarios,
  obtenerBeneficiarioPorId,
  crearBeneficiario,
  actualizarBeneficiario,
  eliminarBeneficiario
} = require('../controllers/beneficiarioController');

router.get('/', obtenerBeneficiarios);
router.get('/:id', obtenerBeneficiarioPorId);
router.post('/', crearBeneficiario);
router.put('/:id', actualizarBeneficiario);
router.delete('/:id', eliminarBeneficiario);

module.exports = router;