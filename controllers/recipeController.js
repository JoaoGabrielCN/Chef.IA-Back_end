const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const { avaliaReceita } = require('./apiController.js');

exports.criarReceita = async (req, res) => {
  const {
    titulo,
    descricao,
    ingredientes,
    modo_preparo,
    imagens,
    tempo_preparo,
    porcoes,
    utensilios
  } = req.body;



  try {
    const novaReceita = new Recipe({
      titulo,
      descricao,
      ingredientes,
      modo_preparo,
      autor_id: req.user.userId,
      autor_nome: req.user.nome,
      imagens,
      tempo_preparo,
      porcoes,
      utensilios
    });

    const avaliacao = await avaliaReceita(novaReceita);

    if (avaliacao.trim().toLowerCase() === "true") {
      await novaReceita.save();
      return res.status(201).json({
        mensagem: "Receita criada com sucesso!",
        receita: novaReceita,
        avaliacao: "true"
      });
    } else {
      return res.status(400).json({
        mensagem: "Receita rejeitada pela IA.",
        avaliacao: avaliacao
      });
    }


  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao criar receita", erro: err.message });
  }
};

exports.pesquisarReceitas = async (req, res) => {
  try {
    const filtros = req.body;
    let query = Recipe.find();

    if (filtros.autor_id)
      query = query.where("autor_id").equals(filtros.autor_id);

    if (filtros.nome)
      query = query.where("titulo").regex(new RegExp(filtros.nome, "i"));

    if (filtros.utensilios?.$all?.length) {
      const regexArray = filtros.utensilios.$all.map(i => new RegExp(i, "i"));
      query = query.or(regexArray.map(r => ({ utensilios: r })));
    }

    if (typeof filtros.tempo_preparo === "number")
      query = query.where("tempo_preparo").lte(filtros.tempo_preparo);

    if (filtros.nivel)
      query = query.where("nivel").equals(filtros.nivel);

    if (typeof filtros.porcoes === "number")
      query = query
        .where("porcoes")
        .gte(filtros.porcoes - 2)
        .lte(filtros.porcoes + 2);

    let receitas = await query.exec();

    if (filtros.ingredientes?.$all?.length) {
      const regexArray = filtros.ingredientes.$all.map(i => new RegExp(i, "i"));

      receitas = receitas
        .map(r => {
          const compat = filtros.ingredientes.$all.reduce((acc, filtIng) => {
            if (r.ingredientes.some(ing => new RegExp(filtIng, 'i').test(ing))) {
              return acc + 1; 
            }
            return acc;
          }, 0);
          return { ...r.toObject(), ingredientsCompat: compat };
        })
        .filter(r => r.ingredientsCompat > 0)
        .sort((a, b) => b.ingredientsCompat - a.ingredientsCompat);
    }



    res.json({ resultados: receitas });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensagem: "Erro ao pesquisar receitas",
      erro: err.message
    });
  }
};



exports.getReceitaPorId = async (req, res) => {
  try {
    const receita = await Recipe.findById(req.params.id);

    if (!receita) {
      return res.status(404).json({ mensagem: "Receita não encontrada" });
    }

    res.json(receita);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar receita", erro: err.message });
  }
};

exports.deletarReceita = async (req, res) => {
  try {
    const { id } = req.params; 


    const receita = await Recipe.findById(id);
    if (!receita) {
      return res.status(404).json({ mensagem: "Receita não encontrada" });
    }


    if (receita.autor_id !== req.user.userId) {
      return res.status(403).json({ mensagem: "Você não tem permissão para deletar esta receita" });
    }


    await Comment.deleteMany({ receita_id: id });


    await Recipe.findByIdAndDelete(id);

    res.json({ mensagem: "Receita e comentários deletados com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao deletar receita", erro: err.message });
  }
};