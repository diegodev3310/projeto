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

const saudacaoInicial = `👋 Olá! Bem-vindo à Gráfica Garanhuns.
Escolha uma opção para continuar:

1️⃣ Fazer um orçamento
2️⃣ Falar com um atendente
3️⃣ Formas de pagamento

Digite o número da opção desejada.`;

const formasPagamentoMsg = `*Formas de Pagamento:*

1️⃣ Pix
2️⃣ Dinheiro`;

async function startBot() {
  console.log("[startBot] Iniciando Client...");
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
    qrcodeImage.toDataURL(qr, (err, url) => {
      if (!err) lastQrUrl = url;
    });
  });

  client.on("ready", () => {
    status = 'conectado';
    console.log("[startBot] Cliente pronto e conectado.");
  });

  client.on("disconnected", reason => {
    status = 'desconectado';
    console.log("[startBot] Cliente desconectado:", reason);
  });

  client.on("message", async msg => {
    if (!msg.from.endsWith("@c.us")) return;

    const numero = msg.from;
    const texto = msg.body.trim().toLowerCase();

    if (!sessionState.has(numero)) {
      sessionState.set(numero, { etapa: 'menu' });
      await delay(5000);
      await client.sendMessage(numero, saudacaoInicial);
      return;
    }

    if (texto === 'menu') {
      sessionState.set(numero, { etapa: 'menu' });
      await delay(5000);
      await client.sendMessage(numero, saudacaoInicial);
      return;
    }

    const estado = sessionState.get(numero);

    switch (estado.etapa) {
      case 'menu': await handleMenu(numero, texto); break;
      case 'orcamento_subopcao': await handleOrcamentoSubopcao(numero, texto); break;
      case 'cartao_visita': await handleCartaoVisita(numero, texto); break;
      case 'banner': await handleBanner(numero, texto); break;
      case 'banner_personalizado_tamanho': await handleBannerPersonalizadoTamanho(numero, texto); break;
      case 'banner_personalizado_acabamento': await handleBannerPersonalizadoAcabamento(numero, texto); break;
      case 'panfletos': await handlePanfletos(numero, texto); break;
      case 'adesivos': await handleAdesivos(numero, texto); break;
      case 'adesivos_acabamento': await handleAdesivosAcabamento(numero, texto); break;
      case 'adesivos_tamanho': await handleAdesivosTamanho(numero, texto); break;
      case 'placas_crachas': await handlePlacasCrachas(numero, texto); break;
      case 'placas_unidades': await handlePlacasUnidades(numero, texto); break;
      case 'placas_medidas': await handlePlacasMedidas(numero, texto); break;
      case 'crachas_fita': await handleCrachasFita(numero, texto); break;
      case 'crachas_unidades': await handleCrachasUnidades(numero, texto); break;
      case 'totem_trofeus': await handleTotemTrofeus(numero, texto); break;
      case 'totem_tamanho': await handleTotemTamanho(numero, texto); break;
      case 'totem_unidades': await handleTotemUnidades(numero, texto); break;
      case 'outros': await handleOutros(numero, texto); break;
      case 'santinhos': await handleSantinhos(numero, texto); break;
      case 'santinhos_quantidade': await handleSantinhosQuantidade(numero, texto); break;
      case 'wind_banner': await handleWindBanner(numero, texto); break;
      case 'wind_banner_quantidade': await handleWindBannerQuantidade(numero, texto); break;
      case 'pagamento_escolha': await handlePagamentoEscolha(numero, texto); break;
      case 'aguardar_comprovante': await handleAguardarComprovante(numero, texto); break;
      default:
        sessionState.set(numero, { etapa: 'menu' });
        await delay(5000);
        await client.sendMessage(numero, saudacaoInicial);
    }
  });

  client.initialize();
}

// Handlers

