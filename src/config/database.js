// src/config/database.js
const { Pool } = require('pg');
require('dotenv').config();

/**
 * Configuration de la connexion à la base de données PostgreSQL.
 * Utilise un pool de connexions pour optimiser les performances et gérer les requêtes.
 */
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
    console.log('Connexion à la base de données PostgreSQL établie avec succès');
});

pool.on('error', (err) => {
    console.error('Erreur inattendue dans le pool de connexions :', err);
    process.exit(-1);
});

module.exports = pool;