const express = require('express');
const router = express.Router();
const {
  obtenerEstadisticas,
  productosPorCategoria,
  donacionesPorMes,
  entregasPorBeneficiario
} = require('../controllers/dashboardController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/estadisticas', verificarToken, obtenerEstadisticas);
router.get('/productos-por-categoria', verificarToken, productosPorCategoria);
router.get('/donaciones-por-mes', verificarToken, donacionesPorMes);
router.get('/entregas-por-beneficiario', verificarToken, entregasPorBeneficiario);

module.exports = router;