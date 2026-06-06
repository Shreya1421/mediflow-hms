function requirePatient() {
  const s = getSession();
  if (!s || s.role !== 'patient') window.location.href = '../login-patient.html';
}
function patientLogout() { clearSession(); window.location.href = '../login-patient.html'; }

function getMe() {
  const s = getSession();
  return DB.get('mf_patients').find(p => p.id === s.patientId);
}
function getMyApts() {
  const me = getMe();
  if (!me) return [];
  return DB.get('mf_appointments').filter(a => a.patientId === me.id || a.patientName === me.name);
}
function showPatientAlert(id, msg, type='success') {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `patient-alert patient-alert-${type} show`;
  el.innerHTML = (type==='success'?'✓ ':'✕ ') + msg;
  setTimeout(() => el.classList.remove('show'), 3500);
}
function buildPatientNav() {
  const me = getMe();
  if (!me) return;
  const initial = me.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const el1 = document.getElementById('patientName');
  const el2 = document.getElementById('patientInitial');
  if (el1) el1.textContent = me.name;
  if (el2) el2.textContent = initial;
}
