const { Database } = require('./database');

class MessagesActionsRepository {
  constructor() {}

  async insert(actionReq) {
    const funcTag = '[MessagesActionsRepository.insert]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Inserindo ação no DB`);
      const query = 'INSERT INTO messages_actions(action) VALUES ($1) RETURNING id, createdAt';
      const values = [actionReq.action];
      const res = await db.query(query, values);
      console.log(`${funcTag} Ação inserida com sucesso`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao inserir ação:`, err);
      throw err;
    }
  }

  async getAll() {
    const funcTag = '[MessagesActionsRepository.getAll]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Recuperando ações no DB`);
      const query = 'SELECT id, action, createdAt FROM messages_actions ORDER BY createdAt';
      const res = await db.query(query);
      console.log(`${funcTag} Ações recuperadas`);
      return res.rows;
    } catch (err) {
      console.error(`${funcTag} Erro ao recuperar ações:`, err);
      throw err;
    }
  }

  async update(actionReq) {
    const funcTag = '[MessagesActionsRepository.update]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Atualizando ação com ID: ${actionReq.id}`);
      const query = 'UPDATE messages_actions SET action = $1, updatedAt = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, updatedAt';
      const values = [actionReq.action, actionReq.id];
      const res = await db.query(query, values);
      console.log(`${funcTag} Ação atualizada`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao atualizar ação:`, err);
      throw err;
    }
  }

  async delete(id) {
    const funcTag = '[MessagesActionsRepository.delete]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Deletando ação com ID: ${id}`);
      const query = 'DELETE FROM messages_actions WHERE id = $1 RETURNING id';
      const res = await db.query(query, [id]);
      console.log(`${funcTag} Ação deletada`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao deletar ação:`, err);
      throw err;
    }
  }
}

module.exports = { MessagesActionsRepository };