async function handleMenu(numero, texto) {
  switch (texto) {
    case '1':
      sessionState.set(numero, { etapa: 'orcamento_subopcao' });
      await delay(5000);
      await client.sendMessage(numero, `📦 *Orçamento - Selecione o Produto:*

1️⃣ - Cartão de visita / TAGS
2️⃣ - Banner / Faixa / Flâmula / Grid
3️⃣ - Panfletos
4️⃣ - Adesivos
5️⃣ - Papel timbrado / Blocos / Receituário
6️⃣ - Placas PVC / Crachás
7️⃣ - Totem / Troféus
8️⃣ - Outros

Digite o número da opção.`);
      break;
    case '2':
      await delay(5000);
      await client.sendMessage(numero, '👨‍💼 Um atendente será chamado. Por favor, aguarde.');
      sessionState.delete(numero);
      break;
    case '3':
      sessionState.set(numero, { etapa: 'pagamento_escolha', retorno: 'menu' });
      await delay(5000);
      await client.sendMessage(numero, formasPagamentoMsg);
      break;
    default:
      await delay(5000);
      await client.sendMessage(numero, 'Por favor, escolha uma das opções válidas. Digite "menu" para reiniciar.');
  }
}

async function handleOrcamentoSubopcao(numero, texto) {
  switch (texto) {
    case '1':
      sessionState.set(numero, { etapa: 'cartao_visita' });
      await delay(5000);
      await client.sendMessage(numero,
        `PEDIDO MÍNIMO

- CARTÃO DE VISITA VERNIZ TOTAL COLORIDO FRENTE E VERSO:
1000 UNID R$170,00
- CARTÃO DE VISITA VERNIZ LOCALIZADO F/V IMPRESSÃO COLORIDO FRENTE E VERSO:
1000 UNID R$250,00

ENTREGA: 5 A 7 DIAS ÚTEIS APÓS PIX E ARTE APROVADA

Digite "menu" para voltar ao início.`);
      break;

    case '2':
      sessionState.set(numero, { etapa: 'banner' });
      await delay(5000);
      await client.sendMessage(numero,
        `Escolha o Banner:

1️⃣ - Banner tamanho padrão 80x120cm - R$60,00
2️⃣ - Personalize o tamanho do seu material

Digite o número da opção.`);
      break;

    case '3':
      sessionState.set(numero, { etapa: 'panfletos' });
      await delay(5000);
      await client.sendMessage(numero,
        `PEDIDO MÍNIMO

1️⃣ 20x10 1 lado - colche 90g brilho - 2500unid R$360,00 | 5.000unid R$550,00
2️⃣ 20x10 2 lados - colche 90g brilho - 2500unid R$480,00 | 5.000unid R$700,00

3️⃣ 14x10 1 lado - colche 90g brilho - 2500unid R$260,00 | 5.000unid R$360,00 | 10.000unid R$560,00
4️⃣ 14x10 2 lados - colche 90g brilho - 2500unid R$290,00 | 5.000unid R$380,00 | 10.000unid R$650,00

5️⃣ 14x20 1 lado - colche 90g brilho - 2500unid R$360,00 | 5.000unid R$650,00 | 10.000unid R$1.150,00
6️⃣ 14x20 2 lados - colche 90g brilho - 2500unid R$590,00 | 5.000unid R$890,00 | 10.000unid R$1.550,00

7️⃣ 21x30 1 lados - colche 90g brilho - 2500unid R$850,00 | 5.000unid R$1.450,00
8️⃣ 21x30 2 lados - colche 90g brilho - 2500unid R$980,00 | 5.000unid R$1.690,00 | 10.000unid R$2.340,00

ENTREGA DE 3 A 5 DIAS ÚTEIS APÓS PIX E ARTE APROVADA

Digite o número da opção.`);
      break;

    case '4':
      sessionState.set(numero, { etapa: 'adesivos' });
      await delay(5000);
      await client.sendMessage(numero,
        `Escolha o tipo de adesivo:

1️⃣ - ADESIVO BRILHOSO
2️⃣ - ADESIVO FOSCO
3️⃣ - ADESIVO PERFURADO

Digite o número da opção.`);
      break;

    case '5':
      await delay(5000);
      await client.sendMessage(numero, 'Papel timbrado / Blocos / Receituário - Para orçamento personalizado, digite "menu" e fale com um atendente.');
      sessionState.delete(numero);
      break;

    case '6':
      sessionState.set(numero, { etapa: 'placas_crachas' });
      await delay(5000);
      await client.sendMessage(numero,
        `Nos informe qual deseja:

1️⃣ - Placas
2️⃣ - Crachás

Digite o número da opção.`);
      break;

    case '7':
      sessionState.set(numero, { etapa: 'totem_trofeus' });
      await delay(5000);
      await client.sendMessage(numero,
        `Qual material desejado?

1️⃣ - Totem
2️⃣ - Troféus

Digite o número da opção.`);
      break;

    case '8':
      sessionState.set(numero, { etapa: 'outros' });
      await delay(5000);
      await client.sendMessage(numero,
        `Escolha a opção:

1️⃣ - Santinhos
2️⃣ - Wind Banner
3️⃣ - Falar com um atendente

Digite o número da opção.`);
      break;

    default:
      await delay(5000);
      await client.sendMessage(numero, 'Opção inválida. Digite um número válido ou "menu" para voltar.');
  }
}

