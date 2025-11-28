const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.criarUsuario = async (req, res) => {
  const { nome_usuario, email, senha } = req.body;

  try {
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: "Email já registrado." });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const novoUsuario = new User({
      nome_usuario,
      email,
      senha_hash
    });

    await novoUsuario.save();
    res.status(201).json({ mensagem: "Usuário criado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao criar usuário." });
  }
};

exports.perfil = async (req, res) => {
  try {
    const usuario = await User.findById(req.user.userId).select("-senha_hash");

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    res.json({
      id: usuario._id,
      nome_usuario: usuario.nome_usuario,
      email: usuario.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao carregar perfil" });
  }
};
