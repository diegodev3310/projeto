const { google } = require('googleapis');
const readline = require('readline');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(path.resolve(__dirname, '../../.env'));
const clientId = process.env.CLIENT_ID;
const dirIp = process.env.DIR_IP;
const nodePort = process.env.NODE_PORT;

// Configuração OAuth2 (use SEU client_id e client_secret)
const oauth2Client = new google.auth.OAuth2(
  clientId, // Verifique se está carregando corretamente
  process.env.CLIENT_SECRET,
  `http://${dirIp}:${nodePort}/auth/callback`
);

// Gera URL de autorização
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar'],
  prompt: 'consent'
});

console.log('URL para autorização:', authUrl);

// Troca o código por tokens
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Cole o código da URL de redirecionamento (rápido! ele expira em 5 minutos): ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code.trim()); // .trim() remove espaços acidentais
    console.log('✅ Tokens obtidos:');
    console.log('- Access Token:', tokens.access_token);
    console.log('- Refresh Token (GUARDE ESTE!):', tokens.refresh_token);
  } catch (error) {
    console.error('❌ Erro ao obter tokens:', error.message);
    console.log('Dica: O código pode ter expirado. Gere uma nova URL e tente novamente.');
  } finally {
    rl.close();
  }
});