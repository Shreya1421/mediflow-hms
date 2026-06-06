// ── Admin JS helpers shared across all admin pages ────────────

function requireAdmin() {
  const s = getSession();
  if (!s || s.role !== 'admin') window.location.href = '../login-admin.html';
}

// Data helpers
const DB = {
  get: k => JSON.parse(localStorage.getItem(k) || '[]'),
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};

function getDoctors()      { return DB.get('mf_doctors'); }
function getPatients()     { return DB.get('mf_patients'); }
function getAppointments() { return DB.get('mf_appointments'); }

function saveDoctor(doc) {
  const list = getDoctors();
  const idx = list.findIndex(d => d.id === doc.id);
  if (idx >= 0) list[idx] = doc; else list.push(doc);
  DB.set('mf_doctors', list);
}
function savePatient(pat) {
  const list = getPatients();
  const idx = list.findIndex(p => p.id === pat.id);
  if (idx >= 0) list[idx] = pat; else list.push(pat);
  DB.set('mf_patients', list);
}
function saveAppointment(apt) {
  const list = getAppointments();
  const idx = list.findIndex(a => a.id === apt.id);
  if (idx >= 0) list[idx] = apt; else list.push(apt);
  DB.set('mf_appointments', list);
}
function deleteById(key, id) {
  DB.set(key, DB.get(key).filter(x => x.id !== id));
}
function nextId(prefix, list) {
  return prefix + String(list.length + 1).padStart(3, '0');
}

// Status badge helper
function statusBadge(status) {
  const map = { Confirmed:'badge-confirmed', Pending:'badge-pending', Completed:'badge-completed', Cancelled:'badge-cancelled' };
  return `<span class="badge ${map[status] || 'badge-navy'}">${status}</span>`;
}

// Show/hide alert
function showAlert(id, msg, type='success') {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `admin-alert admin-alert-${type} show`;
  el.innerHTML = (type==='success' ? '✓ ' : '✕ ') + msg;
  setTimeout(() => el.classList.remove('show'), 3500);
}

// Logout
function adminLogout() { clearSession(); window.location.href = '../login-admin.html'; }
