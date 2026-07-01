// Importing the Pool class from the pg library
const { Pool } = require('pg');

// Creating a new connection pool using credentials from .env
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Exporting the pool so any route file can import and use it
module.exports = pool;