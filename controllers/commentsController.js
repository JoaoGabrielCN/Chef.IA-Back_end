const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');

exports.criarComentario = async (req, res) => {
  try {
    const { conteudo } = req.body;
    const { receita_id } = req.params;

    if (!conteudo || conteudo.trim() === "") {
      return res.status(400).json({ mensagem: "Comentário vazio." });
    }

    const novoComentario = new Comment({
      autor_id: req.user?.userId || null,
      autor_nome: req.user?.nome || 'Usuário',
      receita_id,
      conteudo,
    });

    await novoComentario.save();
    await Recipe.findByIdAndUpdate(receita_id, { $inc: { comentarios_count: 1 } });

    res.status(201).json({ mensagem: "Comentário adicionado", comentario: novoComentario });
  } catch (err) {
    console.error('Erro criarComentario:', err);
    res.status(500).json({ mensagem: "Erro ao criar comentário", erro: err.message });
  }
};

exports.getCommentsByReceita = async (req, res) => {
  try {
    const { receita_id } = req.params;

    const comentarios = await Comment.find({ receita_id }).sort({ data_criacao: -1 });

    const resultado = comentarios.map(c => ({
      _id: c._id,
      autor_nome: c.autor_nome || 'Usuário',
      conteudo: c.conteudo || '',
      data_criacao: c.data_criacao,
    }));

    return res.status(200).json(resultado);
  } catch (err) {
    console.error('Erro getCommentsByReceita:', err);
    return res.status(500).json({ mensagem: 'Erro ao buscar comentários', erro: err.message });
  }
};
  