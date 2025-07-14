const qrDiv = document.getElementById("qrcode");
const refreshButton = document.getElementById("refreshQr");
const statusDiv = document.getElementById("status-global");

async function loadQrOnPage() {
  try {
    const response = await fetch("/api/generate-qr");
    if (!response.ok) throw new Error("Erro ao gerar QR Code");
    const resp = await response.json();
    qrDiv.innerHTML = `<img src="${resp.data.qrUrl}" alt="QR Code" />`;
  } catch (error) {
    console.error("Erro ao carregar QR Code:", error);
    qrDiv.innerHTML = '<span style="color:red">Erro ao gerar QR Code</span>';
  }
}

async function updateStatus() {
  try {
    const res = await fetch("/api/status");
    if (!res.ok) throw new Error("Erro ao obter status");
    const data = await res.json();
    const status = data.data.status;
    statusDiv.textContent = `Status: ${status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}`;
  } catch (error) {
    console.error("Erro ao obter status:", error);
    statusDiv.textContent = "Status: erro ao obter";
  }
}

refreshButton.addEventListener("click", () => {
  loadQrOnPage();
});

// Atualiza QR Code e Status ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  loadQrOnPage();
  updateStatus();
  setInterval(updateStatus, 5000);  // Atualiza status a cada 5 segundos
  setInterval(loadQrOnPage, 30000); // Atualiza QR Code a cada 30 segundos
});
