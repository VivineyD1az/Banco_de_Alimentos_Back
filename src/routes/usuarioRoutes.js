const express = require('express');
const router = express.Router();
const { obtenerUsuarios } = require('../controllers/usuarioController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, obtenerUsuarios);

module.exports = router;