// Cartão de visita / TAGS
async function handleCartaoVisita(numero, texto) {
  const opcoesValidas = ['1', '2'];

  if (!opcoesValidas.includes(texto)) {
    await delay(5000);
    await client.sendMessage(numero, 'Opção inválida. Digite 1 ou 2 ou "menu" para voltar.');
    return;
  }

  let valor = 0;
  let descricao = '';
  if (texto === '1') {
    valor = 170;
    descricao = 'CARTÃO DE VISITA VERNIZ TOTAL COLORIDO FRENTE E VERSO - 1000 UNID';
  } else if (texto === '2') {
    valor = 250;
    descricao = 'CARTÃO DE VISITA VERNIZ LOCALIZADO F/V IMPRESSÃO COLORIDO FRENTE E VERSO - 1000 UNID';
  }

  sessionState.set(numero, {
    etapa: 'pagamento_escolha',
    valor,
    descricao,
    retorno: 'menu',
  });

  await delay(5000);
  await client.sendMessage(numero,
    `Seu orçamento: ${descricao}
Valor: R$ ${valor.toFixed(2).replace('.', ',')}

Escolha a forma de pagamento:

${formasPagamentoMsg}`);
}

// Banner / Faixa / Flâmula / Grid
async function handleBanner(numero, texto) {
  if (texto === '1') {
    // Banner padrão
    sessionState.set(numero, {
      etapa: 'pagamento_escolha',
      valor: 60,
      descricao: 'Banner tamanho padrão 80x120cm',
      retorno: 'menu',
    });
    await delay(5000);
    await client.sendMessage(numero,
      `O seu material entrará em produção assim que efetuado o pagamento.
Nos envie o comprovante e a arte do material, para que possamos colocar na fila de produção.

Valor: R$ 60,00

Escolha a forma de pagamento:

${formasPagamentoMsg}`);
  } else if (texto === '2') {
    // Banner personalizado tamanho
    sessionState.set(numero, { etapa: 'banner_personalizado_tamanho' });
    await delay(5000);
    await client.sendMessage(numero, 'Por gentileza nos informe:\n\nQual o tamanho do seu material? (Exemplo: 100x150cm)');
  } else {
    await delay(5000);
    await client.sendMessage(numero, 'Opção inválida. Digite 1 ou 2 ou "menu" para voltar.');
  }
}

async function handleBannerPersonalizadoTamanho(numero, texto) {
  const estado = sessionState.get(numero);
  estado.tamanho = texto;
  estado.etapa = 'banner_personalizado_acabamento';
  sessionState.set(numero, estado);
  await delay(5000);
  await client.sendMessage(numero,
    `Qual o tipo de acabamento?
1️⃣ - Madeira nas laterais
2️⃣ - Ilhoses
3️⃣ - Espaço para esticar em estrutura de metalon/outros.

Digite o número da opção.`);
}

async function handleBannerPersonalizadoAcabamento(numero, texto) {
  const opcoesValidas = ['1', '2', '3'];
  if (!opcoesValidas.includes(texto)) {
    await delay(5000);
    await client.sendMessage(numero, 'Opção inválida. Digite 1, 2 ou 3.');
    return;
  }

  const estado = sessionState.get(numero);
  estado.acabamento = texto;
  estado.etapa = 'pagamento_escolha';
  estado.valor = 0; // Aqui poderia ter lógica para cálculo personalizado, mas deixaremos zero por enquanto
  estado.descricao = `Banner personalizado tamanho ${estado.tamanho} com acabamento opção ${texto}`;
  estado.retorno = 'menu';

  await delay(5000);
  await client.sendMessage(numero,
    `O seu material entrará em produção assim que efetuado o pagamento.
Lembrando que para esse tipo de material o prazo de confecção é de até 24 horas úteis.
Nos envie o comprovante e a arte do material, para que possamos colocar na fila de produção.

Escolha a forma de pagamento:

${formasPagamentoMsg}`);
}

