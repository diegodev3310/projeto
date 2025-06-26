const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

let mainWindow;
const runningClients = new Map(); // chave = sessionId, valor = processo

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("public/index.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function listSessions() {
  const basePath = path.join(__dirname, ".wwebjs_auth");
  if (!fs.existsSync(basePath)) return [];
  const items = fs.readdirSync(basePath, { withFileTypes: true });
  return items.filter(i => i.isDirectory()).map(i => i.name);
}

function startClient(sessionId) {
  if (runningClients.has(sessionId)) {
    mainWindow.webContents.send("bot-error", `Sessão ${sessionId} já está em execução.`);
    return;
  }

  const botPath = path.join(__dirname, "bot.js");
  const child = spawn("node", [botPath, sessionId], { stdio: ["pipe", "pipe", "pipe"] });

  runningClients.set(sessionId, child);

  child.stdout.on("data", data => {
    const output = data.toString().trim();

    if (output.startsWith("QR_CODE_DATAURL:")) {
      const match = output.match(/^QR_CODE_DATAURL:(.*?):(data:image\/png;base64,.*)$/);
      if (match) {
        const [, sid, url] = match;
        mainWindow.webContents.send("qr", { sessionId: sid, url });
        mainWindow.webContents.send("bot-status", { sessionId: sid, status: "Aguardando escaneamento do QR Code" });
      } else {
        mainWindow.webContents.send("bot-error", { sessionId: "desconhecida", error: "Formato de QR Code inválido." });
      }
      return;
    }

    if (output.startsWith("BOT_READY:")) {
      const sid = output.split(":")[1];
      mainWindow.webContents.send("bot-status", { sessionId: sid, status: "Conectado!" });
      mainWindow.webContents.send("qr", { sessionId: sid, url: null });
      return;
    }

    if (output.startsWith("CLIENT_INFO:")) {
      const parts = output.split(":");
      const sid = parts[1];
      const info = parts.slice(2).join(":");
      mainWindow.webContents.send("client-info", { sessionId: sid, info });
      return;
    }

    mainWindow.webContents.send("bot-output", { sessionId, output });
  });

  child.stderr.on("data", data => {
    const error = data.toString();
    mainWindow.webContents.send("bot-error", { sessionId, error });
  });

  child.on("close", code => {
    mainWindow.webContents.send("bot-status", { sessionId, status: `Bot encerrado com código ${code}` });
    runningClients.delete(sessionId);
  });

  child.on("error", err => {
    mainWindow.webContents.send("bot-error", { sessionId, error: err.message });
    runningClients.delete(sessionId);
  });
}

function stopClient(sessionId) {
  if (runningClients.has(sessionId)) {
    runningClients.get(sessionId).kill();
    runningClients.delete(sessionId);
    mainWindow.webContents.send("bot-status", { sessionId, status: "Bot encerrado manualmente." });
    mainWindow.webContents.send("qr", { sessionId, url: null });
  } else {
    mainWindow.webContents.send("bot-status", { sessionId, status: "Bot não está em execução." });
  }
}

function deleteSession(sessionId) {
  const sessionPath = path.join(__dirname, ".wwebjs_auth", sessionId);
  if (fs.existsSync(sessionPath)) {
    try {
      fs.rmSync(sessionPath, { recursive: true, force: true });
      mainWindow.webContents.send("session-deleted", sessionId);
    } catch (err) {
      mainWindow.webContents.send("bot-error", { sessionId, error: `Erro ao apagar sessão: ${err.message}` });
    }
  } else {
    mainWindow.webContents.send("bot-error", { sessionId, error: "Sessão não encontrada para apagar." });
  }
}

// Comunicação com renderer (index)
ipcMain.on("get-sessions", () => {
  const sessions = listSessions();
  mainWindow.webContents.send("sessions-data", sessions);
});

ipcMain.on("start-session", (event, sessionId) => {
  startClient(sessionId);
});

ipcMain.on("stop-session", (event, sessionId) => {
  stopClient(sessionId);
});

ipcMain.on("delete-session", (event, sessionId) => {
  stopClient(sessionId);
  deleteSession(sessionId);
});

ipcMain.on("start-new-session", () => {
  const sessions = listSessions();
  let maxNum = 1;
  sessions.forEach(s => {
    const match = s.match(/^session(\d+)$/);
    if (match) {
      const num = parseInt(match[1]);
      if (num >= maxNum) maxNum = num + 1;
    }
  });
  const newSession = `session${maxNum}`;
  startClient(newSession);
  mainWindow.webContents.send("new-session-started", newSession);
});

// Inicializar janela
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  runningClients.forEach(proc => proc.kill());
  if (process.platform !== "darwin") app.quit();
});
