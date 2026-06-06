const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');

// Route imports
const authRoutes        = require('./routes/auth');
const doctorRoutes      = require('./routes/doctors');
const patientRoutes     = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/doctors',      doctorRoutes);
app.use('/api/patients',     patientRoutes);
app.use('/api/appointments', appointmentRoutes);

// ── Health check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏥 MediFlow HMS API is running.',
    version: '1.0.0',
    endpoints: {
      auth:         '/api/auth',
      doctors:      '/api/doctors',
      patients:     '/api/patients',
      appointments: '/api/appointments'
    }
  });
});

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ── Error handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── Start server ─────────────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 MediFlow server running on http://localhost:${PORT}`);
  });
};

start();
