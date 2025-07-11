const { Database } = require('./database');

class MessagesBotRepository {
  constructor() {}
  
  async insert(message) {
    const funcTag = '[MessagesBotRepository.insert]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Inserindo mensagem no DB`);
      const query = 'INSERT INTO messages_bot (message) VALUES ($1) RETURNING id, createdAt';
      const values = [message];
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
      const query = 'select message, ROW_NUMBER() OVER (ORDER BY createdAt) as index from messages_bot;';
      const res = await db.query(query);
      console.log(`${funcTag} Mensagens recuperadas no DB`);
      return res.rows;
    } catch (err) {
      console.error(`${funcTag} Erro ao recuperar mensagem:`, err);
      throw err;
    }
  };
}

module.exports = { MessagesBotRepository };