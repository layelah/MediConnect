const pool = require('../config/database');

const Prescription = {
  async create(patientId, doctorId, medication, dosage, instructions) {
    const query = `
      INSERT INTO prescriptions (patient_id, doctor_id, medication, dosage, instructions)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, patient_id, doctor_id, medication, dosage, instructions, created_at
    `;
    const values = [patientId, doctorId, medication, dosage, instructions];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création de la prescription : ${error.message}`);
    }
  },

  async findByUserId(userId, role) {
    let query;
    if (role === 'patient') {
      query = `
        SELECT id, patient_id, doctor_id, medication, dosage, instructions, created_at
        FROM prescriptions
        WHERE patient_id = $1
      `;
    } else if (role === 'doctor') {
      query = `
        SELECT id, patient_id, doctor_id, medication, dosage, instructions, created_at
        FROM prescriptions
        WHERE doctor_id = $1
      `;
    } else {
      throw new Error('Rôle invalide pour récupérer les prescriptions');
    }

    const values = [userId];

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des prescriptions : ${error.message}`);
    }
  },
};

module.exports = Prescription;