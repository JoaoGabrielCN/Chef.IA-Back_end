const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/receitas'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const isImage = /image\/(jpeg|png|webp)/.test(file.mimetype);
    cb(isImage ? null : new Error('Tipo de arquivo inválido'), isImage);
  }
});

router.post('/image', upload.single('imagem'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ mensagem: 'Nenhum arquivo enviado' });
  }
  const imagePath = `/uploads/receitas/${req.file.filename}`;
  res.status(201).json({ url: imagePath });
});

module.exports = router;
