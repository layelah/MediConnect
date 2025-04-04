const pool = require('../config/database');
const bcrypt = require('bcrypt');

const Doctor = {
  async create(firstName, lastName, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO doctors (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, first_name, last_name, email
    `;
    const values = [firstName, lastName, email, hashedPassword];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création du médecin : ${error.message}`);
    }
  },

  async findByEmail(email) {
    const query = `
      SELECT id, first_name, last_name, email, password
      FROM doctors
      WHERE email = $1
    `;
    const values = [email];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erreur lors de la recherche du médecin : ${error.message}`);
    }
  },
};

module.exports = Doctor;