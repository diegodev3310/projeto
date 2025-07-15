const { Database } = require('./database');

class MessagesBotRepository {
  constructor() {}

  async insert(messageReq) {
    const funcTag = '[MessagesBotRepository.insert]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Inserindo mensagem no DB`);
      
      const query = `
      INSERT INTO messages_bot(message, action) 
      VALUES ($1,
        (SELECT id FROM messages_actions WHERE action = $2)
      )RETURNING id, createdAt;`;
      const values = [messageReq.message, messageReq.action];
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
        mb.id,
        mb.message,
        ma.action,
        ROW_NUMBER() OVER (PARTITION BY mb.action ORDER BY mb.createdAt) AS idx
      FROM
        messages_bot mb
      LEFT JOIN
        messages_actions ma ON mb.action = ma.id
      ORDER BY
        ma.action, idx;`;
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
      let query = 'UPDATE messages_bot SET message = $1, updatedAt = CURRENT_TIMESTAMP ';
      messageReq.action ? query += ', action = (SELECT id FROM messages_actions WHERE action = $3)' : '';
      query += 'WHERE id = $2 RETURNING id, updatedAt'
      const values = [messageReq.message, messageReq.id];
      if (messageReq.action) { values.push(messageReq.action); }
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
