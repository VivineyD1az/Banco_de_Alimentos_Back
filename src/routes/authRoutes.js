const express = require('express');
const router = express.Router();
const { login, registrar, obtenerPerfil, actualizarPerfil, cambiarPassword } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/registrar', verificarToken, registrar);
router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/perfil', verificarToken, actualizarPerfil);
router.put('/cambiar-password', verificarToken, cambiarPassword);

module.exports = router;