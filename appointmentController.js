const Appointment = require('../models/Appointment');
const Doctor  = require('../models/Doctor');
const Patient = require('../models/Patient');

// GET all appointments (admin)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({ order: [['date','DESC']] });
    res.json({ success: true, data: appointments });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET appointments by doctor
const getByDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({ where: { doctorId: req.params.doctorId }, order: [['date','DESC']] });
    res.json({ success: true, data: appointments });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET appointments by patient
const getByPatient = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({ where: { patientId: req.params.patientId }, order: [['date','DESC']] });
    res.json({ success: true, data: appointments });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET single appointment
const getAppointmentById = async (req, res) => {
  try {
    const apt = await Appointment.findOne({ where: { id: req.params.id } });
    if (!apt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    res.json({ success: true, data: apt });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST create appointment
const createAppointment = async (req, res) => {
  try {
    const { patientId, patientName, doctorId, date, time, reason, notes } = req.body;
    if (!patientName || !doctorId || !date || !time)
      return res.status(400).json({ success: false, message: 'patientName, doctorId, date, time required.' });

    const doctor = await Doctor.findOne({ where: { id: doctorId } });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' });

    const count = await Appointment.count();
    const id    = 'APT' + String(count + 1).padStart(3, '0');

    const apt = await Appointment.create({
      id, patientId: patientId || '', patientName,
      doctorId, doctorName: doctor.name, dept: doctor.dept,
      date, time, status: 'Confirmed', reason, notes
    });
    res.status(201).json({ success: true, message: `Appointment booked. ID: ${id}`, data: apt });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT update appointment (status, notes)
const updateAppointment = async (req, res) => {
  try {
    const apt = await Appointment.findOne({ where: { id: req.params.id } });
    if (!apt) return res.status(404).json({ success: false, message: 'Appointment not found.' });

    const fields = ['status','notes','reason','date','time','doctorId','doctorName'];
    fields.forEach(f => { if (req.body[f] !== undefined) apt[f] = req.body[f]; });
    await apt.save();
    res.json({ success: true, message: 'Appointment updated.', data: apt });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE appointment
const deleteAppointment = async (req, res) => {
  try {
    const deleted = await Appointment.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    res.json({ success: true, message: 'Appointment deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET weekly report data (admin)
const getWeeklyReport = async (req, res) => {
  try {
    const now = new Date();
    const day = now.getDay();
    const mon = new Date(now); mon.setDate(now.getDate() - (day===0?6:day-1));
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    const start = mon.toISOString().slice(0,10);
    const end   = sun.toISOString().slice(0,10);

    const { Op } = require('sequelize');
    const weekApts = await Appointment.findAll({ where: { date: { [Op.between]: [start, end] } } });
    const allApts  = await Appointment.findAll();
    const doctors  = await Doctor.findAll({ attributes: { exclude: ['password'] } });
    const patients = await Patient.findAll({ attributes: { exclude: ['password'] } });

    res.json({
      success: true,
      data: {
        period: { start, end },
        weekAppointments: weekApts,
        totalAppointments: allApts.length,
        totalDoctors: doctors.length,
        totalPatients: patients.length,
        completed: allApts.filter(a=>a.status==='Completed').length,
        confirmed: allApts.filter(a=>a.status==='Confirmed').length,
        cancelled: allApts.filter(a=>a.status==='Cancelled').length,
      }
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getAllAppointments, getByDoctor, getByPatient, getAppointmentById, createAppointment, updateAppointment, deleteAppointment, getWeeklyReport };
