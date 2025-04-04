// src/routes/patient.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Patient = require('../models/patient');
const { validateRegistration } = require('../middleware/validate');
const { authenticateToken } = require('../middleware/auth');

/**
 * Route pour l'auto-inscription d'un patient.
 * Le compte est créé avec is_validated = false.
 */
router.post('/register', validateRegistration, async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        const existingPatient = await Patient.findByEmail(email);
        if (existingPatient) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

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
 * Nécessite un token JWT valide.
 */
router.post('/register-by-assistant', authenticateToken, validateRegistration, async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const assistantId = req.user.id;

    try {
        const existingPatient = await Patient.findByEmail(email);
        if (existingPatient) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        const newPatient = await Patient.create(first_name, last_name, email, password, assistantId, true);

        res.status(201).json({
            message: 'Patient créé avec succès par l’assistant',
            patient: newPatient,
        });
    } catch (error) {
        console.error('Erreur lors de la création par assistant :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la création' });
    }
});

/**
 * Route pour valider un compte patient existant.
 * Nécessite un token JWT valide.
 */
router.patch('/validate/:id', authenticateToken, async (req, res) => {
    const patientId = req.params.id;

    try {
        const validatedPatient = await Patient.validate(patientId);
        res.status(200).json({
            message: 'Compte patient validé avec succès',
            patient: validatedPatient,
        });
    } catch (error) {
        console.error('Erreur lors de la validation :', error);
        if (error.message.includes('Patient non trouvé ou déjà validé')) {
            return res.status(404).json({ message: 'Patient non trouvé ou déjà validé' });
        }
        res.status(500).json({ message: 'Erreur serveur lors de la validation' });
    }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis' });
  }

  try {
    const patient = await Patient.findByEmail(email);
    if (!patient) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: patient.id, email: patient.email, role: 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      patient: { id: patient.id, first_name: patient.first_name, last_name: patient.last_name, email: patient.email },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
});

module.exports = router;