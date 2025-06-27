const { ipcRenderer } = require("electron");

const sessionSelect = document.getElementById("session-select");
const showSessionsBtn = document.getElementById("show-sessions");
const startSelectedBtn = document.getElementById("start-selected-session");
const startNewBtn = document.getElementById("start-new-session");
const deleteSessionBtn = document.getElementById("delete-session");

const qrcodeContainer = document.getElementById("qrcode");
const statusGlobal = document.getElementById("status-global");

let sessions = []; // lista de nomes strings
let sessionInfos = {}; // infos JSON string por sessionId
let sessionStatuses = {}; // status string por sessionId
let sessionQRCodes = {}; // url string por sessionId

function refreshSessionSelect() {
  sessionSelect.innerHTML = "";
  if (sessions.length === 0) {
    const opt = document.createElement("option");
    opt.text = "Nenhuma sessão disponível";
    opt.disabled = true;
    sessionSelect.add(opt);
    return;
  }
  sessions.forEach(sid => {
    const opt = document.createElement("option");
    opt.value = sid;
    opt.text = sid;
    sessionSelect.add(opt);
  });
}

function renderQRCodes() {
  qrcodeContainer.innerHTML = "";
  if (sessions.length === 0) {
    qrcodeContainer.innerHTML = "<p style='color:#fff;'>Nenhuma sessão em execução.</p>";
    return;
  }

  sessions.forEach(sid => {
    const div = document.createElement("div");
    div.id = `qr-${sid}`;

    const title = document.createElement("div");
    title.className = "session-title";
    title.textContent = `Sessão: ${sid}`;
    div.appendChild(title);

    if (sessionQRCodes[sid]) {
      const img = document.createElement("img");
      img.src = sessionQRCodes[sid];
      img.alt = `QR Code da sessão ${sid}`;
      div.appendChild(img);
    } else {
      const noQr = document.createElement("div");
      noQr.textContent = "QR Code indisponível";
      noQr.style.color = "#888";
      div.appendChild(noQr);
    }

    // Mostrar info cliente
    const infoDiv = document.createElement("pre");
    infoDiv.className = "session-info";
    infoDiv.textContent = sessionInfos[sid] ? JSON.stringify(JSON.parse(sessionInfos[sid]), null, 2) : "Info não disponível";
    div.appendChild(infoDiv);

    // Mostrar status
    const statusDiv = document.createElement("div");
    statusDiv.className = "session-info";
    statusDiv.style.marginTop = "8px";
    statusDiv.style.background = "#d0f4f7";
    statusDiv.style.fontWeight = "700";
    statusDiv.textContent = sessionStatuses[sid] || "Status: Desconhecido";
    div.appendChild(statusDiv);

    qrcodeContainer.appendChild(div);
  });
}

showSessionsBtn.addEventListener("click", () => {
  ipcRenderer.send("get-sessions");
});

// Ao receber lista de sessões do main
ipcRenderer.on("sessions-data", (event, data) => {
  sessions = data;
  refreshSessionSelect();
});

// Botão iniciar sessão selecionada
startSelectedBtn.addEventListener("click", () => {
  if (!sessionSelect.value) {
    alert("Selecione uma sessão para iniciar.");
    return;
  }
  ipcRenderer.send("start-session", sessionSelect.value);
});

// Botão iniciar nova sessão
startNewBtn.addEventListener("click", () => {
  ipcRenderer.send("start-new-session");
});

// Ao receber notificação de nova sessão iniciada (pra atualizar select e lista)
ipcRenderer.on("new-session-started", (event, newSession) => {
  if (!sessions.includes(newSession)) {
    sessions.push(newSession);
    refreshSessionSelect();
  }
});

// Botão apagar sessão
deleteSessionBtn.addEventListener("click", () => {
  if (!sessionSelect.value) {
    alert("Selecione uma sessão para apagar.");
    return;
  }
  const conf = confirm(`Apagar sessão "${sessionSelect.value}"? Isso encerrará o bot e apagará os dados.`);
  if (conf) {
    ipcRenderer.send("delete-session", sessionSelect.value);
  }
});

// Atualiza QR, status e info para sessões
ipcRenderer.on("qr", (event, { sessionId, url }) => {
  sessionQRCodes[sessionId] = url;
  renderQRCodes();
});

ipcRenderer.on("bot-status", (event, { sessionId, status }) => {
  sessionStatuses[sessionId] = status;
  renderQRCodes();

  // Atualiza status global simples se só tiver 1 sessão (pra evitar poluição)
  if (sessions.length === 1) {
    statusGlobal.textContent = `Status: ${status}`;
  } else {
    statusGlobal.textContent = `Status: Múltiplas sessões ativas`;
  }
});

ipcRenderer.on("client-info", (event, { sessionId, info }) => {
  sessionInfos[sessionId] = info;
  renderQRCodes();
});

ipcRenderer.on("bot-error", (event, { sessionId, error }) => {
  alert(`Erro na sessão ${sessionId}: ${error}`);
});

// Inicializar lista na carga da página
window.onload = () => {
  ipcRenderer.send("get-sessions");
};