// Panfletos
async function handlePanfletos(numero, texto) {
  const opcoesValidas = ['1','2','3','4','5','6','7','8'];
  if (!opcoesValidas.includes(texto)) {
    await delay(5000);
    await client.sendMessage(numero, 'Opção inválida. Digite número válido ou "menu" para voltar.');
    return;
  }

  let valor = 0;
  let descricao = '';

  switch (texto) {
    case '1': valor = 360; descricao = '20x10 1 lado - 2500unid'; break;
    case '2': valor = 550; descricao = '20x10 1 lado - 5000unid'; break;
    case '3': valor = 480; descricao = '20x10 2 lados - 2500unid'; break;
    case '4': valor = 700; descricao = '20x10 2 lados - 5000unid'; break;
    case '5': valor = 260; descricao = '14x10 1 lado - 2500unid'; break;
    case '6': valor = 360; descricao = '14x10 1 lado - 5000unid'; break;
    case '7': valor = 560; descricao = '14x10 1 lado - 10000unid'; break;
    case '8': valor = 290; descricao = '14x10 2 lados - 2500unid'; break;
  }

  sessionState.set(numero, {
    etapa: 'pagamento_escolha',
    valor,
    descricao: `Panfletos ${descricao}`,
    retorno: 'menu',
  });

  await delay(5000);
  await client.sendMessage(numero,
    `Seu orçamento: Panfletos ${descricao}
Valor: R$ ${valor.toFixed(2).replace('.', ',')}

Escolha a forma de pagamento:

${formasPagamentoMsg}`);
}

// Adesivos
async function handleAdesivos(numero, texto) {
  const opcoesValidas = ['1','2','3'];
  if (!opcoesValidas.includes(texto)) {
    await delay(5000);
    await client.sendMessage(numero, 'Opção inválida. Digite 1, 2 ou 3.');
    return;
  }
  const estado = sessionState.get(numero);
  estado.adesivoTipo = texto;

  if (texto === '3') {
    // Adesivo perfurado direto orçamento
    estado.etapa = 'pagamento_escolha';
    estado.valor = 90;
    estado.descricao = 'ADESIVO PERFURADO - 90,00 O METRO';
    estado.retorno = 'menu';
    sessionState.set(numero, estado);

    await delay(5000);
    await client.sendMessage(numero,
      `Orçamento: ADESIVO PERFURADO - R$90,00 O METRO

Escolha a forma de pagamento:

${formasPagamentoMsg}`);
    return;
  }

  estado.etapa = 'adesivos_tamanho';
  sessionState.set(numero, estado);

  await delay(5000);
  await client.sendMessage(numero, 'Qual o tamanho do seu adesivo? (exemplo: 10x10cm)');
}

async function handleAdesivosTamanho(numero, texto) {
  const estado = sessionState.get(numero);
  estado.adesivoTamanho = texto;
  estado.etapa = 'adesivos_acabamento';
  sessionState.set(numero, estado);

  await delay(5000);
  await client.sendMessage(numero,
    `Qual acabamento deseja?

1️⃣ - Verniz
2️⃣ - Sem verniz

Digite o número da opção.`);
}

async function handleAdesivosAcabamento(numero, texto) {
  const opcoesValidas = ['1','2'];
  if (!opcoesValidas.includes(texto)) {
    await delay(5000);
    await client.sendMessage(numero, 'Opção inválida. Digite 1 ou 2.');
    return;
  }

  const estado = sessionState.get(numero);
  estado.adesivoAcabamento = texto;

  // Exemplo valor fixo, pode ser modificado para cálculo real
  let valor = 50;
  let descricao = `ADESIVO ${estado.adesivoTipo === '1' ? 'BRILHOSO' : 'FOSCO'}, tamanho ${estado.adesivoTamanho}, acabamento ${texto === '1' ? 'Verniz' : 'Sem verniz'}`;

  estado.etapa = 'pagamento_escolha';
  estado.valor = valor;
  estado.descricao = descricao;
  estado.retorno = 'menu';
  sessionState.set(numero, estado);

  await delay(5000);
  await client.sendMessage(numero,
    `Seu orçamento: ${descricao}
Valor aproximado: R$ ${valor.toFixed(2).replace('.', ',')}

Escolha a forma de pagamento:

${formasPagamentoMsg}`);
}

