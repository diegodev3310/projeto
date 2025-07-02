const dotenv = require('dotenv');
const express = require('express');
const app = express();
const { startBot } = require('./src/services/bot');
const { router } = require('./src/routers/index');

dotenv.config();
const port = process.env.NODE_PORT;

// Configurando o middleware para processar dados de formulários e JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Importando as rotas
app.use('/api', router(express));
// Servindo arquivos estáticos da pasta "public"
app.use('/', express.static("public"));

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  // Inicia o bot WhatsApp junto com o servidor
  startBot();
});