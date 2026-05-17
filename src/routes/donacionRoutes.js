const express = require('express');
const router = express.Router();
const {
  obtenerDonaciones,
  obtenerDonacionPorId,
  crearDonacion,
  crearDonacionPublica,
  actualizarDonacion,
  eliminarDonacion
} = require('../controllers/donacionController');

router.get('/', obtenerDonaciones);
router.get('/:id', obtenerDonacionPorId);
router.post('/', crearDonacion);
router.post('/public', crearDonacionPublica);
router.put('/:id', actualizarDonacion);

router.delete('/:id', eliminarDonacion);

module.exports = router;