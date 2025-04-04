const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const { authenticateToken } = require('../middleware/auth');

router.post('/create', authenticateToken, async (req, res) => {
  const { patient_id, doctor_id, appointment_date, reason } = req.body;
  const userRole = req.user.role;
  const userId = req.user.id;

  let finalPatientId = patient_id;
  let finalDoctorId = doctor_id;

  if (userRole === 'patient') {
    finalPatientId = userId; // Si patient, utilise son propre ID
  } else if (userRole === 'assistant') {
    finalDoctorId = userId; // Si assistant, utilise son propre ID comme médecin
  }

  if (!finalPatientId || !finalDoctorId) {
    return res.status(400).json({ message: 'patient_id et doctor_id sont requis' });
  }

  try {
    const newAppointment = await Appointment.create(finalPatientId, finalDoctorId, appointment_date, reason);
    res.status(201).json({
      message: 'Rendez-vous créé avec succès',
      appointment: newAppointment,
    });
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role || 'patient'; // Par défaut à 'patient' si rôle absent

  try {
    const appointments = await Appointment.findByUserId(userId, role);
    res.status(200).json({
      message: 'Rendez-vous récupérés avec succès',
      appointments,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération' });
  }
});

module.exports = router;