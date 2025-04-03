// src/models/patient.js
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Modèle pour gérer les opérations sur la table patients.
 */
const Patient = {
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

    /**
     * Valide un patient existant en mettant is_validated à true.
     * @param {number} id - ID du patient à valider
     * @returns {Promise<object>} - Données du patient validé
     */
    async validate(id) {
        const query = `
            UPDATE patients
            SET is_validated = TRUE, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND is_validated = FALSE
            RETURNING id, first_name, last_name, email, is_validated, created_by_assistant_id, created_at, updated_at
        `;
        const values = [id];

        try {
            const result = await pool.query(query, values);
            if (result.rowCount === 0) {
                throw new Error('Patient non trouvé ou déjà validé');
            }
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erreur lors de la validation du patient : ${error.message}`);
        }
    },
};

module.exports = Patient;