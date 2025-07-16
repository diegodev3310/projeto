const { MessagesActionsRepository } = require('../repository/messagesActionsRepository');
const { ApiResponse } = require('../models/apiResponse');
const { MessageActionRequest } = require('../models/messageAction');

class MessagesActionsService {
  constructor() {
    this.messagesActionsRepository = new MessagesActionsRepository();
  }

  async create(messageActionReq) {
    const funcTag = '[MessagesActionsService.create]';
    try {
      console.log(`${funcTag} Iniciando criação de action...`);
      const result = await this.messagesActionsRepository.insert(messageActionReq);
      console.log(`${funcTag} Action criada com sucesso:`, result);
      return new ApiResponse(201, 'Ação criada com sucesso', result);
    } catch (error) {
      console.error(`${funcTag} Erro ao criar ação:`, error);
      throw error;
    }
  }

  async readAll() {
    const funcTag = '[MessagesActionsService.readAll]';
    try {
      console.log(`${funcTag} Buscando todas as ações...`);
      const result = await this.messagesActionsRepository.getAll();
      console.log(`${funcTag} Ações encontradas:`, result);
      return new ApiResponse(200, 'Ações recuperadas com sucesso', result);
    } catch (error) {
      console.error(`${funcTag} Erro ao buscar ações:`, error);
      throw error;
    }
  }

  async update(messageActionReq) {
    const funcTag = '[MessagesActionsService.update]';
    try {
      console.log(`${funcTag} Atualizando ação com ID: ${messageActionReq.id}`);
      const result = await this.messagesActionsRepository.update(messageActionReq);
      console.log(`${funcTag} Ação atualizada com sucesso:`, result);
      return new ApiResponse(200, 'Ação atualizada com sucesso', result);
    } catch (error) {
      console.error(`${funcTag} Erro ao atualizar ação:`, error);
      throw error;
    }
  }

  async delete(id) {
    const funcTag = '[MessagesActionsService.delete]';
    try {
      console.log(`${funcTag} Deletando ação com ID: ${id}`);
      const result = await this.messagesActionsRepository.delete(id);
      console.log(`${funcTag} Ação deletada com sucesso:`, result);
      return new ApiResponse(200, 'Ação deletada com sucesso', result);
    } catch (error) {
      console.error(`${funcTag} Erro ao deletar ação:`, error);
      throw error;
    }
  }
}

module.exports = { MessagesActionsService };
