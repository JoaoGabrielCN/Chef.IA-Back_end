const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome_usuario: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha_hash: { type: String, required: true },
  foto_perfil: String,
  bio: String,
  receitas_salvas: [String],
  data_criacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
