// src/models/patient.js
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Modèle pour gérer les opérations sur la table patients.
 */
const Patient = {
    /**
     * Crée un nouveau patient dans la base de données.
     * @param {string} firstName - Prénom du patient
     * @param {string} lastName - Nom de famille du patient
     * @param {string} email - Email du patient
     * @param {string} password - Mot de passe en clair
     * @param {number|null} createdByAssistantId - ID de l'assistant qui crée le compte (null si auto-inscription)
     * @param {boolean} isValidated - Statut de validation (true si créé par assistant, false sinon)
     * @returns {Promise<object>} - Données du patient créé
     */
    async create(firstName, lastName, email, password, createdByAssistantId = null, isValidated = false) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
            INSERT INTO patients (first_name, last_name, email, password, created_by_assistant_id, is_validated)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, first_name, last_name, email, is_validated, created_by_assistant_id, created_at
        `;
        const values = [firstName, lastName, email, hashedPassword, createdByAssistantId, isValidated];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erreur lors de la création du patient : ${error.message}`);
        }
    },

    /**
     * Recherche un patient par email.
     * @param {string} email - Email du patient
     * @returns {Promise<object|null>} - Données du patient ou null si non trouvé
     */
    async findByEmail(email) {
        const query = `
            SELECT id, first_name, last_name, email, password, is_validated, created_by_assistant_id, created_at
            FROM patients
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

module.exports = Patient;