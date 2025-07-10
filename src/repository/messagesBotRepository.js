const { Database } = require('./database');

class MessagesBotRepository {
  constructor() {}
  
  async insert(message) {
    const funcTag = '[insert]';
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
}

module.exports = { MessagesBotRepository };