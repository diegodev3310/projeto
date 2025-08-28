const { MessagesTransitionsRepository } = require('../repository/messagesTransitionsRepository');
const { ApiResponse } = require('../models/apiResponse');

class MessagesTransitionsService {
  constructor() {
    this.MessagesTransitionsRepository = new MessagesTransitionsRepository();
  }

  async create(transitionRequest) {
    const funcTag = "[MessagesTransitionsService.create]";
    try {
      console.log(`${funcTag} Enviando dados para o repositório...`);
      const result = await this.MessagesTransitionsRepository.insert(transitionRequest);
      console.log(`${funcTag} Transição criada com sucesso`);
      return new ApiResponse(201, 'Transição criada com sucesso', result);
    } catch (error) {
      console.error(`${funcTag} Erro ao criar transição:`, error);
      throw error;
    }
  }

  async readAll() {
    const funcTag = "[MessagesTransitionsService.readAll]";
    try {
      console.log(`${funcTag} Recuperando transitions do repositório...`);
      const result = await this.MessagesTransitionsRepository.getAll();
      console.log(`${funcTag} Transitions recuperadas no repositorio`);
      const apiResponse = new ApiResponse(201, 'Transitions recuperadas com sucesso', result);
      return apiResponse;
    } catch (error) {
      console.error(`${funcTag} Erro ao recuperar transitions:`, error);
      throw error;
    }
  }

  async update(id) {
    const funcTag = "[MessagesTransitionsService.update]";
    try {
      console.log(`${funcTag} Atualizando transição com ID: ${id}`);
      const result = await this.MessagesTransitionsRepository.update(id);
      console.log(`${funcTag} Transição atualizada com sucesso`);
      return new ApiResponse(200, 'Transição atualizada com sucesso', result);
    } catch (error) {
      console.error(`${funcTag} Erro ao atualizar transição:`, error);
      throw error;
    }
  }

  async delete(id) {
    const funcTag = "[MessagesTransitionsService.delete]";
    try {
      console.log(`${funcTag} Deletando transição com ID: ${id}`);
      const result = await this.MessagesTransitionsRepository.delete(id);
      console.log(`${funcTag} Transição deletada com sucesso`);
      return new ApiResponse(200, 'Transição deletada com sucesso', result);
    } catch (error) {
      console.error(`${funcTag} Erro ao deletar transição:`, error);
      throw error;
    }
  }
}

module.exports = { MessagesTransitionsService };
