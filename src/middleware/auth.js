// src/middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * Middleware pour vérifier l’authentification via JWT.
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @param {import('express').NextFunction} next - Fonction suivante
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format : "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé : token manquant' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Ajoute les données de l’utilisateur (ex. assistant_id) à la requête
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token invalide ou expiré' });
    }
};

module.exports = { authenticateToken };