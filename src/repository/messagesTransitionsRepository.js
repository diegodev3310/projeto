const { Database } = require('./database');

class MessagesTransitionsRepository {
  constructor() {}

  async insert(actionReq) {
    const funcTag = '[MessagesTransitionsRepository.insert]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Inserindo transição no DB`);
      const query = `
      INSERT INTO messages_transitions (
        source_message_id, 
        target_message_id, 
        trigger_pattern
      ) VALUES (
          (SELECT id FROM messages_bot WHERE logical_key = $1),
          (SELECT id FROM messages_bot WHERE logical_key = $2),
          $3
      );`;
      const values = [actionReq.source_message_key, actionReq.target_message_key, actionReq.trigger_pattern];
      const res = await db.query(query, values);
      console.log(`${funcTag} Transição inserida com sucesso`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao inserir transição:`, err);
      throw err;
    }
  }

  async getAll() {
    const funcTag = '[MessagesTransitionsRepository.getAll]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Recuperando transitions no DB`);
      const query = 'SELECT * FROM messages_transitions;';
      const res = await db.query(query);
      console.log(`${funcTag} Transitions recuperadas`);
      return res.rows;
    } catch (err) {
      console.error(`${funcTag} Erro ao recuperar transitions:`, err);
      throw err;
    }
  }

  async update(actionReq) {
    const funcTag = '[MessagesTransitionsRepository.update]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Atualizando transição com ID: ${actionReq.id}`);
      const query = `
      UPDATE messages_transitions 
      SET source_message_id = (SELECT id FROM messages_bot WHERE logical_key = $1),
          target_message_id = (SELECT id FROM messages_bot WHERE logical_key = $2),
          trigger_pattern = $3,
          updatedAt = CURRENT_TIMESTAMP 
      WHERE id = $4 RETURNING id, updatedAt;`;
      const values = [actionReq.source_message_key, actionReq.target_message_key, actionReq.trigger_pattern, actionReq.id];
      const res = await db.query(query, values);
      console.log(`${funcTag} Transição atualizada`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao atualizar transição:`, err);
      throw err;
    }
  }

  async delete(id) {
    const funcTag = '[MessagesTransitionsRepository.delete]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Deletando transição com ID: ${id}`);
      const query = 'DELETE FROM messages_transitions WHERE id = $1 RETURNING id;';
      const res = await db.query(query, [id]);
      console.log(`${funcTag} Transição deletada`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao deletar transição:`, err);
      throw err;
    }
  }
}

module.exports = { MessagesTransitionsRepository };
