// src/config/database.js
const { Pool } = require('pg');
require('dotenv').config();

/**
 * Configuration de la connexion à la base de données PostgreSQL.
 * Utilise un pool de connexions pour optimiser les performances et gérer les requêtes.
 */
const pool = new Pool({
    host: process.env.DB_HOST,       // Adresse du serveur PostgreSQL
    user: process.env.DB_USER,       // Nom d'utilisateur PostgreSQL
    password: process.env.DB_PASSWORD, // Mot de passe PostgreSQL
    database: process.env.DB_NAME,   // Nom de la base de données
    port: process.env.DB_PORT,       // Port par défaut de PostgreSQL
    max: 20,                         // Nombre maximum de connexions dans le pool
    idleTimeoutMillis: 30000,        // Temps avant fermeture d'une connexion inactive (30s)
    connectionTimeoutMillis: 2000,   // Temps maximum pour établir une connexion (2s)
});

/**
 * Teste la connexion à la base de données au démarrage.
 * Affiche un message d'erreur si la connexion échoue.
 */
pool.on('connect', () => {
    console.log('Connexion à la base de données PostgreSQL établie avec succès');
});

pool.on('error', (err) => {
    console.error('Erreur inattendue dans le pool de connexions :', err);
    process.exit(-1); // Arrête le serveur en cas d'erreur critique
});

module.exports = pool;