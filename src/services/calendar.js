const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

const funcTag = '[calendar]';
dotenv.config(path.resolve(__dirname, '../../.env'));

function setClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'http://localhost:3000/auth/callback'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
    scope: 'https://www.googleapis.com/auth/calendar',
    token_type: 'Bearer'
  });
  return oauth2Client;
}


async function createEvent(emailPrestador, clientEmail, dataHora) {
  console.log(`${funcTag} Iniciando criação de evento no Google Calendar...`);
  const oauth2Client = setClient();
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const evento = {
    summary: 'Consulta Agendada',
    location: 'Endereço ou link do meeting',
    description: 'Agendamento via sistema automatizado',
    start: { dateTime: dataHora.inicio, timeZone: 'America/Sao_Paulo' },
    end: { dateTime: dataHora.fim, timeZone: 'America/Sao_Paulo' },
    attendees: [
      { email: clientEmail },
      { email: emailPrestador }
    ],
    sendUpdates: 'all',
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 dia antes
        { method: 'popup', minutes: 60 }, // 60 minutos antes
      ],
    },
  };

  try {
    console.log(`${funcTag} Criando evento`)
    const res = await calendar.events.insert({
      calendarId: 'primary',
      resource: evento
    });
    console.log(`${funcTag} Evento criado`);
    return res.data.htmlLink;
  } catch (err) {
    console.error(`${funcTag} Erro ao criar evento:`, err);
    throw new Error(`Erro ao criar evento: ${err.message}`);
  }
}

// Exemplo de chamada
// createEvent('byteforge722@gmail.com', 'test@gmail.com', {
//   inicio: '2025-07-10T10:00:00-03:00',
//   fim: '2025-07-10T11:00:00-03:00'
// });
module.exports = { createEvent };