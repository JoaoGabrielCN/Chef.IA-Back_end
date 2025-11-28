const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/:receita_id', authMiddleware, commentsController.criarComentario);

router.get('/receita/:receita_id', commentsController.getCommentsByReceita);

module.exports = router;
