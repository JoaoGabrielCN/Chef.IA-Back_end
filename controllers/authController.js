const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(401).json({ mensagem: 'Usuário não encontrado' });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) return res.status(401).json({ mensagem: 'Senha incorreta' });

     const token = jwt.sign(
      { userId: usuario._id, email: usuario.email, nome: usuario.nome_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } 
    );
    
    res.status(200).json({
      mensagem: 'Login bem-sucedido',
      token: token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome_usuario,
        email: usuario.email
      }
    });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
};