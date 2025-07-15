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
      console.log(`${funcTag} Mensagens recuperadas no repositorio`);
      const apiResponse = new ApiResponse(201, 'Mensagens recuperadas com sucesso', formatReadAll(result));
      return apiResponse;
    } catch (error) {
      console.error(`${funcTag} Erro ao recuperar mensagens:`, error);
      throw error;
    }
  }

  async update(messageReq) {
    const funcTag = "[MessagesBotService.update]";
    try {
      validateMsg(messageReq);
      console.log(`${funcTag} Atualizando mensagem com ID: ${messageReq.id}`);
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

function formatReadAll(result){
  // Separa os grupos
  const nullOnes = result.filter(row => row.action === null);
  const notNulls = result.filter(row => row.action === 'mark_unread' || row.action === 'send_boleto');
  const menus = result.filter(row => row.action === 'menu');
  // Reindexa idx para cada grupo
  const nullOnesForm = nullOnes.map((row, i) => ({ id: row.id, message: row.message, action: null, idx: i + 1 }));
  const notNullsForm = notNulls.map((row, i) => ({ id: row.id, message: row.message, action: row.action, idx: nullOnesForm.length + i + 1 }));
  const menusForm = menus.map((row, i) => ({ id: row.id, message: row.message, action: 'menu', idx: i + 1 }));
  return [...nullOnesForm, ...notNullsForm, ...menusForm];
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
