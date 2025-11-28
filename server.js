// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// --- Carregar variáveis de ambiente ---
dotenv.config();

// --- Inicializar app ---
const app = express();

// --- Middlewares ---
// Permitir requisições de qualquer origem
app.use(cors({ origin: '*' }));

// Permite enviar/receber JSON
app.use(express.json());

// Servir arquivos estáticos (imagens)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Rotas ---
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const apiRoutes = require('./routes/apiRoutes');

app.use('/api', apiRoutes)
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', recipeRoutes);
app.use('/api/receitas', recipeRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/comentarios', commentsRoutes);


//Conectar ao MongoDB
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

if (!MONGO_URI) {
  console.error(" MONGO_URI não definido no .env");
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(" Conectado ao MongoDB");
  app.listen(PORT, () => {
    console.log(` Servidor rodando na porta ${PORT}`);
  });
})
.catch(err => {
  console.error(" Erro ao conectar no MongoDB:", err);
  process.exit(1);
});
