const { Database } = require('./database');

class MessagesBotRepository {
  async insert(message) {
    const pool = await Database.connect();
    const query = 'INSERT INTO messages_bot (message) VALUES ($1) RETURNING *';
    const values = [message];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findAll() {
    const pool = await Database.connect();
    const result = await pool.query('SELECT * FROM messages_bot ORDER BY createdAt DESC');
    return result.rows;
  }

  async update(id, message) {
    const pool = await Database.connect();
    const query = `
      UPDATE messages_bot
      SET message = $1, updatedAt = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const values = [message, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async deleteById(id) {
    const pool = await Database.connect();
    const query = 'DELETE FROM messages_bot WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0]; // retorna null se não encontrar
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
  }

  async update(messageReq) {}
  async delete(messageReq) {}
}

module.exports = { MessagesBotRepository };
