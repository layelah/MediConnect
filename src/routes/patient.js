// src/routes/patient.js
const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const { validateRegistration } = require('../middleware/validate');

/**
 * Route pour l'auto-inscription d'un patient.
 * Le compte est créé avec is_validated = false.
 */
router.post('/register', validateRegistration, async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        // Vérifie si l’email existe déjà
        const existingPatient = await Patient.findByEmail(email);
        if (existingPatient) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Crée le patient (non validé par défaut)
        const newPatient = await Patient.create(first_name, last_name, email, password);

        res.status(201).json({
            message: 'Patient enregistré avec succès (en attente de validation)',
            patient: newPatient,
        });
    } catch (error) {
        console.error('Erreur lors de l’auto-inscription :', error);
        res.status(500).json({ message: 'Erreur serveur lors de l’inscription' });
    }
});

/**
 * Route pour la création d’un patient par un assistant.
 * Le compte est créé avec is_validated = true.
 * @todo Ajouter une authentification pour vérifier que l’appelant est un assistant
 */
router.post('/register-by-assistant', validateRegistration, async (req, res) => {
    const { first_name, last_name, email, password, assistant_id } = req.body;

    try {
        // Vérifie si l’email existe déjà
        const existingPatient = await Patient.findByEmail(email);
        if (existingPatient) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Crée le patient (validé par défaut)
        const newPatient = await Patient.create(first_name, last_name, email, password, assistant_id, true);

        res.status(201).json({
            message: 'Patient créé avec succès par l’assistant',
            patient: newPatient,
        });
    } catch (error) {
        console.error('Erreur lors de la création par assistant :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la création' });
    }
});

module.exports = router;