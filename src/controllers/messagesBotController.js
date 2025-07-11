const { MessagesBotService } = require('../services/messagesBotService');
const { MessageRequest } = require('../models/messagesBot');

class MesssageBotController {
   constructor() {
    this.messagesBotService = new MessagesBotService();
    this.create = this.create.bind(this);
    this.readAll = this.readAll.bind(this);
  }

  async create(req, res) {
    const funcTag = '[MesssageBotController.create]';
    try {
      console.log(`${funcTag} Iniciando criação de mensagem...`);
      const msgRequest = new MessageRequest(null, req.body.message)
      const result = await this.messagesBotService.create(msgRequest);
      console.log(`${funcTag} Mensagem criada com sucesso:`, result);
      res.status(result.status).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao criar mensagem:`, error);
      res.status(500).json({ error: 'Erro ao criar mensagem' });
    }
  }

  async readAll(req, res) {
    const funcTag = '[MesssageBotController.readAll]';
    try {
      console.log(`${funcTag} Iniciando recuperação de mensagens...`);
      const result = await this.messagesBotService.readAll();
      console.log(`${funcTag} Mensagem recuperadas com sucesso`);
      res.status(result.status).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao recuperar mensagem:`, error);
      res.status(500).json({ error: 'Erro ao recuperar mensagem' });
    }
  }

  async update(req, res) {
  }

  async delete(req, res) {
  }
}

module.exports = { MesssageBotController };