const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');
const qrcodeImage = require("qrcode");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");

dotenv.config(path.resolve(__dirname, '../../.env'));

const delay = ms => new Promise(res => setTimeout(res, ms));
let client = null;
let lastQrUrl = null;
let status = 'desconectado'; 
let sessionState = new Map();

const palavrasSaudacao = ["oi", "ola", "olá", "bom dia", "boa tarde", "boa noite"];
const saudacaoInicial = (nome) => `👋 Olá, ${nome}! Bem-vindo à Gráfica Garanhuns.
Escolha uma opção para continuar:

1️⃣ Fazer um orçamento
2️⃣ Falar com um atendente
3️⃣ Formas de pagamento

Digite o número da opção desejada.`;

const opcoesOrcamento = `📦 *Orçamento - Selecione o Produto:*

1️⃣ Panfletos
2️⃣ Cartões de Visita
3️⃣ Adesivos
4️⃣ Banners
5️⃣ Blocos (100 folhas)
6️⃣ Receituário

🔙 Digite *menu* para voltar ao início.`;

function resetSession(numero) {
  sessionState.set(numero, { etapa: 0 });
}

function formatarMoeda(valor) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

async function enviarComDelay(numero, client, mensagens, delayMs = 5000) {
  for (const msg of mensagens) {
    await client.sendMessage(numero, msg);
    await delay(delayMs);
  }
}

