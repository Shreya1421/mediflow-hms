const express = require('express');
const router  = express.Router();
const { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const { protect, adminOnly, adminOrDoctor } = require('../middleware/auth');

// GET  /api/patients          — admin only
router.get('/',     protect, adminOnly, getAllPatients);

// GET  /api/patients/:id      — admin or doctor
router.get('/:id',  protect, adminOrDoctor, getPatientById);

// POST /api/patients          — admin only
router.post('/',    protect, adminOnly, createPatient);

// PUT  /api/patients/:id      — admin only
router.put('/:id',  protect, updatePatient);

// DELETE /api/patients/:id    — admin only
router.delete('/:id', protect, adminOnly, deletePatient);

module.exports = router;
