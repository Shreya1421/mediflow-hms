const express = require('express');
const router  = express.Router();
const { loginAdmin, loginDoctor, loginPatient, registerPatient } = require('../controllers/authController');

// POST /api/auth/login/admin
router.post('/login/admin', loginAdmin);

// POST /api/auth/login/doctor
router.post('/login/doctor', loginDoctor);

// POST /api/auth/login/patient
router.post('/login/patient', loginPatient);

// POST /api/auth/register/patient
router.post('/register/patient', registerPatient);

module.exports = router;
