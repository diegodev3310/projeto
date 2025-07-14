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
      validadeMsg(messageReq)
      console.log(`${funcTag} Enviando dados para o repositorio`);
      const result = await this.messagesBotRepository.insert(messageReq);
      console.log(`${funcTag} Mensagem criada no repositorio`);
      const apiResponse = new ApiResponse(201, 'Mensagem criada com sucesso', result);
      return apiResponse;
    } catch (error) {
      console.error(`${funcTag} Erro ao criar mensagem:`, error);
      throw error;
    }
  }

  async readAll() {
    const funcTag = "[MessagesBotService.readAll]"
    try {
      console.log(`${funcTag} Recuperando dados do repositorio`);
      const result = await this.messagesBotRepository.getAll();
      console.log(`${funcTag} Mensagens recuperadas no repositorio`);
      const apiResponse = new ApiResponse(201, 'Mensagens recuperadas com sucesso', formatReadAll(result));
      return apiResponse;
    } catch (error) {
      console.error(`${funcTag} Erro ao recuperada mensagem:`, error);
      throw error;
    }
  }

  async update(id, message) {}
  async delete(id) {}
}

function formatReadAll(result){
  // Separa os grupos
  const nullOnes = result.filter(row => row.action === null);
  const notNulls = result.filter(row => row.action === 'mark_unread' || row.action === 'send_boleto');
  const menus = result.filter(row => row.action === 'menu');
  // Reindexa idx para cada grupo
  const nullOnesForm = nullOnes.map((row, i) => ({ message: row.message, action: null, idx: i + 1 }));
  const notNullsForm = notNulls.map((row, i) => ({ message: row.message, action: row.action, idx: nullOnesForm.length + i + 1 }));
  const menusForm = menus.map((row, i) => ({ message: row.message, action: 'menu', idx: i + 1 }));
  return [...nullOnesForm, ...notNullsForm, ...menusForm];
}

function validadeMsg(messageReq){
  const funcTag = '[validadeMsg]';
  console.log(`${funcTag} Verificando dados recebidos`);
  if (!messageReq.message) {
    console.error(`${funcTag} Mensagem requerida:`, messageReq);
    throw new Error('Mensagem requerida');
  }
}

module.exports = { MessagesBotService };