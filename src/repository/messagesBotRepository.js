const { Database } = require('./database');

class MessagesBotRepository {
  constructor() {}

  async insert(messageReq) {
    const funcTag = '[MessagesBotRepository.insert]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Inserindo mensagem no DB`);
      
      const query = `
      INSERT INTO messages_bot (logical_key, message, node_type, initial_node) 
      VALUES ($1, $2, $3, $4)
      RETURNING id;`;
      const values = [messageReq.logical_key, messageReq.message, messageReq.node_type, messageReq.initial_node];
      const res = await db.query(query, values);
      console.log(`${funcTag} Mensagem inserida com sucesso`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao inserir mensagem:`, err);
      throw err;
    }
  }

  async getAll() {
    const funcTag = '[MessagesBotRepository.getAll]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Recuperando mensagens no DB`);
      const query = `
        SELECT
          mb.*,
          ma.action_type,
          ma.action_parameters,
          ma.execution_order
        FROM messages_bot mb
        LEFT JOIN messages_actions ma ON mb.id = ma.bot_message_id
        ORDER by mb.created_at;`;
      const res = await db.query(query);
      console.log(`${funcTag} Mensagens recuperadas`);
      return res.rows;
    } catch (err) {
      console.error(`${funcTag} Erro ao recuperar mensagens:`, err);
      throw err;
    }
  }

  async updateMessage(messageReq) {
    const funcTag = '[MessagesBotRepository.update]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Atualizando mensagem com ID: ${messageReq.id}`);
      let query = `
      UPDATE messages_bot SET message = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE logical_key = $2 RETURNING id, updated_at`;
      const values = [messageReq.message, messageReq.logical_key];
      if (messageReq.action) { values.push(messageReq.action); }
      const res = await db.query(query, values);
      console.log(`${funcTag} Mensagem atualizada`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao atualizar mensagem:`, err);
      throw err;
    }
  }

  async delete(logical_key) {
    const funcTag = '[MessagesBotRepository.delete]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Deletando mensagem com logical_key: ${logical_key}`);
      const query = 'DELETE FROM messages_bot WHERE logical_key = $1 RETURNING logical_key';
      const res = await db.query(query, [logical_key]);
      console.log(`${funcTag} Mensagem deletada`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao deletar mensagem:`, err);
      throw err;
    }
  }
}

module.exports = { MessagesBotRepository };
