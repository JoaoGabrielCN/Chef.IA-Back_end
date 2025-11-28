const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.post('/avalia-receita', apiController.avaliaReceita);
router.post('/faz-consulta', apiController.fazConsulta);
router.post('/avalia-comentario', apiController.avaliaComentario);

module.exports = router;