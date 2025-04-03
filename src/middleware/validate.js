// src/middleware/validate.js
/**
 * Middleware pour valider les données d'inscription.
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @param {import('express').NextFunction} next - Fonction suivante dans la chaîne
 */
const validateRegistration = (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs (prénom, nom, email, mot de passe) sont requis' });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Format d’email invalide' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    next(); // Passe au prochain middleware ou à la route
};

module.exports = { validateRegistration };