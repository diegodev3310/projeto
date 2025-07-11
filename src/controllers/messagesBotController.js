const { MessagesBotService } = require('../services/messagesBotService');

class MesssageBotController {
  async create(req, res) {
    const funcTag = '[MesssageBotController.create]';
    try {
      const messagesBotService = new MessagesBotService();
      console.log(`${funcTag} Iniciando criação de mensagem...`);
      const result = await messagesBotService.create(req.body);
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
      const messagesBotService = new MessagesBotService();
      console.log(`${funcTag} Iniciando recuperação de mensagens...`);
      const result = await messagesBotService.readAll();
      console.log(`${funcTag} Mensagem recuperadas com sucesso:`, result);
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