const express = require('express');
const router = express.Router();
const { crearDonacionPublica } = require('../controllers/donacionController');

router.post('/publica', crearDonacionPublica);

module.exports = router;