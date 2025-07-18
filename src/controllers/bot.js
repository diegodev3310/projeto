const { generateQr, getClient, getStatus } = require('../services/bot');
const { ApiResponse } = require('../models/apiResponse');

class BotController {
  constructor() {}

  async getQrCode(req, res) {
    try {
      const resp = new ApiResponse(200, 'QR Code gerado com sucesso');
      resp.data = { qrUrl: await generateQr() };

      if (resp.data) {
        res.status(resp.status).json(resp);
      } else {
        resp.status = 500;
        resp.message = 'Erro ao gerar QR Code.';
        res.status(resp.status).json(resp);
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      res.status(500).send('Erro ao gerar QR Code.');
    }
  }

  getClientStatus(req, res) {
    const resp = new ApiResponse(200, 'Status do cliente');
    const currentStatus = getStatus(); // ← CORRETO!
    resp.data = { status: currentStatus };
    res.status(resp.status).json(resp);
  }
}

module.exports = { BotController };
