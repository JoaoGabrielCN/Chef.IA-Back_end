const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const RecipeSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 }, 
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  ingredientes: {
    type: [String],     
    required: true,     
    validate: [array => array.length > 0,'array vazio']
  },

  modo_preparo:{
    type: [String],     
    required: true,     
    validate: [array => array.length > 0,'array vazio']
  },

 
  autor_id: { type: String, ref: 'User', required: true }, 
  
  autor_nome : { type: String, required: true },

  imagens: { type: [String], default: [] },
  tempo_preparo: Number,
  porcoes: Number,
   utensilios:{
    type: [String],     
    required: true,     
    validate: [array => array.length > 0,'array vazio']
  },

  nivel: {
    type: String,
    enum: ['facil', 'medio', 'dificil'], // somente esses valores serão aceitos
    
  },

  
  votos: {
    positivos: { type: Number, default: 0 },
    negativos: { type: Number, default: 0 }
  },
  comentarios_count: { type: Number, default: 0 },
  data_criacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', RecipeSchema);