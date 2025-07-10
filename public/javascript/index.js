const qrDiv = document.getElementById("qrcode");

async function loadQrOnPage() {
  try {
    const response = await fetch("/api/generate-qr");
    if (!response.ok) {
      throw new Error("Erro ao gerar QR Code");
    }
    const data = await response.json();
    qrDiv.innerHTML = `<img src="${data.qrUrl}" alt="QR Code" />`;
  } catch (error) {
    console.error("Erro ao carregar QR Code:", error);
    qrDiv.innerHTML = '<span style="color:red">Erro ao gerar QR Code</span>';
  }
}

// Atualiza o QR Code a cada 30 segundos
window.addEventListener("DOMContentLoaded", () => {
  loadQrOnPage();
  setInterval(loadQrOnPage, 30000); // 30 segundos
});