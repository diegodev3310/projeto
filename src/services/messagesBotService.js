const { MessagesBotRepository } = require('../repository/messagesBotRepository');
const { ApiResponse } = require('../models/apiResponse');
const { MessageRequest } = require('../models/messagesBot');

class MessagesBotService {
  constructor() {
    this.messagesBotRepository = new MessagesBotRepository();
  }

  async create(messageReq) {
    const funcTag = "[MessagesBotService.create]";
    try {
      validateMsg(messageReq);
      console.log(`${funcTag} Enviando dados para o repositório...`);
      const result = await this.messagesBotRepository.insert(messageReq);
      console.log(`${funcTag} Mensagem criada com sucesso`);
      return new ApiResponse(201, 'Mensagem criada com sucesso', result);
    } catch (error) {
      console.error(`${funcTag} Erro ao criar mensagem:`, error);
      throw error;
    }
  }

  async readAll() {
    const funcTag = "[MessagesBotService.readAll]";
    try {
      console.log(`${funcTag} Recuperando mensagens do repositório...`);
      const result = await this.messagesBotRepository.getAll();
      console.log(`${funcTag} Mensagens recuperadas com sucesso`);
      return new ApiResponse(200, 'Mensagens recuperadas com sucesso', result);
    } catch (error) {
      console.error(`${funcTag} Erro ao recuperar mensagens:`, error);
      throw error;
    }
  }

  async update(id, messageReq) {
    const funcTag = "[MessagesBotService.update]";
    try {
      validateMsg(messageReq);
      console.log(`${funcTag} Atualizando mensagem com ID: ${id}`);
      const result = await this.messagesBotRepository.update(messageReq);
      console.log(`${funcTag} Mensagem atualizada com sucesso`);
      return new ApiResponse(200, 'Mensagem atualizada com sucesso', result);
    } catch (error) {
      console.error(`${funcTag} Erro ao atualizar mensagem:`, error);
      throw error;
    }
  }

  async delete(id) {
    const funcTag = "[MessagesBotService.delete]";
    try {
      console.log(`${funcTag} Deletando mensagem com ID: ${id}`);
      const result = await this.messagesBotRepository.delete(id);
      console.log(`${funcTag} Mensagem deletada com sucesso`);
      return new ApiResponse(200, 'Mensagem deletada com sucesso', result);
    } catch (error) {
      console.error(`${funcTag} Erro ao deletar mensagem:`, error);
      throw error;
    }
  }
}

function validateMsg(messageReq) {
  const funcTag = '[validateMsg]';
  console.log(`${funcTag} Validando mensagem...`);
  if (!messageReq.message) {
    console.error(`${funcTag} Mensagem inválida:`, messageReq);
    throw new Error('Mensagem requerida');
  }
}

module.exports = { MessagesBotService };
