const dotenv = require('dotenv');
const express = require('express');
const app = express();
const port = process.env.NODE_PORT;

dotenv.config();
// Configurando o middleware para processar dados de formulários e JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servindo arquivos estáticos da pasta "public"
app.use('/', express.static("public"));

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
