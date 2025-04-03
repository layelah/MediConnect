const pool = require('../config/database');

const MedicalRecord = {
  async create(patientId, doctorId, recordType, details) {
    const query = `
      INSERT INTO medical_records (patient_id, doctor_id, record_type, details)
      VALUES ($1, $2, $3, $4)
      RETURNING id, patient_id, doctor_id, record_type, details, created_at
    `;
    const values = [patientId, doctorId, recordType, details];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création du dossier : ${error.message}`);
    }
  },

  async findByPatientId(patientId, userId, userRole) {
    let query;
    if (userRole === 'patient') {
      query = `
        SELECT id, patient_id, doctor_id, record_type, details, created_at, updated_at
        FROM medical_records
        WHERE patient_id = $1 AND patient_id = $2
      `;
    } else if (userRole === 'doctor') {
      query = `
        SELECT id, patient_id, doctor_id, record_type, details, created_at, updated_at
        FROM medical_records
        WHERE patient_id = $1 AND doctor_id = $2
      `;
    } else {
      throw new Error('Rôle utilisateur non autorisé');
    }

    const values = [patientId, userId];

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des dossiers : ${error.message}`);
    }
  },
};

module.exports = MedicalRecord;