const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const existingDoctor = await Doctor.findByEmail(email);
    if (existingDoctor) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const newDoctor = await Doctor.create(first_name, last_name, email, password);
    res.status(201).json({
      message: 'Médecin enregistré avec succès',
      doctor: newDoctor,
    });
  } catch (error) {
    console.error('Erreur lors de l’inscription :', error);
    res.status(500).json({ message: 'Erreur serveur lors de l’inscription' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findByEmail(email);
    if (!doctor) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: doctor.id, email: doctor.email, role: 'doctor' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      doctor: { id: doctor.id, first_name: doctor.first_name, last_name: doctor.last_name, email: doctor.email },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
});

module.exports = router;