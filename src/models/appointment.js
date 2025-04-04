const pool = require('../config/database');

const Appointment = {
  async create(patientId, doctorId, appointmentDate, reason) {
    const query = `
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason)
      VALUES ($1, $2, $3, $4)
      RETURNING id, patient_id, doctor_id, appointment_date, reason, status, created_at
    `;
    const values = [patientId, doctorId, appointmentDate, reason];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création du rendez-vous : ${error.message}`);
    }
  },

  async findByUserId(userId, role) {
    let query;
    if (role === 'patient') {
      query = `
        SELECT id, patient_id, doctor_id, appointment_date, reason, status, created_at
        FROM appointments
        WHERE patient_id = $1
      `;
    } else if (role === 'doctor' || role === 'assistant') { // Ajout du support pour 'assistant'
      query = `
        SELECT id, patient_id, doctor_id, appointment_date, reason, status, created_at
        FROM appointments
        WHERE doctor_id = $1
      `;
    } else {
      throw new Error('Rôle invalide pour récupérer les rendez-vous');
    }

    const values = [userId];

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des rendez-vous : ${error.message}`);
    }
  },
};

module.exports = Appointment;