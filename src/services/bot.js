const qrcodeImage = require("qrcode");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const fs = require("fs");
const path = require("path");

const delay = ms => new Promise(res => setTimeout(res, ms));
let client = null;
let lastQrUrl = null;
let status = 'desconectado'; // ✅ Status global

function startBot() {
  const funcTag = "[startBot]";
  console.log(`${funcTag} Iniciando Client...`);

  status = 'iniciando'; // ✅ Atualiza status

  client = new Client({
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth({ dataPath: `../../wwebjs_auth/` }),
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
    // ✅ Checa se a mensagem é uma das palavras-chave
    const texto = msg.body.trim().toLowerCase();
    const palavrasAtivacao = ["oi", "ola", "olá", "bom dia", "boa tarde", "boa noite", "menu"];

    if (palavrasAtivacao.includes(texto)) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      const contact = await msg.getContact();
      const name = contact.pushname || "usuário";
      await client.sendMessage(
        msg.from,
        `Olá ${name.split(" ")[0]}! 👩🏾‍⚕️\nSou a Vic, assistente virtual da Clínica Vida e Saúde. Estou aqui para agilizar seu atendimento! Escolha uma das opções abaixo:\n\n1 - Agendar consulta\n2 - Valores de exames e serviços\n3 - Informar chegada na clínica\n4 - Problemas com o App ou agendamento\n5 - Falar com atendente humano\n6 - Solicitar boleto para pagamento`
      );
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(msg.from, 'Você pode digitar "Menu" a qualquer momento para ver novamente as opções.');
    }

    if (msg.body === "1" && msg.from.endsWith("@c.us")) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(
        msg.from,
        "Perfeito! Para agendar sua consulta, por favor envie:\n\n- Nome completo\n- Especialidade desejada\n- Data preferida\n- Convênio (se tiver)\n\nAssim podemos verificar a disponibilidade."
      );
    }

    if (msg.body === "2" && msg.from.endsWith("@c.us")) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(
        msg.from,
        "*Valores base:*\n\n- Consulta Clínica Geral: R$ 120,00\n- Exame de Sangue Completo: R$ 85,00\n- Eletrocardiograma: R$ 90,00\n- Ultrassonografia: R$ 150,00"
      );

      const imgPath = path.join(__dirname, "tabela_servicos.jpg");
      if (fs.existsSync(imgPath)) {
        const image = MessageMedia.fromFilePath(imgPath);
        await client.sendMessage(msg.from, image);
      }
    }

    if (msg.body === "3" && msg.from.endsWith("@c.us")) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(msg.from, "Agradecemos por nos avisar! Por favor dirija-se à recepção com um documento com foto. Bom atendimento!");
    }

    if (msg.body === "4" && msg.from.endsWith("@c.us")) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(
        msg.from,
        "Sem problemas! Nos informe:\n\n- Nome completo\n- CPF\n- Descrição do problema (ex: \"não consigo acessar o app\", \"erro ao agendar\")\n\nVamos te ajudar o mais rápido possível."
      );
    }

    if (msg.body === "5" && msg.from.endsWith("@c.us")) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(msg.from, "Tudo certo. Encaminhando você para um de nossos atendentes. Por favor aguarde um momento...");
    }

    if (msg.body === "6" && msg.from.endsWith("@c.us")) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);

      const boletoPath = path.join(__dirname, "boleto.pdf");
      if (fs.existsSync(boletoPath)) {
        const pdf = MessageMedia.fromFilePath(boletoPath);
        await client.sendMessage(msg.from, "Segue seu boleto para pagamento 👇");
        await client.sendMessage(msg.from, pdf);
      } else {
        await client.sendMessage(
          msg.from,
          'Desculpe, não encontrei o boleto neste momento. Por favor, entre em contato com um atendente digitando "5".'
        );
      }
    }

    if (
      msg.body !== null &&
      /^[1-9]\d*$/.test(msg.body) &&
      !["1", "2", "3", "4", "5", "6"].includes(msg.body) &&
      msg.from.endsWith("@c.us")
    ) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(msg.from, 'Por favor, escolha uma das opções de 1 a 6. Caso precise, digite "Menu" para ver as opções novamente.');
    }
  });

  console.log(`${funcTag} Initialize bot...`);
  client.initialize();
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

module.exports = { startBot, generateQr, getClient, getStatus };