// Placas PVC / Crachás
async function handlePlacasCrachas(numero, texto) {
  if (texto === '1') {
    sessionState.set(numero, { etapa: 'placas_unidades' });
    await delay(5000);
    await client.sendMessage(numero, 'Quantas unidades?');
  } else if (texto === '2') {
    sessionState.set(numero, { etapa: 'crachas_fita' });
    await delay(5000);
    await client.sendMessage(numero,
      `Fazemos a partir de 2 unidades
Cada unidade custa R$15,00 reais. Fazemos também a fita personalizada, cada uma custa R$10,00.

Além dos crachás, você também gostaria de fita personalizada?

1️⃣ - SIM
2️⃣ - NÃO`);
  } else {
    await delay(5000);
    await client.sendMessage(numero, 'Opção inválida. Digite 1 ou 2.');
  }
}

async function handlePlacasUnidades(numero, texto) {
  const qtd = parseInt(texto);
  if (isNaN(qtd) || qtd <= 0) {
    await delay(5000);
    await client.sendMessage(numero, 'Por favor, informe um número válido para quantidade.');
    return;
  }
  sessionState.set(numero, { etapa: 'placas_medidas', placasQtd: qtd });
  await delay(5000);
  await client.sendMessage(numero, 'Quais as medidas da sua placa?');
}

async function handlePlacasMedidas(numero, texto) {
  const estado = sessionState.get(numero);
  estado.placasMedidas = texto;
  estado.etapa = 'finalizar_placas';
  sessionState.set(numero, estado);

  await delay(5000);
  await client.sendMessage(numero,
    `Obrigado pelas informações! Logo um atendente disponível irá entrar em contato.`);
  sessionState.delete(numero);
}

// Crachás
async function handleCrachasFita(numero, texto) {
  if (!['1', '2'].includes(texto)) {
    await delay(5000);
    await client.sendMessage(numero, 'Digite 1 para SIM ou 2 para NÃO.');
    return;
  }

  const estado = sessionState.get(numero);
  estado.crachasFita = texto === '1';
  estado.etapa = 'crachas_unidades';
  sessionState.set(numero, estado);

  await delay(5000);
  await client.sendMessage(numero, 'Quantas unidades seriam? Responda apenas com números.');
}

async function handleCrachasUnidades(numero, texto) {
  const qtd = parseInt(texto);
  if (isNaN(qtd) || qtd < 2) {
    await delay(5000);
    await client.sendMessage(numero, 'Fazemos a partir de 2 unidades. Por favor, informe um número válido.');
    return;
  }
  const estado = sessionState.get(numero);
  const valorUnit = estado.crachasFita ? 25 : 15;
  const total = valorUnit * qtd;

  estado.etapa = 'finalizar_crachas';
  estado.valor = total;
  estado.descricao = `Crachás (${qtd} unidades) com${estado.crachasFita ? '' : 'out'} fita personalizada`;

  sessionState.set(numero, estado);

  await delay(5000);
  await client.sendMessage(numero,
    `Seu orçamento fica no valor: R$ ${total.toFixed(2).replace('.', ',')}

O seu material entrará em produção assim que efetuado o pagamento. Lembrando que para esse tipo de material o prazo de confecção é de 24 horas úteis após pagamento e aprovação da arte.
Nos envie o comprovante e a arte do material, para que possamos colocar na fila de produção.`);
  sessionState.delete(numero);
}

// Totem / Troféus
async function handleTotemTrofeus(numero, texto) {
  if (!['1', '2'].includes(texto)) {
    await delay(5000);
    await client.sendMessage(numero, 'Digite 1 para Totem ou 2 para Troféus.');
    return;
  }
  const estado = sessionState.get(numero);
  estado.totemTrofeu = texto;
  estado.etapa = 'totem_tamanho';
  sessionState.set(numero, estado);

  await delay(5000);
  await client.sendMessage(numero, 'Por gentileza nos informe:\n\nQual o tamanho do seu material?');
}