async function handleOrcamento(msg, client) {
  const numero = msg.from;
  const texto = msg.body.trim().toLowerCase();

  if (texto === 'menu') {
    resetSession(numero);
    const contact = await msg.getContact();
    await enviarComDelay(numero, client, [saudacaoInicial(contact.pushname ? contact.pushname.split(' ')[0] : 'usuário')]);
    return true;
  }

  if (!sessionState.has(numero)) {
    resetSession(numero);
    const contact = await msg.getContact();
    await enviarComDelay(numero, client, [saudacaoInicial(contact.pushname ? contact.pushname.split(' ')[0] : 'usuário')]);
    return true;
  }

  const estado = sessionState.get(numero);

  // Etapa 0 - Menu inicial
  if (estado.etapa === 0) {
    if (texto === '1') {
      estado.etapa = 'produto';
      sessionState.set(numero, estado);
      await client.sendMessage(numero, opcoesOrcamento);
      return true;
    } else if (texto === '2') {
      await client.sendMessage(numero, '👨‍💼 Um atendente será chamado. Por favor, aguarde.');
      resetSession(numero);
      return true;
    } else if (texto === '3') {
      await client.sendMessage(numero, '*Formas de Pagamento:* \n\n💳 Pix: *PIX DJALMA JÚNIOR - 8799994994* \n💵 Dinheiro: pagamento presencial ao retirar o material.');
      resetSession(numero);
      return true;
    } else {
      const contact = await msg.getContact();
      await client.sendMessage(numero, saudacaoInicial(contact.pushname ? contact.pushname.split(' ')[0] : 'usuário'));
      return true;
    }
  }

  // Etapa de escolha de produto
  if (estado.etapa === 'produto') {
    switch (texto) {
      case '1':
        estado.produto = 'panfleto';
        estado.etapa = 'modelo_panfleto';
        sessionState.set(numero, estado);
        await client.sendMessage(numero, `🧾 *Panfletos - Escolha o modelo:*

A1️⃣ 10x14cm - Frente
A2️⃣ 10x14cm - Frente e Verso
A3️⃣ 15x21cm - Frente
A4️⃣ 15x21cm - Frente e Verso

🔙 Digite *menu* para voltar.`);
        break;
      case '2':
        await client.sendMessage(numero, '🧾 *Cartões de visita*\nValor padrão: R$ 90,00 (1000 unid)\n\nPara orçamento personalizado, digite *menu* e fale com um atendente.');
        resetSession(numero);
        break;
      case '3':
        await client.sendMessage(numero, '🧾 *Adesivos*\nValor padrão: R$ 90,00 (1000 unid)\n\nPara orçamento personalizado, digite *menu* e fale com um atendente.');
        resetSession(numero);
        break;
      case '4':
        await client.sendMessage(numero, '🧾 *Banners*\nOrçamento sob medida. Envie o tamanho desejado após digitar *menu*.');
        resetSession(numero);
        break;
      case '5':
        await client.sendMessage(numero, '🧾 *Blocos 100 folhas:*\n🟦 10x14cm - 10 unid: R$ 160,00\n🟥 20x14cm - 10 unid: R$ 250,00');
        resetSession(numero);
        break;
      case '6':
        await client.sendMessage(numero, '🧾 *Receituário*\nPedido mínimo: 1000 unidades\nValor: R$ 250,00');
        resetSession(numero);
        break;
      default:
        await client.sendMessage(numero, '❌ Opção inválida. Digite o número do produto ou *menu* para voltar.');
    }
    return true;
  }

  // Etapa modelo panfleto
  if (estado.etapa === 'modelo_panfleto') {
    const precos = {
      a1: { nome: '10x14cm - Frente', opcoes: [2500, 5000, 10000], valor: [90, 160, 290] },
      a2: { nome: '10x14cm - Frente e Verso', opcoes: [2500, 5000, 10000], valor: [110, 180, 310] },
      a3: { nome: '15x21cm - Frente', opcoes: [2500, 5000, 10000], valor: [110, 180, 310] },
      a4: { nome: '15x21cm - Frente e Verso', opcoes: [2500, 5000, 10000], valor: [130, 200, 340] },
    };

    const input = texto.replace(/[^a-z0-9]/gi, '').toLowerCase();
    const chave = input in precos ? input : null;

    if (chave) {
      estado.modelo = chave;
      estado.etapa = 'quantidade_panfleto';
      sessionState.set(numero, estado);

      const op = precos[chave].opcoes.map((qtd, i) => `*${i + 1}️⃣* ${qtd} unid - ${formatarMoeda(precos[chave].valor[i])}`).join('\n');

      await client.sendMessage(numero, `📦 *${precos[chave].nome}*\nEscolha a quantidade:\n\n${op}\n\n🔙 Digite *menu* para voltar.`);
    } else {
      await client.sendMessage(numero, '❌ Modelo inválido. Escolha entre A1, A2, A3 ou A4.');
    }
    return true;
  }

  // Etapa quantidade panfleto
  if (estado.etapa === 'quantidade_panfleto') {
    const idx = parseInt(texto);
    const dados = {
      a1: ['10x14cm - Frente', [90, 160, 290]],
      a2: ['10x14cm - Frente e Verso', [110, 180, 310]],
      a3: ['15x21cm - Frente', [110, 180, 310]],
      a4: ['15x21cm - Frente e Verso', [130, 200, 340]],
    };

    if (idx >= 1 && idx <= 3) {
      const chave = estado.modelo;
      const quantidade = [2500, 5000, 10000][idx - 1];
      const valor = dados[chave][1][idx - 1];

      estado.etapa = 'pagamento_opcao';
      estado.orcamentoResumo = {
        produto: `Panfleto ${dados[chave][0]}`,
        quantidade,
        valor,
      };
      sessionState.set(numero, estado);

      await client.sendMessage(numero, `🧾 *Resumo do Orçamento:*\nProduto: Panfleto ${dados[chave][0]}\nQuantidade: ${quantidade} unid\nValor final: ${formatarMoeda(valor)}\n\nEscolha a forma de pagamento:\n\n1️⃣ Pix\n2️⃣ Dinheiro\n\n🔙 Digite *menu* para cancelar.`);
    } else {
      await client.sendMessage(numero, '❌ Quantidade inválida. Digite 1, 2 ou 3.');
    }
    return true;
  }

  // Etapa escolha forma de pagamento para orçamento
  if (estado.etapa === 'pagamento_opcao') {
    if (texto === '1' || texto === 'pix') {
      // Pagamento Pix
      await client.sendMessage(numero, `💳 *Pagamento via Pix*\nChave PIX: *DJALMA JÚNIOR - 8799994994*\n\nApós a confirmação do pagamento, seu pedido começará a ser produzido.\nPrazo de produção: 3 dias úteis.`);
      resetSession(numero);
      return true;
    } else if (texto === '2' || texto === 'dinheiro') {
      // Pagamento Dinheiro
      await client.sendMessage(numero, `💵 *Pagamento em Dinheiro*\nO produto será confeccionado somente após o pagamento.\nO prazo de produção será informado após a confirmação do pagamento.`);
      resetSession(numero);
      return true;
    } else {
      await client.sendMessage(numero, '❌ Opção inválida. Digite *1* para Pix ou *2* para Dinheiro.');
      return true;
    }
  }

  return false;
}

async function startBot() {
  const funcTag = "[startBot]";
  console.log(`${funcTag} Iniciando Client...`);

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
    const numero = msg.from;
    const contact = await msg.getContact();
    const nomeContato = contact.pushname ? contact.pushname.split(' ')[0] : 'usuário';

    if (palavrasSaudacao.includes(texto)) {
      resetSession(numero);
      await enviarComDelay(numero, client, [saudacaoInicial(nomeContato)]);
      return;
    }

    const handled = await handleOrcamento(msg, client);
    if (!handled) {
      // Caso não tenha sido tratado no orçamento, verificar comandos padrões
      if (texto === 'menu') {
        resetSession(numero);
        await client.sendMessage(numero, saudacaoInicial(nomeContato));
        return;
      }

      // Mensagem padrão para opções inválidas
      await client.sendMessage(numero, 'Por favor, escolha uma das opções válidas. Caso precise, digite "Menu" para ver as opções novamente.');
    }
  });

  console.log(`${funcTag} Inicializando bot...`);
  client.initialize();
}

async function generateQr() {
  if (lastQrUrl) return lastQrUrl;

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

module.exports = { startBot, generateQr, getClient, getStatus };
