const bcrypt  = require('bcryptjs');
const Doctor  = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// GET all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({ attributes: { exclude: ['password'] } });
    res.json({ success: true, data: doctors });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET single doctor
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ where: { id: req.params.id }, attributes: { exclude: ['password'] } });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' });
    const patients     = await Patient.findAll({ where: { doctorId: req.params.id }, attributes: { exclude: ['password'] } });
    const appointments = await Appointment.findAll({ where: { doctorId: req.params.id } });
    res.json({ success: true, data: { doctor, patients, appointments } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST create doctor (admin only)
const createDoctor = async (req, res) => {
  try {
    const { name, role, dept, phone, email, password, qual, exp, avail } = req.body;
    if (!name || !dept || !phone || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, dept, phone, email, password required.' });

    const exists = await Doctor.findOne({ where: { email } });
    if (exists) return res.status(400).json({ success: false, message: 'Email already exists.' });

    const count  = await Doctor.count();
    const id     = 'DOC' + String(count + 1).padStart(3, '0');
    const hashed = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({ id, name, role: role||'Doctor', dept, phone, email, password: hashed, qual, exp, avail });
    const { password: _, ...doctorData } = doctor.toJSON();
    res.status(201).json({ success: true, message: `Doctor added. Login ID: ${id}`, data: doctorData });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT update doctor
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ where: { id: req.params.id } });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' });

    const { name, phone, email, qual, exp, avail, password } = req.body;
    if (name)  doctor.name  = name;
    if (phone) doctor.phone = phone;
    if (email) doctor.email = email;
    if (qual)  doctor.qual  = qual;
    if (exp)   doctor.exp   = exp;
    if (avail) doctor.avail = avail;
    if (password) doctor.password = await bcrypt.hash(password, 10);
    await doctor.save();
    res.json({ success: true, message: 'Doctor updated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE doctor (admin only)
const deleteDoctor = async (req, res) => {
  try {
    const deleted = await Doctor.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Doctor not found.' });
    res.json({ success: true, message: 'Doctor deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getAllDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };
