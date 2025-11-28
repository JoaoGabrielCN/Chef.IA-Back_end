const mongoose = require('mongoose');


const CommentSchema = new mongoose.Schema({
    conteudo: { type: String, required: true },
    autor_id: { type: String, ref: 'User', required: true },
    autor_nome: { type: String, required: true },
    receita_id: { type: String, ref: 'Recipe', required: true },
    data_criacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);