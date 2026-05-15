const express = require('express');
const router = express.Router();
const {
  obtenerEntregas,
  obtenerEntregaPorId,
  crearEntrega,
  actualizarEntrega,
  eliminarEntrega
} = require('../controllers/entregaController');

router.get('/', obtenerEntregas);
router.get('/:id', obtenerEntregaPorId);
router.post('/', crearEntrega);
router.put('/:id', actualizarEntrega);
router.delete('/:id', eliminarEntrega);

module.exports = router;