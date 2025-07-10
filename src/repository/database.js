const dotenv = require('dotenv');
const pg = require('pg');
const path = require('path');

dotenv.config(path.resolve(__dirname, '../../.env'));

export default class Database {
    static #pool = null;
    static async #init() {
        const poolConfig = { max: process.env.PGMAX || 3 };
        const pool = new pg.Pool(poolConfig);
        const res = await pool.query("SELECT VERSION()");
        console.table(res.rows);
        return pool;
    }

    static async connect() {
        if (this.#pool == null) {
            this.#pool = await this.#init();
        }
        return this.#pool;
    }
}