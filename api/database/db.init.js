const pool = require("./db.connection");

async function createTables() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS emails (
            id SERIAL PRIMARY KEY,
            sender TEXT,
            sender_name TEXT,
            recipient TEXT,
            subject TEXT,
            text TEXT,
            html TEXT,
            sent_at TEXT,
            received_at TEXT NOT NULL,
            raw_email TEXT NOT NULL
        );
    `);
}

module.exports = {
  createTables,
};
