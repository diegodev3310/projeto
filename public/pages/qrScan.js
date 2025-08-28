export function renderQR(app, navigate) {
  app.innerHTML = `
  <h1>Bot Flow</h1>
  <h2>Controle do Bot WhatsApp</h2>
  <button id="refreshQr">Recarregar QR</button>

  <div id="status-global">Status: Desconectado</div>

  <h3 style="margin-top:50px; color:#d0f4f7; font-weight: 400;">
    Escaneie o(s) QR Code(s) com o WhatsApp
  </h3>
  <div id="qrcode"></div>
  <button id="logoutButton">Sair</button>`;

  const qrDiv = document.getElementById("qrcode");
  const refreshButton = document.getElementById("refreshQr");
  const statusDiv = document.getElementById("status-global");
  const logoutButton = document.getElementById("logoutButton");

  logoutButton.addEventListener("click", () => {
    navigate('login');
  });

  refreshButton.addEventListener("click", () => {
    loadQrOnPage(qrDiv);
    updateStatus(statusDiv);
  });

  loadQrOnPage(qrDiv);
  updateStatus(statusDiv);
  setInterval(() => updateStatus(statusDiv), 5000);  // Atualiza status a cada 5 segundos
  setInterval(() => loadQrOnPage(qrDiv), 30000); // Atualiza QR Code a cada 30 segundos
}

async function loadQrOnPage(qrDiv) {
  try {
    console.log("Carregando QR Code");
    const response = await fetch("/api/generate-qr");
    if (!response.ok) throw new Error("Erro ao gerar QR Code");
    const resp = await response.json();
    qrDiv.innerHTML = `<img src="${resp.data.qrUrl}" alt="QR Code" />`;
  } catch (error) {
    console.error("Erro ao carregar QR Code:", error);
    qrDiv.innerHTML = '<span style="color:red">Erro ao gerar QR Code</span>';
  }
}

async function updateStatus(statusDiv) {
  try {
    console.log("Atualizando status do bot");
    const res = await fetch("/api/status");
    if (!res.ok) throw new Error("Erro ao obter status");
    const data = await res.json();
    const status = data.data.status;
    console.log("Status atualizado:", status);
    statusDiv.textContent = `Status: ${status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}`;
  } catch (error) {
    console.error("Erro ao obter status:", error);
    statusDiv.textContent = "Status: erro ao obter";
  }
}