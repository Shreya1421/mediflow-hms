const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin   = require('../models/Admin');
const Doctor  = require('../models/Doctor');
const Patient = require('../models/Patient');
require('dotenv').config();

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// ── Admin Login ──────────────────────────────────────────────
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required.' });

    const admin = await Admin.findOne({ where: { email } });
    if (!admin)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const token = generateToken({ id: admin.id, name: admin.name, email: admin.email, role: 'admin' });
    res.json({ success: true, token, user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Doctor Login ─────────────────────────────────────────────
const loginDoctor = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id || !password)
      return res.status(400).json({ success: false, message: 'Doctor ID and password required.' });

    const doctor = await Doctor.findOne({ where: { id: id.toUpperCase() } });
    if (!doctor)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const token = generateToken({ id: doctor.id, name: doctor.name, dept: doctor.dept, role: 'doctor' });
    res.json({ success: true, token, user: { id: doctor.id, name: doctor.name, dept: doctor.dept, role: 'doctor' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Patient Login ────────────────────────────────────────────
const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required.' });

    const patient = await Patient.findOne({ where: { email } });
    if (!patient)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const token = generateToken({ id: patient.id, name: patient.name, role: 'patient' });
    res.json({ success: true, token, user: { id: patient.id, name: patient.name, role: 'patient' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Patient Register ─────────────────────────────────────────
const registerPatient = async (req, res) => {
  try {
    const { name, age, gender, blood, phone, email, password } = req.body;
    if (!name || !email || !password || !phone)
      return res.status(400).json({ success: false, message: 'Name, email, phone and password required.' });

    const exists = await Patient.findOne({ where: { email } });
    if (exists)
      return res.status(400).json({ success: false, message: 'Email already registered.' });

    const count  = await Patient.count();
    const id     = 'PAT' + String(count + 1).padStart(3, '0');
    const hashed = await bcrypt.hash(password, 10);

    const patient = await Patient.create({ id, name, age, gender, blood, phone, email, password: hashed });
    const token   = generateToken({ id: patient.id, name: patient.name, role: 'patient' });

    res.status(201).json({ success: true, token, user: { id: patient.id, name: patient.name, role: 'patient' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { loginAdmin, loginDoctor, loginPatient, registerPatient };
