const bcrypt  = require('bcryptjs');
const Patient = require('../models/Patient');
const Doctor  = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// GET all patients (admin only)
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({ attributes: { exclude: ['password'] } });
    res.json({ success: true, data: patients });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET single patient
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({ where: { id: req.params.id }, attributes: { exclude: ['password'] } });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });
    const appointments = await Appointment.findAll({ where: { patientId: req.params.id } });
    const doctor = patient.doctorId ? await Doctor.findOne({ where: { id: patient.doctorId }, attributes: { exclude: ['password'] } }) : null;
    res.json({ success: true, data: { patient, appointments, doctor } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST create patient (admin)
const createPatient = async (req, res) => {
  try {
    const { name, age, gender, blood, phone, email, password, dept, doctorId, address, notes } = req.body;
    if (!name || !email || !password || !phone)
      return res.status(400).json({ success: false, message: 'Name, email, phone, password required.' });

    const exists = await Patient.findOne({ where: { email } });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered.' });

    const count  = await Patient.count();
    const id     = 'PAT' + String(count + 1).padStart(3, '0');
    const hashed = await bcrypt.hash(password, 10);

    const patient = await Patient.create({ id, name, age, gender, blood, phone, email, password: hashed, dept, doctorId, address, notes });
    const { password: _, ...data } = patient.toJSON();
    res.status(201).json({ success: true, message: `Patient added. ID: ${id}`, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT update patient
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ where: { id: req.params.id } });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });

    const fields = ['name','age','gender','blood','phone','address','dept','doctorId','notes'];
    fields.forEach(f => { if (req.body[f] !== undefined) patient[f] = req.body[f]; });
    if (req.body.password) patient.password = await bcrypt.hash(req.body.password, 10);
    await patient.save();
    res.json({ success: true, message: 'Patient updated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE patient (admin only)
const deletePatient = async (req, res) => {
  try {
    const deleted = await Patient.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Patient not found.' });
    res.json({ success: true, message: 'Patient deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient };
