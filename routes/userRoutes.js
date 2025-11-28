const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware'); 

router.post('/usuarios', userController.criarUsuario);

router.get('/perfil', auth, userController.perfil);

module.exports = router;
