const express = require('express');
const router = express.Router();
const Prescription = require('../models/prescription');
const { authenticateToken } = require('../middleware/auth');

router.post('/create', authenticateToken, async (req, res) => {
  const { patient_id, medication, dosage, instructions } = req.body;
  const doctorId = req.user.role === 'doctor' ? req.user.id : null;

  if (!doctorId) {
    return res.status(403).json({ message: 'Seul un médecin peut créer une prescription' });
  }

  if (!patient_id) {
    return res.status(400).json({ message: 'patient_id est requis' });
  }

  try {
    const newPrescription = await Prescription.create(patient_id, doctorId, medication, dosage, instructions);
    res.status(201).json({
      message: 'Prescription créée avec succès',
      prescription: newPrescription,
    });
  } catch (error) {
    console.error('Erreur lors de la création de la prescription :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role || 'patient';

  try {
    const prescriptions = await Prescription.findByUserId(userId, role);
    res.status(200).json({
      message: 'Prescriptions récupérées avec succès',
      prescriptions,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des prescriptions :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération' });
  }
});

module.exports = router;