async function handleTotemTamanho(numero, texto) {
  const estado = sessionState.get(numero);
  estado.tamanho = texto;
  estado.etapa = 'totem_unidades';
  sessionState.set(numero, estado);

  await delay(5000);
  await client.sendMessage(numero, 'Quantas unidades seriam?');
}

async function handleTotemUnidades(numero, texto) {
  const qtd = parseInt(texto);
  if (isNaN(qtd) || qtd <= 0) {
    await delay(5000);
    await client.sendMessage(numero, 'Por favor, informe um número válido para quantidade.');
    return;
  }
  const estado = sessionState.get(numero);
  estado.quantidade = qtd;

  await delay(5000);
  await client.sendMessage(numero, 'Obrigado pelas informações! Logo o setor responsável entrará em contato.');
  sessionState.delete(numero);
}

// Outros
async function handleOutros(numero, texto) {
  switch (texto) {
    case '1':
      sessionState.set(numero, { etapa: 'santinhos' });
      await delay(5000);
      await client.sendMessage(numero,
        `PEDIDO MÍNIMO

1️⃣ 7x10 1 lado - colche 90g brilho -  5.000unid R$250,00 | 10.000unid R$320,00
2️⃣ 7x10 2 lados - colche 90g brilho - 5.000unid R$280,00 | 10.000unid R$380,00

Qual a quantidade desejada?

1️⃣ - 5.000 unidades
2️⃣ - 10.000 unidades`);
      break;
    case '2':
      sessionState.set(numero, { etapa: 'wind_banner' });
      await delay(5000);
      await client.sendMessage(numero,
        `1️⃣ - WIND BANNER 250x50cm COM BASE -R$ 320,00
2️⃣ - WIND BANNER 310x60cm COM BASE - R$ 360,00

ITENS QUE ACOMPANHAM O PRODUTO:

- BASE DE SUSTENÇÃO
- VARETAS
- WIND BANNER EM TECIDO POLIESTER SUBLIMADO

Digite o número da opção.`);
      break;
    case '3':
      await delay(5000);
      await client.sendMessage(numero, 'Um atendente irá entrar em contato com você. Por favor, aguarde.');
      sessionState.delete(numero);
      break;
    default:
      await delay(5000);
      await client.sendMessage(numero, 'Opção inválida. Digite 1, 2 ou 3.');
  }
}

// Santinhos
async function handleSantinhos(numero, texto) {
  if (!['1', '2'].includes(texto)) {
    await delay(5000);
    await client.sendMessage(numero, 'Digite 1 ou 2 para escolher a opção.');
    return;
  }
  const estado = sessionState.get(numero);
  estado.santinhosOpcao = texto;
  estado.etapa = 'santinhos_quantidade';
  sessionState.set(numero, estado);

  await delay(5000);
  await client.sendMessage(numero, 'Qual a quantidade desejada?\n\n1️⃣ - 5.000 unidades\n2️⃣ - 10.000 unidades');
}

async function handleSantinhosQuantidade(numero, texto) {
  if (!['1', '2'].includes(texto)) {
    await delay(5000);
    await client.sendMessage(numero, 'Digite 1 ou 2 para escolher a quantidade.');
    return;
  }
  const estado = sessionState.get(numero);
  let valor = 0;
  if (estado.santinhosOpcao === '1') {
    valor = texto === '1' ? 250 : 320;
  } else {
    valor = texto === '1' ? 280 : 380;
  }
  estado.etapa = 'pagamento_escolha';
  estado.valor = valor;
  estado.descricao = `Santinhos opção ${estado.santinhosOpcao}, quantidade ${texto === '1' ? '5.000' : '10.000'}`;
  estado.retorno = 'menu';
  sessionState.set(numero, estado);

  await delay(5000);
  await client.sendMessage(numero,
    `Seu orçamento fica no valor: R$ ${valor.toFixed(2).replace('.', ',')}

O seu material entrará em produção assim que efetuado o pagamento. Lembrando que para esse tipo de material o prazo de confecção é de 3 a 5 dias úteis após pagamento e aprovação da arte.
Nos envie o comprovante e a arte do material, para que possamos colocar na fila de produção.

Escolha a forma de pagamento:

${formasPagamentoMsg}`);
}

