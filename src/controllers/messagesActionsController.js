const { MessagesActionsService } = require('../services/messagesActionsService');
const { MessageActionRequest } = require('../models/messageAction');

class MessagesActionsController {
  constructor() {
    this.messagesActionsService = new MessagesActionsService();
  }

  async create(req, res) {
    const funcTag = '[MessagesActionsController.create]';
    try {
      console.log(`${funcTag} Requisição recebida para criar uma nova ação.`);
      const messageActionReq = new MessageActionRequest(null, req.body.action);
      const result = await this.messagesActionsService.create(messageActionReq);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao criar ação:`, error);
      return res.status(500).json({ error: 'Erro ao criar ação' });
    }
  }

  async readAll(req, res) {
    const funcTag = '[MessagesActionsController.readAll]';
    try {
      console.log(`${funcTag} Requisição para buscar todas as ações.`);
      const result = await this.messagesActionsService.readAll();
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao buscar ações:`, error);
      return res.status(500).json({ error: 'Erro ao buscar ações' });
    }
  }

  async update(req, res) {
    const funcTag = '[MessagesActionsController.update]';
    try {
      const { id } = req.params;
      console.log(`${funcTag} Requisição para atualizar ação com ID: ${id}`);
      const messageActionReq = new MessageActionRequest(id, req.body.action);
      const result = await this.messagesActionsService.update(messageActionReq);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao atualizar ação:`, error);
      return res.status(500).json({ error: 'Erro ao atualizar ação' });
    }
  }

  async delete(req, res) {
    const funcTag = '[MessagesActionsController.delete]';
    try {
      const { id } = req.params;
      console.log(`${funcTag} Requisição para deletar ação com ID: ${id}`);
      const result = await this.messagesActionsService.delete(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao deletar ação:`, error);
      return res.status(500).json({ error: 'Erro ao deletar ação' });
    }
  }
}

module.exports = { MessagesActionsController };
