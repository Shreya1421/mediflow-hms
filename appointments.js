const express = require('express');
const router  = express.Router();
const {
  getAllAppointments, getByDoctor, getByPatient,
  getAppointmentById, createAppointment, updateAppointment,
  deleteAppointment, getWeeklyReport
} = require('../controllers/appointmentController');
const { protect, adminOnly, adminOrDoctor } = require('../middleware/auth');

// GET /api/appointments              — admin only
router.get('/',                    protect, adminOnly, getAllAppointments);

// GET /api/appointments/report/weekly — admin only
router.get('/report/weekly',       protect, adminOnly, getWeeklyReport);

// GET /api/appointments/doctor/:doctorId
router.get('/doctor/:doctorId',    protect, adminOrDoctor, getByDoctor);

// GET /api/appointments/patient/:patientId
router.get('/patient/:patientId',  protect, getByPatient);

// GET /api/appointments/:id
router.get('/:id',                 protect, getAppointmentById);

// POST /api/appointments
router.post('/',                   protect, createAppointment);

// PUT /api/appointments/:id
router.put('/:id',                 protect, updateAppointment);

// DELETE /api/appointments/:id       — admin only
router.delete('/:id',              protect, adminOnly, deleteAppointment);

module.exports = router;
