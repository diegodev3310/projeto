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
      console.log(`${funcTag} Mensagem inserida no DB`);
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
      console.log(`${funcTag} Mensagens recuperadas no DB`);
      return res.rows;
    } catch (err) {
      console.error(`${funcTag} Erro ao recuperar mensagem:`, err);
      throw err;
    }
  }

  async update(messageReq) {}
  async delete(messageReq) {}
}

module.exports = { MessagesBotRepository };