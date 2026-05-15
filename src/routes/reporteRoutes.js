const express = require('express');
const router = express.Router();
const {
  productosPorVencer,
  productosStockBajo,
  donacionesPorDonante,
  entregasPorBeneficiario,
  resumenGeneral
} = require('../controllers/reporteController');

router.get('/resumen', resumenGeneral);
router.get('/productos-por-vencer', productosPorVencer);
router.get('/stock-bajo', productosStockBajo);
router.get('/donaciones-por-donante', donacionesPorDonante);
router.get('/entregas-por-beneficiario', entregasPorBeneficiario);

module.exports = router;