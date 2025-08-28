const { Database } = require('./database');

class UsersRepository {
  constructor() {}

  async insert(userReq) {
    const funcTag = '[UsersRepository.insert]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Inserindo usuário no DB`);
      const query = 'INSERT INTO users(username, password_hash) VALUES ($1, $2) RETURNING id, created_at';
      const values = [userReq.username, userReq.password];
      const res = await db.query(query, values);
      console.log(`${funcTag} Usuário inserido com sucesso`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao inserir usuário:`, err);
      throw err;
    }
  }

  async login(name) {
    const funcTag = '[UsersRepository.login]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Recuperando usuário com nome: ${name}`);
      const query = 'SELECT id, username, password_hash, created_at, updated_at FROM users WHERE username = $1';
      const res = await db.query(query, [name]);
      if (res.rows.length === 0) {
        throw new Error('Usuário não encontrado');
      }
      console.log(`${funcTag} Usuário recuperado com sucesso`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao recuperar usuário:`, err);
      throw err;
    }
  }

  async getAll() {
    const funcTag = '[UsersRepository.getAll]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Recuperando usuários no DB`);
      const query = 'SELECT id, username, created_at, updated_at FROM users ORDER BY created_at';
      const res = await db.query(query);
      console.log(`${funcTag} Usuários recuperados`);
      return res.rows;
    } catch (err) {
      console.error(`${funcTag} Erro ao recuperar usuários:`, err);
      throw err;
    }
  }

  async update(userReq) {
    const funcTag = '[UsersRepository.update]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Atualizando usuário com ID: ${userReq.id}`);
      const fields = [];
      const values = [];
      let idx = 1;

      if (userReq.email) {
        fields.push(`email = $${idx++}`);
        values.push(userReq.email);
      }
      if (userReq.password) {
        fields.push(`password = $${idx++}`);
        values.push(userReq.password);
      }
      if (fields.length === 0) throw new Error('Nenhum campo para atualizar');
      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, updated_at`;
      values.push(userReq.id);
      const res = await db.query(query, values);
      console.log(`${funcTag} Usuário atualizado`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao atualizar usuário:`, err);
      throw err;
    }
  }

  async delete(id) {
    const funcTag = '[UsersRepository.delete]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Deletando usuário com ID: ${id}`);
      const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
      const res = await db.query(query, [id]);
      console.log(`${funcTag} Usuário deletado`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao deletar usuário:`, err);
      throw err;
    }
  }
}

module.exports = { UsersRepository };