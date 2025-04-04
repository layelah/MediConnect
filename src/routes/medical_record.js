const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/medical_record');
const { authenticateToken } = require('../middleware/auth');

router.post('/create', authenticateToken, async (req, res) => {
  const { patient_id, record_type, details } = req.body;
  const doctorId = req.user.role === 'doctor' ? req.user.id : null;

  if (!doctorId) {
    return res.status(403).json({ message: 'Seul un médecin peut créer un dossier médical' });
  }

  try {
    const newRecord = await MedicalRecord.create(patient_id, doctorId, record_type, details);
    res.status(201).json({
      message: 'Dossier médical créé avec succès',
      record: newRecord,
    });
  } catch (error) {
    console.error('Erreur lors de la création du dossier :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création' });
  }
});

router.get('/:patientId', authenticateToken, async (req, res) => {
  const patientId = req.params.patientId;
  const userId = req.user.id;
  const userRole = req.user.role || 'patient';

  try {
    const records = await MedicalRecord.findByPatientId(patientId, userId, userRole);
    res.status(200).json({
      message: 'Dossiers récupérés avec succès',
      records,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des dossiers :', error);
    res.status(403).json({ message: error.message });
  }
});

module.exports = router;