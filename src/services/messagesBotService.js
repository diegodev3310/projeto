const { MessagesBotRepository } = require('../repository/messagesBotRepository');
const { ApiResponse } = require('../models/apiResponse');
const { MessageRequest } = require('../models/messagesBot');

class MessagesBotService {
  constructor() {
    this.messagesBotRepository = new MessagesBotRepository();
  }

  async create(req) {
    const funcTag = "[MessagesBotService.create]";
    try {
      console.log(`${funcTag} Verificando dados recebidos`);
      if (!req.message) {
        console.error(`${funcTag} Mensagem inválida:`, req);
        throw new Error('Mensagem inválida');
      }
      console.log(`${funcTag} Enviando dados para o repositorio`);
      const messageRequest = new MessageRequest(req.message);
      const result = await this.messagesBotRepository.insert(messageRequest.message);
      console.log(`${funcTag} Mensagem criada no repositorio`);
      const apiResponse = new ApiResponse(201, 'Mensagem criada com sucesso', result);
      return apiResponse;
    } catch (error) {
      console.error(`${funcTag} Erro ao criar mensagem:`, error);
      throw error;
    }
  }

  async readAll() {}
  async update(id, message) {}
  async delete(id) {}
}

module.exports = { MessagesBotService };