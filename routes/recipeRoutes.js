const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/receitas',authMiddleware, recipeController.criarReceita);

router.post('/pesquisar', recipeController.pesquisarReceitas);


router.get("/receitas/:id", recipeController.getReceitaPorId);


module.exports = router;