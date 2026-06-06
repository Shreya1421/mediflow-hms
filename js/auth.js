// ── Demo credentials ──────────────────────────────────────────
const DEMO = {
  admin:   { email: 'admin@mediflow.com',   password: 'Admin@123',   role: 'admin'   },
  doctor:  { id:    'DOC001',               password: 'Doctor@123',  role: 'doctor'  },
};

// ── Session helpers ──────────────────────────────────────────
function setSession(role, data) {
  localStorage.setItem('mf_session', JSON.stringify({ role, ...data, ts: Date.now() }));
}
function getSession() {
  try { return JSON.parse(localStorage.getItem('mf_session')); } catch { return null; }
}
function clearSession() { localStorage.removeItem('mf_session'); }

function requireRole(role) {
  const s = getSession();
  if (!s || s.role !== role) {
    window.location.href = '../login-' + role + '.html';
  }
}

// ── Seed demo data if empty ───────────────────────────────────
function seedData() {
  if (!localStorage.getItem('mf_seeded')) {
    const doctors = [
      { id:'DOC001', name:'Dr. Rajesh Kumar',  dept:'Cardiology',    phone:'9876500001', email:'rajesh@mediflow.com',  password:'Doctor@123', patients:[] },
      { id:'DOC002', name:'Dr. Anjali Singh',  dept:'Neurology',     phone:'9876500002', email:'anjali@mediflow.com',  password:'Doc@456',    patients:[] },
      { id:'DOC003', name:'Dr. Mohan Das',     dept:'General',       phone:'9876500003', email:'mohan@mediflow.com',   password:'Doc@789',    patients:[] },
      { id:'DOC004', name:'Dr. Neha Verma',    dept:'Gynaecology',   phone:'9876500004', email:'neha@mediflow.com',    password:'Doc@101',    patients:[] },
      { id:'DOC005', name:'Dr. Arun Tiwari',   dept:'Orthopaedics',  phone:'9876500005', email:'arun@mediflow.com',    password:'Doc@202',    patients:[] },
    ];
    const patients = [
      { id:'PAT001', name:'Priya Sharma',  age:28, gender:'Female', blood:'B+', phone:'9800001111', email:'priya@mail.com',  dept:'Cardiology',   doctor:'DOC001', password:'Pat@123', address:'Varanasi', notes:'Hypertension', visits:[] },
      { id:'PAT002', name:'Amit Gupta',    age:45, gender:'Male',   blood:'O+', phone:'9800002222', email:'amit@mail.com',   dept:'General',      doctor:'DOC003', password:'Pat@456', address:'Lucknow',  notes:'Diabetes',    visits:[] },
      { id:'PAT003', name:'Sunita Devi',   age:33, gender:'Female', blood:'A+', phone:'9800003333', email:'sunita@mail.com', dept:'Gynaecology',  doctor:'DOC004', password:'Pat@789', address:'Kanpur',   notes:'',            visits:[] },
    ];
    const appointments = [
      { id:'APT001', patientId:'PAT001', patientName:'Priya Sharma',  doctorId:'DOC001', doctorName:'Dr. Rajesh Kumar', dept:'Cardiology',  date:'2026-05-25', time:'10:00 AM', status:'Confirmed', reason:'Follow-up',       notes:'' },
      { id:'APT002', patientId:'PAT002', patientName:'Amit Gupta',    doctorId:'DOC003', doctorName:'Dr. Mohan Das',    dept:'General',     date:'2026-05-26', time:'11:30 AM', status:'Confirmed', reason:'Routine check-up', notes:'' },
      { id:'APT003', patientId:'PAT003', patientName:'Sunita Devi',   doctorId:'DOC004', doctorName:'Dr. Neha Verma',  dept:'Gynaecology', date:'2026-05-24', time:'02:00 PM', status:'Completed', reason:'Consultation',     notes:'Prescribed rest for 2 weeks.' },
    ];
    localStorage.setItem('mf_doctors',      JSON.stringify(doctors));
    localStorage.setItem('mf_patients',     JSON.stringify(patients));
    localStorage.setItem('mf_appointments', JSON.stringify(appointments));
    localStorage.setItem('mf_seeded', '1');
  }
}

seedData();
