// src/index.js
const express = require('express');
const patientRoutes = require('./routes/patient');
const assistantRoutes = require('./routes/assistant');
const doctorRoutes = require('./routes/doctor');
const medicalRecordRoutes = require('./routes/medical_record');
const appointmentRoutes = require('./routes/appointment');
const prescriptionRoutes = require('./routes/prescription');
const cors = require('cors'); // Ajoute cette ligne

require('dotenv').config();

/**
 * Initialisation de l'application Express.
 * @type {import('express').Application}
 */
const app = express();

// Middleware pour activer CORS
app.use(cors({
  origin: 'http://localhost:5173', // Autorise uniquement le frontend sur ce port
  methods: ['GET', 'POST', 'PATCH'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
}));

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Routes de l'API
app.use('/api/patients', patientRoutes);
app.use('/api/assistants', assistantRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});