// Wind Banner
async function handleWindBanner(numero, texto) {
  if (!['1', '2'].includes(texto)) {
    await delay(5000);
    await client.sendMessage(numero, 'Digite 1 ou 2 para escolher a opção.');
    return;
  }
  const estado = sessionState.get(numero);
  estado.windBannerOpcao = texto;
  estado.etapa = 'wind_banner_quantidade';
  sessionState.set(numero, estado);

  await delay(5000);
  await client.sendMessage(numero, 'Quantas unidades seriam? Responda apenas com números.');
}

async function handleWindBannerQuantidade(numero, texto) {
  const qtd = parseInt(texto);
  if (isNaN(qtd) || qtd <= 0) {
    await delay(5000);
    await client.sendMessage(numero, 'Por favor, informe um número válido para quantidade.');
    return;
  }
  const estado = sessionState.get(numero);
  let valorUnit = 0;
  if (estado.windBannerOpcao === '1') valorUnit = 320;
  else valorUnit = 360;
  const total = valorUnit * qtd;

  estado.etapa = 'pagamento_escolha';
  estado.valor = total;
  estado.descricao = `Wind Banner opção ${estado.windBannerOpcao}, quantidade ${qtd}`;
  estado.retorno = 'menu';
  sessionState.set(numero, estado);

  await delay(5000);
  await client.sendMessage(numero,
    `Seu orçamento fica no valor: R$ ${total.toFixed(2).replace('.', ',')}

O seu material entrará em produção assim que efetuado o pagamento. Lembrando que para esse tipo de material o prazo de entrega é de 3 a 5 dias úteis após pagamento e aprovação da arte.
Nos envie o comprovante e a arte do material, para que possamos colocar na fila de produção.

Escolha a forma de pagamento:

${formasPagamentoMsg}`);
}

// Pagamento
async function handlePagamentoEscolha(numero, texto) {
  const estado = sessionState.get(numero);
  if (!estado || !estado.valor || !estado.descricao) {
    await delay(5000);
    await client.sendMessage(numero, 'Erro: orçamento não encontrado. Digite "menu" para reiniciar.');
    sessionState.set(numero, { etapa: 'menu' });
    return;
  }

  if (texto === '1') {
    await delay(5000);
    await client.sendMessage(numero,
      `*Pagamento via PIX*

Chave PIX: DJALMA JÚNIOR - 8799994994

Após confirmação do pagamento, seu produto será produzido.
Prazo de produção: conforme o informado no orçamento.

Envie o comprovante para dar continuidade.`);
    estado.etapa = 'aguardar_comprovante';
    sessionState.set(numero, estado);
  } else if (texto === '2') {
    await delay(5000);
    await client.sendMessage(numero,
      `*Pagamento em Dinheiro*

O produto será confeccionado após confirmação do pagamento presencial.
O prazo será informado após o pagamento e aprovação da arte.

Envie uma mensagem quando realizar o pagamento para continuar.`);
    estado.etapa = 'aguardar_comprovante';
    sessionState.set(numero, estado);
  } else {
    await delay(5000);
    await client.sendMessage(numero, 'Opção inválida. Digite 1 para Pix ou 2 para Dinheiro.');
  }
}

async function handleAguardarComprovante(numero, texto) {
  // Aqui você pode implementar uma lógica para armazenar o comprovante,
  // validar por imagem ou texto, etc. Por simplicidade, vamos apenas agradecer.
  await delay(5000);
  await client.sendMessage(numero, `Recebemos seu comprovante/mensagem.

Obrigado por comprar conosco! Qualquer dúvida, digite "menu" para voltar ao início.`);
  sessionState.delete(numero);
}

// Funções auxiliares e exportação

async function generateQr() {
  if (lastQrUrl) {
    return lastQrUrl;
  }
  return null;
}

function getClient() {
  return client;
}

function getStatus() {
  return status;
}

function getBotMessages() {
  return saudacaoInicial;
}

module.exports = { startBot, generateQr, getClient, getStatus, getBotMessages };
