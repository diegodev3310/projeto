const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');
const qrcodeImage = require("qrcode");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");

dotenv.config(path.resolve(__dirname, '../../.env'));
const delay = ms => new Promise(res => setTimeout(res, ms));
let client = null;
let lastQrUrl = null;
let status = 'desconectado'; // ✅ Status global
let botMsgs = null;

async function startBot() {
  const funcTag = "[startBot]";
  console.log(`${funcTag} Iniciando Client...`);
  getBotMessages();

  status = 'iniciando'; // ✅ Atualiza status
  client = new Client({
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth({ dataPath: `../wwebjs_auth/` }),
  });

  // Dispara quando QR gerado
  client.on("qr", qr => {
    status = 'aguardando_qr'; // ✅ Atualiza status
    console.log(`${funcTag} Status agora: ${status}`);
    qrcodeImage.toDataURL(qr, (err, url) => {
      if (!err) {
        console.log(`${funcTag} QR Code generated`);
        lastQrUrl = url;
      }
    });
  });

  // Dispara quando pronto/conectado
  client.on("ready", () => {
    status = 'conectado'; // ✅ Atualiza status
    console.log(`${funcTag} BOT_READY, status agora: ${status}`);
    const info = client.info;
    console.log(`${funcTag} CLIENT_INFO: ${JSON.stringify(info)}`);
  });

  client.on("disconnected", (reason) => {
    status = 'desconectado'; // ✅ Atualiza status
    console.log(`${funcTag} BOT_DISCONNECTED. Motivo: ${reason}`);
  });

  client.on("message", async msg => {
    const texto = msg.body.trim().toLowerCase();
    const menuWords = ["oi", "ola", "olá", "bom dia", "boa tarde", "boa noite", "menu"];

    if (/^\d+$/.test(msg.body) && msg.from.endsWith("@c.us")) {
      const chat = await getChat(msg)
      // Busca opções dinâmicas da API
      const option = botMsgs.data.find(m => { return m.idx == msg.body });
      if (option) {
        await optionsMsg(msg, chat, option)
      } else {
        await client.sendMessage(msg.from, 'Por favor, escolha uma das opções válidas. Caso precise, digite "Menu" para ver as opções novamente.');
      }
    }

    if (menuWords.includes(texto)) {
      const chat = getChat(msg)
      await menuMsg(msg, chat);
    }
  });

  console.log(`${funcTag} Initialize bot...`);
  client.initialize();
}

async function getChat(msg){
  const chat = await msg.getChat();
  await delay(3000);
  await chat.sendStateTyping();
  await delay(3000);
  return chat;
}

async function optionsMsg(msg, chat, option) {
  await client.sendMessage(msg.from, option.message);
  // Executa ação especial se existir
  if (option.action === "send_boleto") {
    const boletoPath = path.join(__dirname, "boleto.pdf");
    if (fs.existsSync(boletoPath)) {
      const pdf = MessageMedia.fromFilePath(boletoPath);
      await client.sendMessage(msg.from, pdf);
    } else {
      await client.sendMessage(
        msg.from,
        'Desculpe, não encontrei o boleto neste momento. Por favor, entre em contato com um atendente digitando "5".'
      );
    }
  }
  if (option.action === "mark_unread") {
    chat.markUnread();
  }
}

async function menuMsg(msg, chat) {
  const contact = await msg.getContact();
  const name = contact.pushname ? contact.pushname.split(' ')[0] : 'usuário';
  const menuMsg = botMsgs.data.find(m => m.action === "menu");
  if (menuMsg) {
    const personalizedMsg = menuMsg.message.replace('${name}', name);
    await client.sendMessage(msg.from, personalizedMsg);
  }
  await chat.sendStateTyping();
  await delay(3000);  
  await client.sendMessage(msg.from, 'Você pode digitar "Menu" a qualquer momento para ver novamente as opções.');
}

async function generateQr() {
  if (lastQrUrl) {
    return lastQrUrl;
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      client.removeListener('qr', qrHandler);
      reject('Timeout ao gerar QR Code.');
    }, 10000);

    const qrHandler = (qr) => {
      qrcodeImage.toDataURL(qr, (err, url) => {
        if (!err) {
          lastQrUrl = url;
          clearTimeout(timeout);
          client.removeListener('qr', qrHandler);
          resolve(url);
        } else {
          clearTimeout(timeout);
          client.removeListener('qr', qrHandler);
          reject(err);
        }
      });
    };
    client.on('qr', qrHandler);
  });
}

function getClient() {
  return client;
}

function getStatus() {
  return status; // ✅
}

async function getBotMessages() {
  const funcTag = '[getBotMessages]';
  try {
    const url = `http://${process.env.DIR_IP}:${process.env.NODE_PORT}/api/messages`
    console.log(`${funcTag} Atualizando mensagens do bot`);
    botMsgs = await fetch(url)
    .then(async resp => {
      const json = await resp.json();
      return json;
    }).catch(
      console.log(`${funcTag} Erro recuperando mensagens`)
    );
    console.log(`${funcTag} Mensagens do bot atualizadas com sucesso`);
  } catch (error) {
    console.log(`${funcTag} Erro ao buscar mensagens do bot:`, error);
    throw error;
  }
} 

module.exports = { startBot, generateQr, getClient, getStatus, getBotMessages };
