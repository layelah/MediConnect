// src/models/assistant.js
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Modèle pour gérer les opérations sur la table assistants.
 */
const Assistant = {
    /**
     * Crée un nouvel assistant dans la base de données.
     * @param {string} firstName - Prénom de l'assistant
     * @param {string} lastName - Nom de famille de l'assistant
     * @param {string} email - Email de l'assistant
     * @param {string} password - Mot de passe en clair
     * @returns {Promise<object>} - Données de l'assistant créé
     */
    async create(firstName, lastName, email, password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
            INSERT INTO assistants (first_name, last_name, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id, first_name, last_name, email, created_at
        `;
        const values = [firstName, lastName, email, hashedPassword];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erreur lors de la création de l'assistant : ${error.message}`);
        }
    },

    /**
     * Recherche un assistant par email.
     * @param {string} email - Email de l'assistant
     * @returns {Promise<object|null>} - Données de l'assistant ou null si non trouvé
     */
    async findByEmail(email) {
        const query = `
            SELECT id, first_name, last_name, email, password, created_at
            FROM assistants
            WHERE email = $1
        `;
        const values = [email];

        try {
            const result = await pool.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Erreur lors de la recherche par email : ${error.message}`);
        }
    },
};

module.exports = Assistant;