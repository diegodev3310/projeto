const { MessagesBotRepository } = require('../repository/messagesBotRepository');
const { ApiResponse } = require('../models/apiResponse');
const { MessageRequest } = require('../models/messagesBot');

class MessagesBotService {
  constructor() {
    this.messagesBotRepository = new MessagesBotRepository();
  }

  async create(messageReq) {
    const funcTag = "[MessagesBotService.create]";
    if (!req.message) {
      throw new Error("Mensagem inválida");
    }
    const messageRequest = new MessageRequest(req.message);
    const result = await this.messagesBotRepository.insert(messageRequest.message);
    return new ApiResponse(201, 'Mensagem criada com sucesso', result);
  }

  async readAll() {
    const result = await this.messagesBotRepository.findAll();
    return new ApiResponse(200, 'Mensagens encontradas', result);
  }

  async update(id, body) {
    const funcTag = "[MessagesBotService.update]";
    if (!body.message) {
      throw new Error("Mensagem inválida para atualização");
    }

    const result = await this.messagesBotRepository.update(id, body.message);
    if (!result) {
      throw new Error("Mensagem não encontrada para atualização");
    }

    return new ApiResponse(200, 'Mensagem atualizada com sucesso', result);
  }

  async delete(id) {
    const funcTag = "[MessagesBotService.delete]";
    const result = await this.messagesBotRepository.deleteById(id);
    if (!result) {
      throw new Error("Mensagem não encontrada para exclusão");
    }
    return new ApiResponse(200, 'Mensagem deletada com sucesso', result);
  }
}

module.exports = { MessagesBotService };
