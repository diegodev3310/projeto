const dotenv = require('dotenv');
const pg = require('pg');
const path = require('path');

dotenv.config(path.resolve(__dirname, '../../.env'));

class Database {
    static #pool = null;
    static async #init() {
        const poolConfig = { max: process.env.PG_MAX || 3 };
        const pool = new pg.Pool(poolConfig);
        const res = await pool.query("SELECT VERSION()");
        console.table(res.rows);
        return pool;
    }

    static async connect() {
        const funcTag = '[Database.connect]';
        console.log(`${funcTag} Conectando ao banco de dados...`);
        if (this.#pool == null) {
            this.#pool = await this.#init();
        }
        console.log(`${funcTag} Conexão estabelecida com sucesso!`);
        return this.#pool;
    }
}

module.exports = { Database };