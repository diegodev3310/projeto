const { Database } = require('./database');

class ProductsRepository {
  constructor() {}

  async insert(prodReq) {
    const funcTag = '[ProductsRepository.insert]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Inserindo produto no DB`);
      const query = `
        INSERT INTO product_prices (product_code, quantity_code, price, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id, created_at, updated_at;`;
      const values = [prodReq.product_code, prodReq.quantity_code, prodReq.price, prodReq.description];
      const res = await db.query(query, values);
      console.log(`${funcTag} Produto inserido com sucesso`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao inserir produto:`, err);
      throw err;
    }
  }

  async getProd(prodReq) {
    const funcTag = '[ProductsRepository.getProd]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Recuperando produtos no DB`);
      const query = `
        SELECT price, description, size
        FROM product_prices
        WHERE product_code = $1 AND quantity_code = $2;`;
      const res = await db.query(query, [prodReq.product_code, prodReq.quantity_code]);
      console.log(`${funcTag} Produtos recuperados no DB`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao recuperar produtos:`, err);
      throw err;
    }
  }

  async update(prodReq) {
    const funcTag = '[ProductsRepository.update]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Atualizando produto com ID: ${prodReq.id}`);
      const query = `
        UPDATE product_prices
        SET product_code = $1, quantity_code = $2, price = $3, description = $4, updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING id, updated_at;`;
      const values = [prodReq.product_code, prodReq.quantity_code, prodReq.price, prodReq.description, prodReq.id];
      const res = await db.query(query, values);
      console.log(`${funcTag} Produto atualizado`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao atualizar produto:`, err);
      throw err;
    }
  }

  async delete(id) {
    const funcTag = '[ProductsRepository.delete]';
    try {
      const db = await Database.connect();
      console.log(`${funcTag} Deletando produto com ID: ${id}`);
      const query = 'DELETE FROM product_prices WHERE id = $1 RETURNING id;';
      const res = await db.query(query, [id]);
      console.log(`${funcTag} Produto deletado`);
      return res.rows[0];
    } catch (err) {
      console.error(`${funcTag} Erro ao deletar produto:`, err);
      throw err;
    }
  }
}

module.exports = { ProductsRepository };
