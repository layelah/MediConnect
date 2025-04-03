// src/routes/assistant.js
const express = require('express');
const router = express.Router();
const Assistant = require('../models/assistant');
const { validateRegistration } = require('../middleware/validate');

/**
 * Route pour l'inscription d'un assistant médical.
 */
router.post('/register', validateRegistration, async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        // Vérifie si l’email existe déjà
        const existingAssistant = await Assistant.findByEmail(email);
        if (existingAssistant) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Crée l’assistant
        const newAssistant = await Assistant.create(first_name, last_name, email, password);

        res.status(201).json({
            message: 'Assistant enregistré avec succès',
            assistant: newAssistant,
        });
    } catch (error) {
        console.error('Erreur lors de l’inscription de l’assistant :', error);
        res.status(500).json({ message: 'Erreur serveur lors de l’inscription' });
    }
});

module.exports = router;