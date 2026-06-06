const express = require('express');
const router  = express.Router();
const { getAllDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { protect, adminOnly, adminOrDoctor } = require('../middleware/auth');

// GET  /api/doctors           — admin or doctor
router.get('/',     protect, adminOrDoctor, getAllDoctors);

// GET  /api/doctors/:id       — admin or doctor
router.get('/:id',  protect, adminOrDoctor, getDoctorById);

// POST /api/doctors           — admin only
router.post('/',    protect, adminOnly, createDoctor);

// PUT  /api/doctors/:id       — admin only
router.put('/:id',  protect, adminOnly, updateDoctor);

// DELETE /api/doctors/:id     — admin only
router.delete('/:id', protect, adminOnly, deleteDoctor);

module.exports = router;
