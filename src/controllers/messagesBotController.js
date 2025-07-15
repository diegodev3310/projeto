const { MessagesBotService } = require('../services/messagesBotService');
const { MessageRequest } = require('../models/messagesBot');

class MessageBotController {
  constructor() {
    this.messagesBotService = new MessagesBotService();
  }

  async create(req, res) {
    const funcTag = '[MessageBotController.create]';
    try {
      console.log(`${funcTag} Iniciando criação de mensagem...`);
      console.log(`${funcTag} Dados recebidos:`, req.body);

      const msgRequest = new MessageRequest(null, req.body.message);
      console.log(`${funcTag} Dados formatados:`, msgRequest);

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
      console.log(`${funcTag} Buscando todas as mensagens...`);
      const result = await this.messagesBotService.readAll();
      console.log(`${funcTag} Mensagens encontradas:`, result);
      res.status(result.status || 200).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao buscar mensagens:`, error);
      res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
  }

  async update(req, res) {
    const funcTag = '[MessageBotController.update]';
    try {
      const { id } = req.params;
      console.log(`${funcTag} Atualizando mensagem com ID: ${id}`);
      console.log(`${funcTag} Dados recebidos:`, req.body);

      const msgRequest = new MessageRequest(id, req.body.message);
      console.log(`${funcTag} Dados formatados:`, msgRequest);

      const result = await this.messagesBotService.update(id, msgRequest);
      console.log(`${funcTag} Mensagem atualizada com sucesso:`, result);

      res.status(result.status || 200).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao atualizar mensagem:`, error);
      res.status(500).json({ error: 'Erro ao atualizar mensagem' });
    }
  }

  async delete(req, res) {
    const funcTag = '[MessageBotController.delete]';
    try {
      const { id } = req.params;
      console.log(`${funcTag} Deletando mensagem com ID: ${id}`);

      const result = await this.messagesBotService.delete(id);
      console.log(`${funcTag} Mensagem deletada com sucesso:`, result);

      res.status(result.status || 200).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao deletar mensagem:`, error);
      res.status(500).json({ error: 'Erro ao deletar mensagem' });
    }
  }
}

module.exports = { MessageBotController };
