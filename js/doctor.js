function requireDoctor() {
  const s = getSession();
  if (!s || s.role !== 'doctor') window.location.href = '../login-doctor.html';
}
function doctorLogout() { clearSession(); window.location.href = '../login-doctor.html'; }

function getMyPatients(doctorId) {
  return DB.get('mf_patients').filter(p => p.doctor === doctorId);
}
function getMyAppointments(doctorId) {
  return DB.get('mf_appointments').filter(a => a.doctorId === doctorId);
}
function showDoctorAlert(id, msg, type='success') {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `doctor-alert doctor-alert-${type} show`;
  el.innerHTML = (type==='success'?'✓ ':'✕ ') + msg;
  setTimeout(() => el.classList.remove('show'), 3500);
}

// Build shared nav for doctor pages
function buildDocNav(activePage) {
  const s = getSession();
  const name = s?.name || 'Doctor';
  const initial = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('doctorName').textContent = name;
  document.getElementById('doctorInitial').textContent = initial;
}
