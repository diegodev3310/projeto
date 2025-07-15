const { Database } = require('./database');

class MessagesBotRepository {
  constructor() {}

  async insert(messageReq) {
    const funcTag = '[MessagesBotRepository.insert]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Inserindo mensagem no DB...`);
      const query = 'INSERT INTO messages_bot (message) VALUES ($1) RETURNING id, createdAt';
      const values = [messageReq.message];
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
      console.log(`${funcTag} Recuperando mensagens do DB...`);
      const query = 'SELECT id, message, createdAt FROM messages_bot ORDER BY createdAt DESC';
      const res = await db.query(query);
      console.log(`${funcTag} Mensagens recuperadas`);
      return res.rows;
    } catch (err) {
      console.error(`${funcTag} Erro ao recuperar mensagens:`, err);
      throw err;
    }
  }

  async update(messageReq) {
    const funcTag = '[MessagesBotRepository.update]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Atualizando mensagem com ID: ${messageReq.id}`);
      const query = 'UPDATE messages_bot SET message = $1, updatedAt = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, message, updatedAt';
      const values = [messageReq.message, messageReq.id];
      const res = await db.query(query, values);
      console.log(`${funcTag} Mensagem atualizada`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao atualizar mensagem:`, err);
      throw err;
    }
  }

  async delete(id) {
    const funcTag = '[MessagesBotRepository.delete]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Deletando mensagem com ID: ${id}`);
      const query = 'DELETE FROM messages_bot WHERE id = $1 RETURNING id';
      const res = await db.query(query, [id]);
      console.log(`${funcTag} Mensagem deletada`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao deletar mensagem:`, err);
      throw err;
    }
  }
}

module.exports = { MessagesBotRepository };
