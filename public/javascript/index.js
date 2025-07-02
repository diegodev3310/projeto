const startNewBtn = document.getElementById("start-new-session");
const qrDiv = document.getElementById("qrcode");

async function startNewSession() {
  const resp = await fetch("/api/generate-qr")
  .then(response => {
    if (!response.ok) {
      throw new Error("Erro ao gerar QR Code");
    }
    return response.json();
  })
  .catch(error => {
    console.error("Erro ao iniciar nova sessão:", error);
  });
  qrDiv.innerHTML = `<img src="${resp.qrUrl}" alt="QR Code" />`;
}

startNewBtn.addEventListener("click", startNewSession);