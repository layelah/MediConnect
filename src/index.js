// src/index.js
const express = require('express');
const patientRoutes = require('./routes/patient');
const assistantRoutes = require('./routes/assistant');

require('dotenv').config();

/**
 * Initialisation de l'application Express.
 * @type {import('express').Application}
 */
const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Routes de l'API
app.use('/api/patients', patientRoutes);
app.use('/api/assistants', assistantRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});