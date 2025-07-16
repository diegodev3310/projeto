const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

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

async function createEvent(client) {
  const funcTag = '[createEvent]';
  try {
    console.log(`${funcTag} Iniciando criação de evento no Google Calendar...`);
    const oauth2Client = setClient();
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const businessEmail = process.env.BUSINESS_EMAIL;
    const localtion = process.env.LOCATION;
    const evento = {
      summary: `Consulta Agendada - ${client.name}`,
      location: localtion,
      description: `Agendamento via sistema automatizado \n Cliente: ${client.name} \n Especialidade: ${client.specialty} \n Convênio: ${client.convenio}`,
      start: { dateTime: client.dateInit, timeZone: 'America/Sao_Paulo' },
      end: { dateTime: client.dateEnd, timeZone: 'America/Sao_Paulo' },
      attendees: [
        { email: client.email },
        { email: businessEmail }
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

    console.log(`${funcTag} Criando evento`)
    const res = await calendar.events.insert({
      calendarId: 'primary',
      resource: evento
    });
    console.log(`${funcTag} Evento criado`);
    return true;
  } catch (err) {
    console.error(`${funcTag} Erro ao criar evento:`, err);
    return false;
  }
}

/* Exemplo de chamada
createEvent({
  name: 'Client',
  specialty: 'Cardiologia',
  convenio: 'Unimed',
  email: 'client@gmail.com',
  dateInit: '2025-07-10T10:00:00-03:00',
  dateEnd: '2025-07-10T11:00:00-03:00'
});
*/
module.exports = { createEvent };