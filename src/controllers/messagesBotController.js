const { MessagesBotService } = require('../services/messagesBotService');
const { MessageRequest } = require('../models/messagesBot');
const { getBotMessages } = require('../services/bot');

class MessageBotController {
  constructor() {
    this.messagesBotService = new MessagesBotService();
  }

  async create(req, res) {
    const funcTag = '[MessageBotController.create]';
    try {
      console.log(`${funcTag} Iniciando criação de mensagem...`);
      const msgRequest = new MessageRequest(null, req.body.message, req.body.logical_key, req.body.node_type, req.body.initial_node);
      const result = await this.messagesBotService.create(msgRequest);
      console.log(`${funcTag} Mensagem criada com sucesso`);
      getBotMessages();
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
      console.log(`${funcTag} Mensagens encontradas`);
      res.status(result.status || 200).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao buscar mensagens:`, error);
      res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
  }

  async updateMessage(req, res) {
    const funcTag = '[MessageBotController.updateMessage]';
    try {
      console.log(`${funcTag} Atualizando mensagem com logical_key: ${logical_key}`);
      console.log(`${funcTag} Dados recebidos:`, req.body);
      const msgRequest = new MessageRequest(null, req.body.message, req.body.logical_key);
      const result = await this.messagesBotService.updateMessage(msgRequest);
      console.log(`${funcTag} Mensagem atualizada com sucesso`);
      getBotMessages();
      res.status(result.status || 200).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao atualizar mensagem:`, error);
      res.status(500).json({ error: 'Erro ao atualizar mensagem' });
    }
  }

  async delete(req, res) {
    const funcTag = '[MessageBotController.delete]';
    try {
      const { logical_key } = req.params;
      console.log(`${funcTag} Deletando mensagem com logical_key: ${logical_key}`);
      const result = await this.messagesBotService.delete(logical_key);
      console.log(`${funcTag} Mensagem deletada com sucesso`);
      getBotMessages();
      res.status(result.status || 200).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao deletar mensagem:`, error);
      res.status(500).json({ error: 'Erro ao deletar mensagem' });
    }
  }
}

module.exports = { MessageBotController };
