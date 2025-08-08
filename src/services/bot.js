const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');
const qrcodeImage = require("qrcode");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const { createEvent } = require('./calendar');

dotenv.config(path.resolve(__dirname, '../../.env'));
const delay = ms => new Promise(res => setTimeout(res, ms));
let client = null;
let lastQrUrl = null;
let status = 'desconectado';
let botMsgs = null;

async function startBot() {
  const funcTag = "[startBot]";
  console.log(`${funcTag} Iniciando Client...`);
  await getBotMessages();
  const transitions = await getTransitions();
  const chatStates = new Map();

  status = 'iniciando';
  client = new Client({
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth({ dataPath: path.resolve(process.cwd(), '.wwebjs_auth') }),
  });

  client.on("qr", qr => {
    status = 'aguardando_qr';
    console.log(`${funcTag} Status agora: ${status}`);
    qrcodeImage.toDataURL(qr, (err, url) => {
      if (!err) {
        console.log(`${funcTag} QR Code generated`);
        lastQrUrl = url;
      }
    });
  });

  client.on("ready", () => {
    status = 'conectado';
    console.log(`${funcTag} BOT_READY, status agora: ${status}`);
    const info = client.info;
    console.log(`${funcTag} CLIENT_INFO: ${JSON.stringify(info)}`);
  });

  client.on("disconnected", (reason) => {
    status = 'desconectado';
    console.log(`${funcTag} BOT_DISCONNECTED. Motivo: ${reason}`);
  });

    client.on("message", async msg => {
      const texto = msg.body.trim().toLowerCase();
      const chat = await getChat(msg);
      if (chat.isGroup) return;
      console.log(`${funcTag} Mensagem recebida`);
      let state = chatStates.get(msg.from);
      const now = Date.now();
      if (!state) {
        state = { product: {}, lastMensage: null, lastActive: now };
        chatStates.set(msg.from, state);
      } else {
        if (now - (state.lastActive || 0) > 3600000) {
          state.product = {};
          state.lastMensage = null;
          state.lastActive = now;
          chatStates.set(msg.from, state);
        }
      }
      let { product, lastMensage } = state;

      state.lastActive = now;
      chatStates.set(msg.from, state);

      if (texto === 'menu') {
        lastMensage = null;
        product = {};
      }
      if (texto === 'oi' || texto === 'menu') {
        lastMensage = botMsgs.data.find(m => m.initial_node === true);
        console.log(`${funcTag} Mensagem encontrada`);
        updateState(msg, product, lastMensage);
        await sendAutoSequence(msg, chat, lastMensage, product, transitions, botMsgs);
      } else {
        if (!lastMensage) return;
        const nodeArr = transitions.data.filter(m => m.source_message_id === lastMensage.id);
        console.log(`${funcTag} Nodes encontrados`);
        const nextNode = nodeArr.find(n => texto.match(n.trigger_pattern));
        if (!nextNode) {
          await client.sendMessage(msg.from, "Desculpe, não entendi sua resposta. Por favor, envie novamente ou digite 'menu' para voltar ao início.");
          return;
        }
        console.log(`${funcTag} Mensagem encontrada`);
        await checkLogicalKey(product, lastMensage.logical_key, texto);
        lastMensage = botMsgs.data.find(m => m.id === nextNode.target_message_id);
        updateState(msg, product, lastMensage);
        await sendAutoSequence(msg, chat, lastMensage, product, transitions, botMsgs);
      }
    });

    async function sendAutoSequence(msg, chat, lastMensage, product, transitions, botMsgs) {
      let currentMsg = lastMensage;
      while (true) {
        if (currentMsg.node_type === 'ACTION') {
          await actionTrigger(chat, currentMsg.action_type, product);
        }
        const messageToSend = replaceMessage(currentMsg.message, product);
        await client.sendMessage(msg.from, messageToSend);
        console.log(`[sendAutoSequence] Mensagem enviada`);
        const nodeArr = transitions.data.filter(m => m.source_message_id === currentMsg.id);
        const autoNode = nodeArr.find(n => n.trigger_pattern === '');
        if (!autoNode) break;
        currentMsg = botMsgs.data.find(m => m.id === autoNode.target_message_id);
      }
      updateState(msg, product, currentMsg);
    }

    function updateState(msg, product, lastMensage) {
      console.log(`${funcTag} Atualizando estado do chat`);
      let state = chatStates.get(msg.from);
      const now = Date.now();
      if (!state) {
        state = { product: {}, lastMensage: null, lastActive: now };
        chatStates.set(msg.from, state);
      }
      state.product = product;
      state.lastMensage = lastMensage;
      state.lastActive = now;
      chatStates.set(msg.from, state);
      console.log(`${funcTag} Estado atualizado`);
    }
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

async function actionTrigger(chat, action, product) {
  const funcTag = '[actionTrigger]';
  console.log(`${funcTag} Executando ação: ${action}`);

  switch (action) {
    case 'MARK_UNREAD':
      chat.markUnread();
      break;
    case 'CALCULATE':
      await calculatePrice(product);
      break;
    default:
      console.log(`Ação desconhecida: ${action}`);
  }
}

async function checkLogicalKey(product, logical_key, msg) {
  const funcTag = '[checkLogicalKey]';
  console.log(`${funcTag} Verificando chave lógica da opção escolhida`);
  const splited = logical_key.split('_');
  splited.forEach(key => {
    switch (key) {
      case 'opcao':
        product.code = `${splited[0]}_${msg}`;
        break;
      case 'recorte':
        if (msg === '1'){
          product.code += `_sem`;
        }
        if (msg === '2'){
          product.code += `_com`;
        }
      case `material`:
        if (msg === '1'){
          product.code += `_madeira`;
        }
        if (msg === '2'){
          product.code += `_ilhoses`;
        }
        if (msg === '3'){
          product.code += `_metalon`;
        }
      case 'quant':
        if (product.code.includes('cartao')) {
          product.quantity_code = cartaoOp();
        } else if (product.code.includes('banner') || product.code.includes('placa') || product.code.includes('totem') || product.code.includes('trofeu') || product.code.includes('windBanner')) {
          product.quantity_code = bannerPlacaTotemTrofeuOp();
          product.user_quant = msg;
        } else if (product.code.includes('panfleto')) {
          product.quantity_code = panfletoOp(msg);
        } else if (product.code.includes('adesivo')) {
          product.quantity_code = adesivoOp();
        } else if (product.code.includes('cracha')) {
          product.quantity_code = crachaOp();
          product.user_quant = msg;
        } else if (product.code.includes('santinho')) {
          product.quantity_code = santinhoOp(msg);
        }
        break;
      case 'tamanho':
        product.user_quant = msg;
        product.size = msg;
        break;
      case 'fitas':
        product.quantity_code = crachaOp();
        product.fita_quant = msg;
        break;
    }
  });
  console.log(`${funcTag} Chave lógica verificada`);
}

function replaceMessage(msg, product) {
  const funcTag = '[replaceMessage]';
  console.log(`${funcTag} Substituindo variáveis na mensagem`);
  let msgCopy = msg;
  if (msgCopy.includes('${valor}')) {
    msgCopy = msgCopy.replace('${valor}', product.total_price);
  }
  if (msgCopy.includes('${descricao}')) {
    msgCopy = msgCopy.replace('${descricao}', product.description);
  }
  if (msgCopy.includes('${unidades}')) {
    msgCopy = msgCopy.replace('${unidades}', product.user_quant);
  }
  if (msgCopy.includes('${metros}')) {
    msgCopy = msgCopy.replace('${metros}', product.size);
  }
  if (msgCopy.includes('${tamanho}')) {
    msgCopy = msgCopy.replace('${tamanho}', product.size);
  }
  if (msgCopy.includes('${fita_quant}')) {
    msgCopy = msgCopy.replace('${fita_quant}', product.fita_quant);
  }
  return msgCopy;
}

function cartaoOp() {
  return 'UND_1000';
}

function bannerPlacaTotemTrofeuOp() {
  return 'UND_1';
}

function panfletoOp(msg) {
  if (msg === '1') {
    return 'UND_2500';
  } else if (msg === '2') {
    return 'UND_5000';
  } else if (msg === '3') {
    return 'UND_10000';
  }
}

function adesivoOp() {
  return 'METRO_1';
}

function crachaOp() {
  return 'UND_2';
}

function santinhoOp(msg) {
  if (msg === '1') {
    return 'UND_5000';
  } else if (msg === '2') {
    return 'UND_10000';
  }
}

async function calculatePrice(product) {
  const funcTag = '[calculatePrice]';
  console.log(`${funcTag} Calculando preço do produto`);
  await searchProduct(product);
  if (product.quantity_code === 'UND_1' || product.quantity_code === 'UND_2' || product.quantity_code === 'METRO_1') {
    console.log(`${funcTag} Calculando preço com quantidade do usuário: ${product.user_quant}`);
    if (product.user_quant) {
      product.total_price = product.price * parseFloat(product.user_quant);
    }
  }
  if (product.code === 'cracha_1') {
    console.log(`${funcTag} Calculando preço com quantidade de fitas: ${product.fita_quant}`);
    product.total_price += product.price * parseFloat(product.fita_quant);
  }
  console.log(`${funcTag} Preço calculado`);
}

// function parseScheduling(msg) {
//   // Regex para cada campo
//   const nameMatch = msg.match(/nome completo[:\-]?\s*(.*)/i);
//   const specialtyMatch = msg.match(/especialidade desejada[:\-]?\s*(.*)/i);
//   const dateMatch = msg.match(/data e hora preferida[:\-]?\s*(.*)/i);
//   const convenioMatch = msg.match(/conv[êe]nio*[:\-]?\s*(.*)/i);
//   const emailMatch = msg.match(/email[:\-]?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);

//   // Converte data para formato ISO e calcula dateEnd +1 hora
//   let dateInit = null;
//   let dateEnd = null;
//   if (dateMatch && dateMatch[1]) {
//     // Aceita formatos tipo 10/07/2025 10:00 ou 2025-07-10 10:00
//     let raw = dateMatch[1].trim();
//     let dt = null;
//     // Tenta dd/mm/yyyy hh:mm
//     const brMatch = raw.match(/(\d{2})\/(\d{2})\/(\d{4})[\sT]*(\d{2}):(\d{2})/);
//     if (brMatch) {
//       dt = new Date(`${brMatch[3]}-${brMatch[2]}-${brMatch[1]}T${brMatch[4]}:${brMatch[5]}:00-03:00`);
//     } else {
//       // Tenta yyyy-mm-dd hh:mm
//       const isoMatch = raw.match(/(\d{4})-(\d{2})-(\d{2})[\sT]*(\d{2}):(\d{2})/);
//       if (isoMatch) {
//         dt = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T${isoMatch[4]}:${isoMatch[5]}:00-03:00`);
//       }
//     }
//     if (dt) {
//       dateInit = dt.toISOString();
//       // Soma 1 hora para dateEnd
//       const dtEnd = new Date(dt.getTime() + 60 * 60 * 1000);
//       dateEnd = dtEnd.toISOString();
//     } else {
//       dateInit = raw;
//       dateEnd = raw;
//     }
//   }
//   console.log('dateInit', dateInit, 'dateEnd', dateEnd);
//   return {
//     name: nameMatch ? nameMatch[1].trim() : null,
//     specialty: specialtyMatch ? specialtyMatch[1].trim() : null,
//     convenio: convenioMatch ? convenioMatch[1].trim() : null,
//     email: emailMatch ? emailMatch[1] : null,
//     dateInit,
//     dateEnd
//   };
// }

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
  return status;
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

async function getTransitions() {
  const funcTag = '[getTransitions]';
  try {
    const url = `http://${process.env.DIR_IP}:${process.env.NODE_PORT}/api/transitions`
    console.log(`${funcTag} Atualizando transições do bot`);
    const transations = await fetch(url)
    .then(async resp => {
      const json = await resp.json();
      return json;
    }).catch(
      console.log(`${funcTag} Erro recuperando transições`)
    );
    console.log(`${funcTag} Transições do bot atualizadas com sucesso`);
    return transations;
  } catch (error) {
    console.log(`${funcTag} Erro ao buscar transições do bot:`, error);
    throw error;
  }
}

async function searchProduct(product) {
  const funcTag = '[searchProduct]';
  try {
    console.log(`${funcTag} Buscando produto: ${product.code} com quantidade: ${product.quantity_code}`);
    const url = `http://${process.env.DIR_IP}:${process.env.NODE_PORT}/api/product/${product.code}/${product.quantity_code}`
    console.log(`${funcTag} Buscando produto`);
    const res = await fetch(url)
    .then(async resp => {
      const json = await resp.json();
      return json;
    }).catch(
      console.log(`${funcTag} Erro recuperando produto`)
    );
      product.price = res.data.price;
      product.description = res.data.description;
      product.size = res.data.size;
    console.log(`${funcTag} Produto recuperado com sucesso`);
  } catch (error) {
    console.log(`${funcTag} Erro ao buscar produto:`, error);
    throw error;
  }
}

module.exports = { startBot, generateQr, getClient, getStatus, getBotMessages, getTransitions };
