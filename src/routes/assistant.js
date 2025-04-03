// src/routes/assistant.js
const express = require('express');
const router = express.Router();
const Assistant = require('../models/assistant');
const { validateRegistration } = require('../middleware/validate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Route pour l'inscription d'un assistant médical.
 */
router.post('/register', validateRegistration, async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        const existingAssistant = await Assistant.findByEmail(email);
        if (existingAssistant) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

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

/**
 * Route pour la connexion d’un assistant médical.
 * Retourne un token JWT si les identifiants sont valides.
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont requis' });
    }

    try {
        const assistant = await Assistant.findByEmail(email);
        if (!assistant) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const isMatch = await bcrypt.compare(password, assistant.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { id: assistant.id, email: assistant.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token valide 1 heure
        );

        res.status(200).json({
            message: 'Connexion réussie',
            token,
            assistant: { id: assistant.id, first_name: assistant.first_name, last_name: assistant.last_name, email: assistant.email },
        });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
    }
});

module.exports = router;