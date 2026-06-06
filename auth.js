const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verify JWT token
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token. Access denied.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

// Allow only admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access only.' });
  }
  next();
};

// Allow only doctor
const doctorOnly = (req, res, next) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ success: false, message: 'Doctor access only.' });
  }
  next();
};

// Allow only patient
const patientOnly = (req, res, next) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ success: false, message: 'Patient access only.' });
  }
  next();
};

// Allow admin or doctor
const adminOrDoctor = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
    return res.status(403).json({ success: false, message: 'Admin or Doctor access only.' });
  }
  next();
};

module.exports = { protect, adminOnly, doctorOnly, patientOnly, adminOrDoctor };
