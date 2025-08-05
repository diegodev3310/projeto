const { MessagesTransitionsService } = require('../services/messagesTransitionsService');
const { MessageTransitionsRequest } = require('../models/messagesTransitions');

class MessageTransitionsController {
  constructor() {
    this.MessagesTransitionsService = new MessagesTransitionsService();
  }

  async create(req, res) {
    const funcTag = '[MessageTransitionsController.create]';
    try {
      console.log(`${funcTag} Iniciando criação de transição...`);
      const transitionRequest = new MessageTransitionsRequest(null, req.body.from_message_id, req.body.to_message_id, req.body.condition);
      const result = await this.MessagesTransitionsService.create(transitionRequest);
      console.log(`${funcTag} Transição criada com sucesso`);
      res.status(result.status || 201).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao criar transição:`, error);
      res.status(500).json({ error: 'Erro ao criar transição' });
    }
  }

  async readAll(req, res) {
    const funcTag = '[MessageTransitionsController.readAll]';
    try {
      console.log(`${funcTag} Buscando todas as transitions...`);
      const result = await this.MessagesTransitionsService.readAll();
      console.log(`${funcTag} Transitions encontradas`);
      res.status(result.status || 200).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao buscar mensagens:`, error);
      res.status(500).json({ error: 'Erro ao buscar transitions' });
    }
  }

  async update(req, res) {
    const funcTag = '[MessageTransitionsController.update]';
    try {
      const { id } = req.params;
      console.log(`${funcTag} Requisição para atualizar transição com ID: ${id}`);
      const transitionRequest = new MessageTransitionsRequest(id, req.body.from_message_id, req.body.to_message_id, req.body.condition);
      const result = await this.MessagesTransitionsService.update(transitionRequest);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao atualizar transição:`, error);
      return res.status(500).json({ error: 'Erro ao atualizar transição' });
    }
  }

  async delete(req, res) {
    const funcTag = '[MessageTransitionsController.delete]';
    try {
      const { id } = req.params;
      console.log(`${funcTag} Requisição para deletar transição com ID: ${id}`);
      const result = await this.MessagesTransitionsService.delete(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao deletar transição:`, error);
      return res.status(500).json({ error: 'Erro ao deletar transição' });
    }
  }
}

module.exports = { MessageTransitionsController };
