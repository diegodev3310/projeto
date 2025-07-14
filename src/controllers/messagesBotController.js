const { MessagesBotService } = require('../services/messagesBotService');
const { MessageRequest } = require('../models/messagesBot');

class MessageBotController {
  async create(req, res) {
    const funcTag = '[MessageBotController.create]';
    try {
      console.log(`${funcTag} Iniciando criação de mensagem...`);
      const msgRequest = new MessageRequest(null, req.body.message)
      const result = await this.messagesBotService.create(msgRequest);
      console.log(`${funcTag} Mensagem criada com sucesso:`, result);
      res.status(result.status || 201).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao criar mensagem:`, error);
      res.status(500).json({ error: 'Erro ao criar mensagem' });
    }
  }

  async readAll(req, res) {
    const funcTag = '[MessageBotController.readAll]';
    try {
      const messagesBotService = new MessagesBotService();
      console.log(`${funcTag} Buscando todas as mensagens...`);
      const result = await messagesBotService.readAll();
      console.log(`${funcTag} Mensagens encontradas:`, result);
      res.status(200).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao buscar mensagens:`, error);
      res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
  }

  async update(req, res) {
    const funcTag = '[MessageBotController.update]';
    try {
      const messagesBotService = new MessagesBotService();
      const { id } = req.params;
      console.log(`${funcTag} Atualizando mensagem com ID: ${id}`);
      const result = await messagesBotService.update(id, req.body);
      console.log(`${funcTag} Mensagem atualizada:`, result);
      res.status(result.status || 200).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao atualizar mensagem:`, error);
      res.status(500).json({ error: 'Erro ao atualizar mensagem' });
    }
  }

  async delete(req, res) {
    const funcTag = '[MessageBotController.delete]';
    try {
      const messagesBotService = new MessagesBotService();
      const { id } = req.params;
      console.log(`${funcTag} Deletando mensagem com ID: ${id}`);
      const result = await messagesBotService.delete(id);
      console.log(`${funcTag} Mensagem deletada:`, result);
      res.status(result.status || 200).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao deletar mensagem:`, error);
      res.status(500).json({ error: 'Erro ao deletar mensagem' });
    }
  }
}


module.exports = { MessageBotController };
