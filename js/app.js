(function() {
'use strict';

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    const r = Array.isArray(radii) ? radii : [radii, radii, radii, radii];
    const [tl, tr, br, bl] = r.map(v => Math.min(v || 0, Math.min(w, h) / 2));
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + tr);
    this.lineTo(x + w, y + h - br);
    this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    this.lineTo(x + bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - bl);
    this.lineTo(x, y + tl);
    this.quadraticCurveTo(x, y, x + tl, y);
    this.closePath();
  };
}

const CATEGORIES = [
  { id: 'generale', name: 'Generale', icon: 'fa-globe', color: '#60a5fa' },
  { id: 'rete', name: 'Rete', icon: 'fa-network-wired', color: '#4ade80' },
  { id: 'applicativi', name: 'Applicativi', icon: 'fa-cubes', color: '#fbbf24' },
  { id: 'posta', name: 'Posta Elettronica', icon: 'fa-envelope', color: '#f472b6' },
  { id: 'hardware', name: 'Hardware', icon: 'fa-desktop', color: '#a78bfa' },
  { id: 'sicurezza', name: 'Sicurezza', icon: 'fa-shield-alt', color: '#ef4444' },
];

const PRIORITIES = ['Bassa', 'Media', 'Alta', 'Critica'];
const STATUSES = ['Aperto', 'In Lavorazione', 'Risolto', 'Chiuso'];

const DEFAULT_SEDI = [
  'Latina - Centro Armonia',
  'Viterbo',
  'RSA Flaminia',
  'MDR Ronciglione',
  'Marino - Villa Nina',
  "Catanzaro - Sant'Andrea",
  'RSA Cori',
  'RSA Pontina',
  'Civita',
];

const THEMES = {
  default: { primary: '#667eea', secondary: '#764ba2', bg: '#0f0f23', card: '#1a1a3e', name: 'Default' },
  ocean: { primary: '#2193b0', secondary: '#6dd5ed', bg: '#0a1628', card: '#0f1f3d', name: 'Oceano' },
  sunset: { primary: '#f12711', secondary: '#f5af19', bg: '#1a0a0a', card: '#2a1510', name: 'Tramonto' },
  forest: { primary: '#134e5e', secondary: '#71b280', bg: '#0a1a10', card: '#0f2818', name: 'Foresta' },
  midnight: { primary: '#0f0c29', secondary: '#302b63', bg: '#080816', card: '#10102a', name: 'Mezzanotte' },
  candy: { primary: '#d4145a', secondary: '#3bbdc7', bg: '#1a0a1a', card: '#2a1028', name: 'Candy' },
};

const DEFAULT_USERS = [
  { id: 'u1', username: 'admin', password: 'admin123', name: 'Marco Rossi', role: 'admin', sede: 'Latina - Centro Armonia' },
  { id: 'u2', username: 'user', password: 'user123', name: 'Laura Bianchi', role: 'user', sede: 'RSA Flaminia' },
  { id: 'u3', username: 'luca', password: 'luca123', name: 'Luca Verdi', role: 'user', sede: 'Viterbo' },
];

function sedeOf(id) { const u = DEFAULT_USERS.find(x => x.id === id); return u ? u.sede : ''; }

const DEFAULT_TICKETS = [
  { id: 't1', title: 'PC non si accende', description: 'Il computer della reception non mostra segni di vita dopo un aggiornamento di sistema.', category: 'hardware', priority: 'Alta', status: 'Aperto', createdBy: 'u2', assignedTo: 'u1', sede: sedeOf('u2'), createdAt: Date.now() - 86400000 * 3, updatedAt: Date.now() - 86400000 * 3, comments: [] },
  { id: 't2', title: 'Connessione internet lenta', description: 'La connessione di rete nella sede centrale è molto lenta da questa mattina. Velocità inferiore a 1 Mbps.', category: 'rete', priority: 'Media', status: 'In Lavorazione', createdBy: 'u2', assignedTo: 'u1', sede: sedeOf('u2'), createdAt: Date.now() - 86400000 * 5, updatedAt: Date.now() - 86400000 * 2, comments: [{ id: 'c1', userId: 'u1', text: 'Stiamo verificando con il provider. Possibile problema di banda.', date: Date.now() - 86400000 * 2 }] },
  { id: 't3', title: 'Errore programma fatturazione', description: 'Il software di fatturazione restituisce errore 0x45A durante l\'elaborazione delle fatture del mese corrente.', category: 'applicativi', priority: 'Critica', status: 'Aperto', createdBy: 'u3', assignedTo: 'u1', sede: sedeOf('u3'), createdAt: Date.now() - 86400000 * 1, updatedAt: Date.now() - 86400000 * 1, comments: [] },
  { id: 't4', title: 'Casella email piena', description: 'La casella di posta info@azienda.com ha superato il limite di spazio. Richiesta espansione.', category: 'posta', priority: 'Bassa', status: 'Risolto', createdBy: 'u3', assignedTo: 'u1', sede: sedeOf('u3'), createdAt: Date.now() - 86400000 * 10, updatedAt: Date.now() - 86400000 * 7, comments: [{ id: 'c2', userId: 'u1', text: 'Spazio espanso a 10GB. Problema risolto.', date: Date.now() - 86400000 * 7 }] },
  { id: 't5', title: 'Richiesta nuovo account VPN', description: 'Servono credenziali VPN per il nuovo collaboratore Michele Neri (reparto vendite).', category: 'sicurezza', priority: 'Media', status: 'Chiuso', createdBy: 'u2', assignedTo: 'u1', sede: sedeOf('u2'), createdAt: Date.now() - 86400000 * 15, updatedAt: Date.now() - 86400000 * 12, comments: [{ id: 'c3', userId: 'u1', text: 'Account creato e credenziali inviate via email.', date: Date.now() - 86400000 * 12 }] },
  { id: 't6', title: 'Stampante non risponde', description: 'La stampante di rete nel reparto contabilità non risponde ai comandi di stampa.', category: 'hardware', priority: 'Media', status: 'In Lavorazione', createdBy: 'u2', assignedTo: 'u1', sede: sedeOf('u2'), createdAt: Date.now() - 86400000 * 2, updatedAt: Date.now() - 86400000 * 1, comments: [{ id: 'c4', userId: 'u1', text: 'Driver reinstallati. In attesa di test.', date: Date.now() - 86400000 * 1 }] },
  { id: 't7', title: 'Richiesta formato data errato', description: 'Il gestionale mostra le date in formato americano (MM/DD/YYYY) anziché italiano (DD/MM/YYYY).', category: 'applicativi', priority: 'Bassa', status: 'Aperto', createdBy: 'u3', assignedTo: '', sede: sedeOf('u3'), createdAt: Date.now() - 86400000 * 0.5, updatedAt: Date.now() - 86400000 * 0.5, comments: [] },
  { id: 't8', title: 'Blocco account utente', description: 'Account bloccato dopo 3 tentativi di accesso falliti. Sbloccare l\'account.', category: 'sicurezza', priority: 'Alta', status: 'Risolto', createdBy: 'u2', assignedTo: 'u1', sede: sedeOf('u2'), createdAt: Date.now() - 86400000 * 20, updatedAt: Date.now() - 86400000 * 18, comments: [{ id: 'c5', userId: 'u1', text: 'Account sbloccato. Password resettata.', date: Date.now() - 86400000 * 18 }] },
];

let currentUser = null;
let currentView = 'dashboard';

function uid() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }

function getData(key, def) { try { const d = localStorage.getItem('ticketflow_' + key); return d ? JSON.parse(d) : def; } catch { return def; } }
function setData(key, val) { localStorage.setItem('ticketflow_' + key, JSON.stringify(val)); }

function migrateUsers(list) {
  return list.map(u => {
    if (!u.sede) u.sede = '';
    if (!u.avatar) u.avatar = '';
    return u;
  });
}
function migrateTickets(list) {
  return list.map(t => {
    if (!t.sede) {
      const creator = getUser(t.createdBy);
      t.sede = creator ? creator.sede || '' : '';
    }
    return t;
  });
}
function getUsers() { return migrateUsers(getData('users', DEFAULT_USERS)); }
function setUsers(v) { setData('users', v); }

function getTickets() { return migrateTickets(getData('tickets', DEFAULT_TICKETS)); }
function setTickets(v) { setData('tickets', v); }

function getTheme() { return getData('theme', 'default'); }
function setTheme(v) { setData('theme', v); }

function getBg() { return getData('bg', null); }
function setBg(v) { setData('bg', v); }

function getDark() { return getData('dark', true); }
function setDark(v) { setData('dark', v); }

function getSedi() { return getData('sedi', DEFAULT_SEDI); }
function setSedi(v) { setData('sedi', v); }

function getNotifs() { return getData('notifs', []); }
function setNotifs(v) { setData('notifs', v); }

function getEmailCfg() { return getData('emailCfg', { key: '', service: '', template: '', to: '' }); }
function setEmailCfg(v) { setData('emailCfg', v); }

function getUser(id) { return getUsers().find(u => u.id === id); }
function getUserByUsername(u) { return getUsers().find(x => x.username === u); }

function getUserName(id) { const u = getUser(id); return u ? u.name : 'Sconosciuto'; }

function getCategory(id) { return CATEGORIES.find(c => c.id === id) || { name: id, icon: 'fa-tag', color: '#999' }; }

const auth = {
  bgImages: [],
  bgInterval: null,
  bgIdx: 0,
  bgSec: 60,
  startBgRotation() {
    this.bgSec = 30;
    this.bgIdx = -1;
    this.bgImages = [];
    const el = document.getElementById('loginBg');
    if (!el) return;
    const timerContainer = document.getElementById('loginBgTimer');
    if (timerContainer) {
      timerContainer.innerHTML = `<svg viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="20"/>
        <circle class="timer-progress" id="timerProgress" cx="24" cy="24" r="20"
          stroke-dasharray="125.6" stroke-dashoffset="0"/>
      </svg><span class="timer-label" id="timerLabel">30</span>`;
    }
    this.fetchBingImages();
    if (this.bgInterval) clearInterval(this.bgInterval);
    let sec = 30;
    const tick = () => {
      sec--;
      const label = document.getElementById('timerLabel');
      const progress = document.getElementById('timerProgress');
      if (label) label.textContent = sec;
      if (progress) progress.style.strokeDashoffset = 125.6 * (1 - sec / 30);
      if (sec <= 0) { sec = 30; this.nextBg(); }
    };
    this.bgInterval = setInterval(tick, 1000);
  },
  fetchBingImages() {
    const fallback = () => {
      const ids = Array.from({length: 100}, (_, i) => i + 10);
      this.bgImages = ids.map(id => ({ url: `https://picsum.photos/id/${id}/1920/1080`, grad: '', credit: '' }));
      this.nextBg();
    };
    fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=it-IT')
      .then(r => r.json())
      .then(data => {
        if (!data || !data.images || !data.images.length) { fallback(); return; }
        this.bgImages = data.images.map(img => ({
          url: 'https://www.bing.com' + img.url,
          grad: '',
          credit: img.copyright || ''
        }));
        this.nextBg();
      })
      .catch(() => fallback());
  },
  nextBg() {
    if (!this.bgImages.length) return;
    this.bgIdx = (this.bgIdx + 1) % this.bgImages.length;
    const img = this.bgImages[this.bgIdx];
    const container = document.getElementById('loginBgImg');
    const bg = document.getElementById('loginBg');
    const credit = document.getElementById('loginBgCredit');
    if (!bg) return;
    if (img.url) {
      if (container) {
        if (container.classList.contains('active')) {
          container.classList.remove('active');
          setTimeout(() => {
            container.style.backgroundImage = `url(${img.url})`;
            container.classList.add('active');
          }, 2200);
        } else {
          container.style.backgroundImage = `url(${img.url})`;
          container.classList.add('active');
        }
      }
      bg.style.background = '';
      if (credit) credit.textContent = img.credit;
    } else if (img.grad) {
      if (container) container.classList.remove('active');
      bg.style.background = `linear-gradient(135deg, ${img.grad})`;
      if (credit) credit.textContent = '';
    }
  },
  stopBgRotation() {
    if (this.bgInterval) { clearInterval(this.bgInterval); this.bgInterval = null; }
  },
  login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const errEl = document.getElementById('loginError');
    const user = getUserByUsername(username);
    if (!user || user.password !== password) {
      errEl.textContent = 'Username o password non validi.';
      return;
    }
    currentUser = user;
    errEl.textContent = '';
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    app.initApp();
  },
  logout() {
    chat.stopPolling();
    currentUser = null;
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    this.startBgRotation();
  }
};

const app = {
  initApp() {
    if (!getData('_migrated', false)) {
      setUsers(getUsers());
      setTickets(getTickets());
      setData('_migrated', true);
    }
    this.applyTheme();
    this.applyBg();
    this.populateSelects();
    this.updateUserUI();
    this.navigate('dashboard');
    this.setupKeyboard();
    notify.init();
    this.loadEmailJSConfig();
    chat.startPolling();
    chat.updateBadge();
    setTimeout(() => dashboard.render(), 100);
    if (!currentUser) return;
    document.querySelectorAll('.admin-only').forEach(el => {
      el.classList.toggle('hidden', currentUser.role !== 'admin');
    });
    if (currentUser.role === 'admin') this.renderSedi();
  },
  loadProfileSettings() {
    if (!currentUser) return;
    const preview = document.getElementById('profileAvatar');
    if (!preview) return;
    const initials = currentUser.name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2);
    if (currentUser.avatar) {
      preview.innerHTML = `<img src="${currentUser.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
    } else {
      preview.textContent = initials;
    }
  },
  loadEmailJSConfig() {
    const cfg = getEmailCfg();
    const keyEl = document.getElementById('emailjsKey');
    const svcEl = document.getElementById('emailjsService');
    const tplEl = document.getElementById('emailjsTemplate');
    const toEl = document.getElementById('emailjsTo');
    if (keyEl) keyEl.value = cfg.key || '';
    if (svcEl) svcEl.value = cfg.service || '';
    if (tplEl) tplEl.value = cfg.template || '';
    if (toEl) toEl.value = cfg.to || '';
    const resetSel = document.getElementById('resetUserSelect');
    if (resetSel) {
      resetSel.innerHTML = '<option value="">Seleziona utente</option>' +
        getUsers().filter(u => u.role === 'user').map(u => `<option value="${u.id}">${u.name} (@${u.username})</option>`).join('');
    }
  },
  resetPassword() {
    const userId = document.getElementById('resetUserSelect').value;
    const newPwd = document.getElementById('resetPasswordInput').value.trim();
    const statusEl = document.getElementById('resetPwdStatus');
    if (!userId) { app.toast('Seleziona un utente', 'error'); return; }
    if (!newPwd) { app.toast('Inserisci la nuova password', 'error'); return; }
    if (newPwd.length < 4) { app.toast('Password troppo corta (min 4 caratteri)', 'error'); return; }
    const list = getUsers();
    const user = list.find(u => u.id === userId);
    if (!user) return;
    user.password = newPwd;
    setUsers(list);
    document.getElementById('resetPasswordInput').value = '';
    document.getElementById('resetUserSelect').value = '';
    if (statusEl) statusEl.textContent = `Password resettata per ${user.name}`;
    app.toast(`Password resettata per ${user.name}`, 'success');
    setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 4000);
  },
  renderSedi() {
    const list = getSedi();
    const el = document.getElementById('sedeList');
    if (!el) return;
    el.innerHTML = list.map((s, i) => `
      <div class="ticket-item">
        <div class="ticket-info">
          <h4 style="display:flex;align-items:center;gap:0.5rem"><i class="fas fa-building" style="color:var(--primary)"></i> ${s}</h4>
        </div>
        <div class="ticket-actions">
          <button onclick="app.renameSede(${i})" title="Rinomina"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" onclick="app.deleteSede(${i})" title="Elimina"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join('');
  },
  addSede() {
    const name = prompt('Nuova sede:');
    if (!name || !name.trim()) return;
    const list = getSedi();
    if (list.includes(name.trim())) { app.toast('Sede già esistente', 'error'); return; }
    list.push(name.trim());
    setSedi(list);
    this.renderSedi();
    app.populateSelects();
    app.toast('Sede aggiunta', 'success');
  },
  renameSede(idx) {
    const list = getSedi();
    const name = prompt('Nuovo nome:', list[idx]);
    if (!name || !name.trim() || name.trim() === list[idx]) return;
    if (list.includes(name.trim())) { app.toast('Sede già esistente', 'error'); return; }
    const old = list[idx];
    list[idx] = name.trim();
    setSedi(list);
    let users = getUsers();
    users.forEach(u => { if (u.sede === old) u.sede = name.trim(); });
    setUsers(users);
    let tickets = getTickets();
    tickets.forEach(t => { if (t.sede === old) t.sede = name.trim(); });
    setTickets(tickets);
    this.renderSedi();
    app.populateSelects();
    app.toast('Sede rinominata', 'success');
  },
  deleteSede(idx) {
    const list = getSedi();
    const name = list[idx];
    if (!app.confirm(`Eliminare "${name}"? Gli utenti e ticket associati perderanno la sede.`)) return;
    list.splice(idx, 1);
    setSedi(list);
    let users = getUsers();
    users.forEach(u => { if (u.sede === name) u.sede = ''; });
    setUsers(users);
    let tickets = getTickets();
    tickets.forEach(t => { if (t.sede === name) t.sede = ''; });
    setTickets(tickets);
    this.renderSedi();
    app.populateSelects();
    app.toast('Sede eliminata', 'success');
  },
  updateUserUI() {
    if (!currentUser) return;
    const avatarEl = document.getElementById('userAvatar');
    const initials = currentUser.name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2);
    if (currentUser.avatar) {
      avatarEl.innerHTML = `<img src="${currentUser.avatar}" alt="${currentUser.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
    } else {
      avatarEl.textContent = initials;
      avatarEl.style.background = '';
    }
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = currentUser.role === 'admin' ? 'Administrator' : 'User';
    const sedeEl = document.getElementById('userSede');
    if (sedeEl) sedeEl.textContent = currentUser.sede || '';
    const badge = document.getElementById('ticketBadge');
    const openCount = getTickets().filter(t => t.status === 'Aperto').length;
    badge.textContent = openCount;
    badge.style.display = openCount > 0 ? 'inline' : 'none';
  },
  uploadAvatar(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) { this.toast('Immagine troppo grande (max 500KB)', 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      currentUser.avatar = e.target.result;
      const list = getUsers();
      const user = list.find(u => u.id === currentUser.id);
      if (user) user.avatar = currentUser.avatar;
      setUsers(list);
      this.updateUserUI();
      const preview = document.getElementById('profileAvatar');
      if (preview) preview.innerHTML = `<img src="${currentUser.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
      document.getElementById('profileUploadStatus').textContent = 'Immagine aggiornata';
      this.toast('Immagine profilo aggiornata', 'success');
    };
    reader.readAsDataURL(file);
  },
  removeAvatar() {
    if (!app.confirm('Rimuovere l\'immagine del profilo?')) return;
    currentUser.avatar = '';
    const list = getUsers();
    const user = list.find(u => u.id === currentUser.id);
    if (user) user.avatar = '';
    setUsers(list);
    this.updateUserUI();
    const preview = document.getElementById('profileAvatar');
    if (preview) {
      const initials = currentUser.name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2);
      preview.textContent = initials;
    }
    document.getElementById('profileUploadStatus').textContent = '';
    this.toast('Immagine rimossa', 'success');
  },
  changePassword() {
    const current = document.getElementById('changePwdCurrent').value;
    const newPwd = document.getElementById('changePwdNew').value.trim();
    const confirm = document.getElementById('changePwdConfirm').value.trim();
    const statusEl = document.getElementById('changePwdStatus');
    if (!current || !newPwd || !confirm) { this.toast('Compila tutti i campi', 'error'); return; }
    if (current !== currentUser.password) { this.toast('Password attuale errata', 'error'); return; }
    if (newPwd.length < 4) { this.toast('La nuova password deve essere almeno 4 caratteri', 'error'); return; }
    if (newPwd !== confirm) { this.toast('Le password non coincidono', 'error'); return; }
    const list = getUsers();
    const user = list.find(u => u.id === currentUser.id);
    if (!user) return;
    user.password = newPwd;
    currentUser.password = newPwd;
    setUsers(list);
    document.getElementById('changePwdCurrent').value = '';
    document.getElementById('changePwdNew').value = '';
    document.getElementById('changePwdConfirm').value = '';
    if (statusEl) statusEl.textContent = 'Password cambiata con successo';
    this.toast('Password cambiata con successo', 'success');
    setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 4000);
  },
  navigate(view) {
    if (view === 'users' && currentUser.role !== 'admin') { this.toast('Accesso negato', 'error'); return; }
    currentView = view;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const page = document.getElementById('page-' + view);
    if (page) page.classList.add('active');
    const nav = document.querySelector(`.nav-item[data-view="${view}"]`);
    if (nav) nav.classList.add('active');
    if (view === 'dashboard') dashboard.render();
    if (view === 'tickets') tickets.render();
    if (view === 'users') users.render();
    if (view === 'newticket') tickets.prepareForm();
    if (view === 'chat') chat.render();
    if (view === 'settings') { this.loadEmailJSConfig(); this.renderSedi(); this.loadProfileSettings(); }
    this.closeCustomizePanel();
    if (window.innerWidth <= 768) this.closeSidebar();
  },
  toggleSidebar() {
    const sb = document.getElementById('sidebar');
    if (window.innerWidth <= 768) sb.classList.toggle('mobile-open');
    else sb.classList.toggle('collapsed');
  },
  closeSidebar() {
    if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('mobile-open');
  },
  populateSelects() {
    const catSel = document.getElementById('ticketCategory');
    if (catSel) {
      catSel.innerHTML = CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
    const filterCat = document.getElementById('filterCategory');
    if (filterCat) {
      filterCat.innerHTML = '<option value="">Tutte le categorie</option>' + CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
    const filterStatus = document.getElementById('filterStatus');
    if (filterStatus) {
      filterStatus.innerHTML = '<option value="">Tutti gli stati</option>' + STATUSES.map(s => `<option value="${s}">${s}</option>`).join('');
    }
    const filterPriority = document.getElementById('filterPriority');
    if (filterPriority) {
      filterPriority.innerHTML = '<option value="">Tutte le priorità</option>' + PRIORITIES.map(p => `<option value="${p}">${p}</option>`).join('');
    }
    const filterSede = document.getElementById('filterSede');
    if (filterSede) {
      filterSede.innerHTML = '<option value="">Tutte le sedi</option>' + getSedi().map(s => `<option value="${s}">${s}</option>`).join('');
    }
    this.populateAssignees();
  },
  populateAssignees() {
    const sel = document.getElementById('ticketAssignee');
    if (!sel) return;
    sel.innerHTML = '<option value="">Non assegnato</option>' +
      getUsers().map(u => `<option value="${u.id}">${u.name} (${u.role === 'admin' ? 'Admin' : 'User'})</option>`).join('');
  },
  toggleTheme() {
    const isDark = getDark();
    setDark(!isDark);
    this.applyTheme();
  },
  applyTheme() {
    const isDark = getDark();
    document.body.classList.toggle('light', !isDark);
    const icons = document.querySelectorAll('#themeIcon, #topbarThemeIcon');
    icons.forEach(icon => {
      icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    });
    const dmToggle = document.getElementById('darkModeToggle');
    if (dmToggle) dmToggle.checked = !isDark;
    const label = document.getElementById('darkModeLabel');
    if (label) label.textContent = isDark ? 'Tema scuro attivo' : 'Tema chiaro attivo';
  },
  applyBg() {
    const bg = getBg();
    const mainContent = document.querySelector('.page-content');
    if (!mainContent) return;
    if (!bg) {
      mainContent.style.background = '';
      mainContent.style.backgroundSize = '';
      return;
    }
    if (bg.startsWith('#')) {
      mainContent.style.background = bg;
    } else {
      mainContent.style.background = `linear-gradient(135deg, ${bg})`;
    }
    mainContent.style.backgroundSize = 'cover';
    mainContent.style.backgroundAttachment = 'fixed';
  },
  showModal(id) { document.getElementById(id).classList.remove('hidden'); },
  closeModal(id) { document.getElementById(id).classList.add('hidden'); },
  openCustomizePanel() {
    document.getElementById('customizePanel').classList.remove('hidden');
    dashboard.renderCustomizePanel();
  },
  closeCustomizePanel() { document.getElementById('customizePanel').classList.add('hidden'); },
  openNotifications() {
    notify.renderModal();
    app.showModal('notifModal');
  },
  saveEmailJSConfig() {
    setEmailCfg({
      key: document.getElementById('emailjsKey').value.trim(),
      service: document.getElementById('emailjsService').value.trim(),
      template: document.getElementById('emailjsTemplate').value.trim(),
      to: document.getElementById('emailjsTo').value.trim(),
    });
    const cfg = getEmailCfg();
    if (cfg.key) { try { emailjs.init(cfg.key); } catch(e) {} }
    app.toast('Configurazione email salvata', 'success');
  },
  async testEmail() {
    const cfg = getEmailCfg();
    if (!cfg.key || !cfg.service || !cfg.template || !cfg.to) {
      app.toast('Completa prima la configurazione EmailJS', 'error');
      return;
    }
    try {
      await emailjs.send(cfg.service, cfg.template, {
        to_name: 'Test',
        to_email: cfg.to,
        from_name: 'TicketFlow',
        from_sede: 'Test Sede',
        from_ip: '0.0.0.0',
        ticket_title: 'Email di prova',
        ticket_category: 'Test',
        ticket_priority: 'Bassa',
        ticket_description: 'Questa è una email di prova da TicketFlow.',
        ticket_date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        message: 'Email di prova da TicketFlow'
      });
      document.getElementById('emailjsStatus').textContent = 'Email di prova inviata!';
      app.toast('Email di prova inviata!', 'success');
    } catch (err) {
      document.getElementById('emailjsStatus').textContent = 'Errore: ' + (err.text || err.message);
      app.toast('Errore invio: ' + (err.text || err.message), 'error');
    }
  },
  toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  },
  globalSearch(val) {
    if (currentView !== 'tickets') { this.navigate('tickets'); }
    const input = document.getElementById('ticketSearch');
    if (input) input.value = val;
    tickets.applyFilters();
  },
  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => m.classList.add('hidden'));
        this.closeCustomizePanel();
      }
    });
    document.querySelectorAll('.modal-overlay').forEach(m => {
      m.addEventListener('click', (e) => { if (e.target === m) m.classList.add('hidden'); });
    });
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if (currentView === 'dashboard') dashboard.renderCharts(getTickets()); }, 300);
    });
  },
  toast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${msg}`;
    container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(100%)'; el.style.transition = '0.3s'; setTimeout(() => el.remove(), 300); }, 3000);
  },
  confirm(msg) { return window.confirm(msg); }
};

const chat = {
  interval: null,
  getMessages() {
    return getData('chats', []);
  },
  setMessages(list) {
    setData('chats', list);
  },
  unreadCount() {
    const msgs = this.getMessages();
    return msgs.filter(m => m.to === currentUser.id && !m.read).length;
  },
  updateBadge() {
    const badge = document.getElementById('chatBadge');
    if (!badge) return;
    const count = this.unreadCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline' : 'none';
    const alert = document.getElementById('chatAlert');
    if (alert) {
      alert.classList.toggle('hidden', count === 0);
      const cnt = document.getElementById('chatAlertCount');
      if (cnt) cnt.textContent = count;
    }
  },
  send() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    const msgs = this.getMessages();
    const admin = getUsers().find(u => u.role === 'admin');
    const recipient = currentUser.role === 'admin'
      ? document.getElementById('chatPartnerId').value
      : admin.id;
    msgs.push({
      id: uid(),
      from: currentUser.id,
      to: recipient,
      text,
      timestamp: Date.now(),
      read: false
    });
    this.setMessages(msgs);
    input.value = '';
    this.renderMessages();
    this.updateBadge();
    app.toast('Messaggio inviato', 'success');
  },
  markRead(userId) {
    const msgs = this.getMessages();
    let changed = false;
    msgs.forEach(m => {
      if (m.from === userId && m.to === currentUser.id && !m.read) {
        m.read = true; changed = true;
      }
    });
    if (changed) this.setMessages(msgs);
    this.updateBadge();
  },
  renderConversations() {
    const sidebar = document.getElementById('chatSidebar');
    if (!sidebar) return;
    if (currentUser.role === 'admin') {
      sidebar.style.display = 'block';
      const msgs = this.getMessages();
      const userIds = [...new Set(msgs.map(m => m.from === currentUser.id ? m.to : m.from))];
      const users = getUsers().filter(u => userIds.includes(u.id));
      const el = document.getElementById('chatConversations');
      el.innerHTML = users.map(u => {
        const last = msgs.filter(m => (m.from === u.id || m.to === u.id)).sort((a, b) => b.timestamp - a.timestamp)[0];
        const unread = msgs.filter(m => m.from === u.id && m.to === currentUser.id && !m.read).length;
        return `<div class="chat-conv" onclick="chat.openConversation('${u.id}')">
          <div class="chat-conv-avatar">${u.avatar ? `<img src="${u.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">` : u.name[0]}</div>
          <div class="chat-conv-info">
            <div class="chat-conv-name">${u.name} ${unread ? `<span class="chat-conv-badge">${unread}</span>` : ''}</div>
            <div class="chat-conv-preview">${last ? last.text : 'Nessun messaggio'}</div>
          </div>
        </div>`;
      }).join('');
      if (!users.length) el.innerHTML = '<div style="padding:1rem;color:var(--text-secondary);text-align:center">Nessuna conversazione</div>';
    } else {
      sidebar.style.display = 'none';
    }
  },
  openConversation(userId) {
    this.markRead(userId);
    document.getElementById('chatPartnerId').value = userId;
    const user = getUser(userId);
    const avatarEl = document.getElementById('chatPartnerAvatar');
    if (user.avatar) {
      avatarEl.innerHTML = `<img src="${user.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
    } else {
      avatarEl.textContent = user.name[0];
    }
    document.getElementById('chatPartnerName').textContent = user.name;
    document.getElementById('chatInputArea').style.display = 'flex';
    document.querySelector('.chat-empty')?.classList.add('hidden');
    this.renderMessages();
  },
  renderMessages() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    const otherId = document.getElementById('chatPartnerId')?.value;
    if (!otherId) return;
    const msgs = this.getMessages().filter(m =>
      (m.from === currentUser.id && m.to === otherId) ||
      (m.from === otherId && m.to === currentUser.id)
    ).sort((a, b) => a.timestamp - b.timestamp);
    container.innerHTML = msgs.map(m => `
      <div class="chat-msg ${m.from === currentUser.id ? 'chat-msg-own' : 'chat-msg-other'}">
        <div class="chat-msg-text">${m.text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')}</div>
        <div class="chat-msg-time">${new Date(m.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
      </div>
    `).join('');
    container.scrollTop = container.scrollHeight;
  },
  render() {
    this.renderConversations();
    const partnerId = document.getElementById('chatPartnerId')?.value;
    if (partnerId) {
      this.openConversation(partnerId);
    } else if (currentUser.role !== 'admin') {
      const admin = getUsers().find(u => u.role === 'admin');
      if (admin) this.openConversation(admin.id);
    }
  },
  filter(query) {
    document.querySelectorAll('.chat-conv').forEach(el => {
      el.style.display = el.textContent.toLowerCase().includes(query.toLowerCase()) ? 'flex' : 'none';
    });
  },
  startPolling() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.updateBadge();
      const otherId = document.getElementById('chatPartnerId')?.value;
      if (otherId) {
        this.markRead(otherId);
        this.renderConversations();
        this.renderMessages();
      }
    }, 3000);
  },
  stopPolling() {
    if (this.interval) { clearInterval(this.interval); this.interval = null; }
  }
};

const dashboard = {
  render() {
    const allTickets = getTickets();
    const tickets = currentUser && currentUser.role !== 'admin'
      ? allTickets.filter(t => t.createdBy === currentUser.id || t.assignedTo === currentUser.id)
      : allTickets;
    const totale = tickets.length;
    const aperti = tickets.filter(t => t.status === 'Aperto').length;
    const lavorazione = tickets.filter(t => t.status === 'In Lavorazione').length;
    const risolti = tickets.filter(t => t.status === 'Risolto' || t.status === 'Chiuso').length;
    document.getElementById('statTotale').textContent = totale;
    document.getElementById('statAperti').textContent = aperti;
    document.getElementById('statLavorazione').textContent = lavorazione;
    document.getElementById('statRisolti').textContent = risolti;
    this.renderCharts(tickets);
    this.renderRecentTickets(tickets);
    app.updateUserUI();
  },
  renderCharts(tickets) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.renderCategoryChart(tickets);
        this.renderStatusChart(tickets);
      });
    });
  },
  renderCategoryChart(tickets) {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);
    const w = rect.width, h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const counts = CATEGORIES.map(c => ({
      ...c,
      count: tickets.filter(t => t.category === c.id).length
    }));
    const max = Math.max(...counts.map(c => c.count), 1);
    const barW = (w - 80) / counts.length;
    const pad = barW * 0.2;
    const chartH = h - 60;

    counts.forEach((c, i) => {
      const x = 40 + i * barW + pad;
      const ch = (c.count / max) * (chartH - 20);
      const y = chartH - ch;
      ctx.fillStyle = c.color;
      const rad = 4;
      ctx.beginPath();
      ctx.roundRect(x, y, barW - pad * 2, ch, [rad, rad, 0, 0]);
      ctx.fill();
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() || '#a0a0c0';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(c.name, x + barW / 2 - pad, chartH + 16);
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text').trim() || '#e0e0f0';
      ctx.font = 'bold 12px Inter';
      ctx.fillText(c.count, x + barW / 2 - pad, y - 6);
    });
  },
  renderStatusChart(tickets) {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);
    const w = rect.width, h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const statusColors = {
      'Aperto': '#60a5fa',
      'In Lavorazione': '#fbbf24',
      'Risolto': '#4ade80',
      'Chiuso': '#a0a0c0'
    };
    const counts = STATUSES.map(s => ({ label: s, count: tickets.filter(t => t.status === s).length, color: statusColors[s] }));
    const total = counts.reduce((s, c) => s + c.count, 0) || 1;
    const cx = w / 2, cy = h / 2, radius = Math.min(w, h) / 2 - 40;
    let startAngle = -Math.PI / 2;

    counts.forEach(c => {
      if (c.count === 0) return;
      const angle = (c.count / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, startAngle + angle);
      ctx.closePath();
      ctx.fillStyle = c.color;
      ctx.fill();
      if (angle > 0.3) {
        const mid = startAngle + angle / 2;
        const lx = cx + Math.cos(mid) * (radius * 0.65);
        const ly = cy + Math.sin(mid) * (radius * 0.65);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.count, lx, ly);
      }
      startAngle += angle;
    });
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-card').trim() || '#1a1a3e';
    ctx.fill();

    const legendY = h - 18;
    let lx = 20;
    counts.forEach(c => {
      if (c.count === 0) return;
      ctx.fillStyle = c.color;
      ctx.fillRect(lx, legendY - 8, 10, 10);
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() || '#a0a0c0';
      ctx.font = '10px Inter';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.label, lx + 14, legendY - 3);
      lx += ctx.measureText(c.label).width + 30;
    });
  },
  renderRecentTickets(tickets) {
    const el = document.getElementById('recentTickets');
    const recent = tickets.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
    if (recent.length === 0) { el.innerHTML = '<p class="empty-state">Nessun ticket recente</p>'; return; }
    el.innerHTML = recent.map(t => {
      const cat = getCategory(t.category);
      const user = getUser(t.createdBy);
      return `<div class="ticket-item" onclick="tickets.showDetail('${t.id}')">
        <div class="ticket-priority priority-${t.priority}"></div>
        <div class="ticket-info">
          <h4>${t.title}</h4>
          <div class="ticket-meta">
            <span><i class="fas ${cat.icon}" style="color:${cat.color}"></i> ${cat.name}</span>
            <span><i class="fas fa-user"></i> ${user ? user.name : 'Sconosciuto'}</span>
            ${t.sede ? `<span><i class="fas fa-building"></i> ${t.sede}</span>` : ''}
            <span><i class="fas fa-clock"></i> ${this.timeAgo(t.createdAt)}</span>
            <span class="badge badge-${t.status.toLowerCase().replace(/\s+/g, '')}">${t.status}</span>
            <span class="badge badge-${t.priority.toLowerCase()}">${t.priority}</span>
          </div>
        </div>
      </div>`;
    }).join('');
  },
  timeAgo(ts) {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return mins + 'm fa';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h fa';
    const days = Math.floor(hrs / 24);
    if (days < 30) return days + 'g fa';
    return Math.floor(days / 30) + 'M fa';
  },
  setTheme(name) {
    document.documentElement.setAttribute('data-theme', name);
    setTheme(name);
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === name));
    app.toast(`Tema "${THEMES[name].name}" applicato`, 'success');
  },
  setBgColor(color) { setBg(color); app.applyBg(); },
  setBgGradient(val) { setBg(val); app.applyBg(); },
  resetBg() { setBg(null); app.applyBg(); app.toast('Sfondo reimpostato', 'info'); },
  renderCustomizePanel() {
    const grid = document.getElementById('cThemeGrid');
    if (grid) {
      grid.innerHTML = Object.entries(THEMES).map(([k, v]) =>
        `<button class="theme-btn ${getTheme() === k ? 'active' : ''}" data-theme="${k}" onclick="dashboard.setTheme('${k}')" style="--c1:${v.primary};--c2:${v.secondary}"><span></span></button>`
      ).join('');
    }
    const presets = document.getElementById('cBgPresets');
    if (presets) {
      presets.innerHTML = [
        '135deg,#667eea,#764ba2', '135deg,#2193b0,#6dd5ed', '135deg,#f12711,#f5af19',
        '135deg,#134e5e,#71b280', '135deg,#0f0c29,#302b63', '135deg,#d4145a,#3bbdc7'
      ].map(g => `<button class="bg-preset" style="background:linear-gradient(${g})" onclick="dashboard.setBgGradient('${g}')"></button>`).join('');
    }
  }
};

const tickets = {
  render() {
    this.applyFilters();
  },
  getAll() {
    let list = [...getTickets()];
    if (currentUser.role !== 'admin') {
      list = list.filter(t => t.createdBy === currentUser.id || t.assignedTo === currentUser.id);
    }
    return list;
  },
  applyFilters() {
    const cat = document.getElementById('filterCategory').value;
    const status = document.getElementById('filterStatus').value;
    const priority = document.getElementById('filterPriority').value;
    const sede = document.getElementById('filterSede').value;
    const search = (document.getElementById('ticketSearch').value || '').toLowerCase();
    let list = this.getAll();
    if (cat) list = list.filter(t => t.category === cat);
    if (status) list = list.filter(t => t.status === status);
    if (priority) list = list.filter(t => t.priority === priority);
    if (sede) list = list.filter(t => t.sede === sede);
    if (search) list = list.filter(t => t.title.toLowerCase().includes(search) || t.description.toLowerCase().includes(search));
    list.sort((a, b) => b.createdAt - a.createdAt);
    this.renderList(list);
  },
  renderList(list) {
    const el = document.getElementById('ticketsList');
    if (!list.length) { el.innerHTML = '<p class="empty-state">Nessun ticket trovato</p>'; return; }
    el.innerHTML = list.map(t => {
      const cat = getCategory(t.category);
      const user = getUser(t.createdBy);
      const assignee = getUser(t.assignedTo);
      return `<div class="ticket-item" onclick="tickets.showDetail('${t.id}')">
        <div class="ticket-priority priority-${t.priority}"></div>
        <div class="ticket-info">
          <h4>${t.title}</h4>
          <div class="ticket-meta">
            <span><i class="fas ${cat.icon}" style="color:${cat.color}"></i> ${cat.name}</span>
            <span><i class="fas fa-user"></i> ${user ? user.name : 'Sconosciuto'}</span>
            ${t.sede ? `<span><i class="fas fa-building"></i> ${t.sede}</span>` : ''}
            ${assignee ? `<span><i class="fas fa-user-check"></i> ${assignee.name}</span>` : ''}
            <span><i class="fas fa-clock"></i> ${dashboard.timeAgo(t.createdAt)}</span>
            <span class="badge badge-${t.status.toLowerCase().replace(/\s+/g, '')}">${t.status}</span>
            <span class="badge badge-${t.priority.toLowerCase()}">${t.priority}</span>
          </div>
        </div>
        <div class="ticket-actions">
          ${currentUser.role === 'admin' ? `<button class="delete-btn" onclick="event.stopPropagation();tickets.delete('${t.id}')"><i class="fas fa-trash"></i></button>` : ''}
        </div>
      </div>`;
    }).join('');
  },
  prepareForm() {
    document.getElementById('ticketForm').reset();
    app.populateAssignees();
    const sedeSel = document.getElementById('ticketSede');
    if (sedeSel) {
      sedeSel.innerHTML = '<option value="">Seleziona sede</option>' + getSedi().map(s => `<option value="${s}" ${currentUser.sede === s ? 'selected' : ''}>${s}</option>`).join('');
      if (currentUser.role === 'admin') sedeSel.value = '';
      else sedeSel.value = currentUser.sede || '';
    }
    if (currentUser.role === 'admin') {
      document.getElementById('ticketAssignee').closest('.form-group').style.display = 'block';
    } else {
      document.getElementById('ticketAssignee').closest('.form-group').style.display = 'none';
    }
  },
  create(e) {
    e.preventDefault();
    const title = document.getElementById('ticketTitle').value.trim();
    const category = document.getElementById('ticketCategory').value;
    const priority = document.getElementById('ticketPriority').value;
    const description = document.getElementById('ticketDescription').value.trim();
    let sede = document.getElementById('ticketSede').value;
    let assignedTo = document.getElementById('ticketAssignee').value;
    if (currentUser.role !== 'admin') {
      assignedTo = '';
      sede = currentUser.sede || '';
    }
    if (!title || !description) { app.toast('Compila tutti i campi obbligatori', 'error'); return; }
    const ticket = {
      id: uid(),
      title, description, category, priority, sede,
      status: 'Aperto',
      createdBy: currentUser.id,
      assignedTo,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: []
    };
    const list = getTickets();
    list.unshift(ticket);
    setTickets(list);
    app.toast('Ticket creato con successo!', 'success');
    if (currentUser.role !== 'admin') notify.sendTicketAlert(ticket);
    app.navigate('tickets');
  },
  showDetail(id) {
    const t = getTickets().find(x => x.id === id);
    if (!t) return;
    const cat = getCategory(t.category);
    const user = getUser(t.createdBy);
    const assignee = getUser(t.assignedTo);
    const body = document.getElementById('ticketDetailBody');
    const commentsHtml = t.comments.map(c =>
      `<div class="comment">
        <div class="comment-header">
          <span class="comment-user"><i class="fas fa-user-circle"></i> ${getUserName(c.userId)}</span>
          <span class="comment-date">${dashboard.timeAgo(c.date)}</span>
        </div>
        <div class="comment-text">${c.text}</div>
      </div>`
    ).join('') || '<p style="color:var(--text-secondary);font-size:0.85rem">Nessun commento</p>';

    body.innerHTML = `
      <div class="ticket-detail">
        <div class="ticket-detail-header">
          <h2 style="font-size:1.2rem">${t.title}</h2>
          <span class="badge badge-${t.status.toLowerCase().replace(/\s+/g, '')}" style="font-size:0.8rem;padding:0.3rem 0.8rem">${t.status}</span>
        </div>
        <div class="ticket-detail-meta">
          <span><i class="fas ${cat.icon}" style="color:${cat.color}"></i> ${cat.name}</span>
          <span class="badge badge-${t.priority.toLowerCase()}"><i class="fas fa-flag"></i> ${t.priority}</span>
          <span><i class="fas fa-user"></i> ${user ? user.name : 'Sconosciuto'}</span>
          ${t.sede ? `<span><i class="fas fa-building"></i> ${t.sede}</span>` : ''}
          ${assignee ? `<span><i class="fas fa-user-check"></i> Assegnato: ${assignee.name}</span>` : '<span style="color:var(--text-secondary)"><i class="fas fa-user-times"></i> Non assegnato</span>'}
        </div>
        <div class="ticket-detail-body">
          <p>${t.description}</p>
        </div>
        <div class="ticket-detail-actions">
          ${currentUser.role === 'admin' ? `
            <select id="detailStatus" onchange="tickets.updateStatus('${t.id}', this.value)" style="width:auto;min-width:150px">
              ${STATUSES.map(s => `<option value="${s}" ${t.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
            <select id="detailAssignee" onchange="tickets.updateAssignee('${t.id}', this.value)" style="width:auto;min-width:150px">
              <option value="">Non assegnato</option>
              ${getUsers().map(u => `<option value="${u.id}" ${t.assignedTo === u.id ? 'selected' : ''}>${u.name}</option>`).join('')}
            </select>
          ` : ''}
        </div>
        <div class="comments-section">
          <h4><i class="fas fa-comments"></i> Commenti (${t.comments.length})</h4>
          ${commentsHtml}
          <div class="comment-form">
            <input type="text" id="commentInput" placeholder="Scrivi un commento..." onkeydown="if(event.key==='Enter')tickets.addComment('${t.id}')">
            <button class="btn btn-primary btn-sm" onclick="tickets.addComment('${t.id}')"><i class="fas fa-paper-plane"></i></button>
          </div>
        </div>
      </div>`;
    document.getElementById('modalTicketTitle').textContent = 'Dettaglio Ticket';
    app.showModal('ticketDetailModal');
  },
  updateStatus(id, status) {
    const list = getTickets();
    const t = list.find(x => x.id === id);
    if (!t) return;
    t.status = status;
    t.updatedAt = Date.now();
    setTickets(list);
    app.toast(`Stato aggiornato a "${status}"`, 'success');
    dashboard.render();
    tickets.applyFilters();
  },
  updateAssignee(id, userId) {
    const list = getTickets();
    const t = list.find(x => x.id === id);
    if (!t) return;
    t.assignedTo = userId;
    t.updatedAt = Date.now();
    setTickets(list);
    const name = userId ? getUser(userId).name : 'nessuno';
    app.toast(`Ticket assegnato a ${name}`, 'success');
    tickets.applyFilters();
  },
  addComment(id) {
    const input = document.getElementById('commentInput');
    if (!input || !input.value.trim()) return;
    const list = getTickets();
    const t = list.find(x => x.id === id);
    if (!t) return;
    t.comments.push({ id: uid(), userId: currentUser.id, text: input.value.trim(), date: Date.now() });
    t.updatedAt = Date.now();
    setTickets(list);
    input.value = '';
    app.toast('Commento aggiunto', 'success');
    this.showDetail(id);
  },
  delete(id) {
    if (!app.confirm('Eliminare definitivamente questo ticket?')) return;
    const list = getTickets().filter(t => t.id !== id);
    setTickets(list);
    app.toast('Ticket eliminato', 'success');
    dashboard.render();
    this.applyFilters();
  }
};

const users = {
  render() {
    if (currentUser.role !== 'admin') return;
    const list = getUsers();
    const el = document.getElementById('usersList');
    el.innerHTML = `<div class="users-grid">${list.map(u => `
      <div class="user-card">
        <div class="user-card-avatar">${u.name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0,2)}</div>
        <div class="user-card-info">
          <h4>${u.name}</h4>
          <p><i class="fas fa-user${u.role === 'admin' ? '-shield' : ''}"></i> ${u.role === 'admin' ? 'Administrator' : 'User'} &middot; @${u.username}</p>
          ${u.sede ? `<p style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px"><i class="fas fa-building"></i> ${u.sede}</p>` : ''}
        </div>
        <div class="user-card-actions">
          <button onclick="users.edit('${u.id}')" title="Modifica"><i class="fas fa-edit"></i></button>
          <button class="delete-user" onclick="users.delete('${u.id}')" title="Elimina"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join('')}</div>`;
  },
  openModal(data) {
    document.getElementById('userId').value = data ? data.id : '';
    document.getElementById('editUserName').value = data ? data.name : '';
    document.getElementById('editUserUsername').value = data ? data.username : '';
    document.getElementById('editUserPassword').value = '';
    document.getElementById('editUserRole').value = data ? data.role : 'user';
    const sedeSel = document.getElementById('editUserSede');
    if (sedeSel) {
      sedeSel.innerHTML = '<option value="">Nessuna sede</option>' + getSedi().map(s => `<option value="${s}" ${data && data.sede === s ? 'selected' : ''}>${s}</option>`).join('');
      if (data) sedeSel.value = data.sede || '';
    }
    document.getElementById('userModalTitle').textContent = data ? 'Modifica Utente' : 'Nuovo Utente';
    app.showModal('userModal');
  },
  edit(id) {
    const u = getUser(id);
    if (!u) return;
    this.openModal(u);
  },
  save(e) {
    e.preventDefault();
    const id = document.getElementById('userId').value;
    const name = document.getElementById('editUserName').value.trim();
    const username = document.getElementById('editUserUsername').value.trim();
    const password = document.getElementById('editUserPassword').value.trim();
    const role = document.getElementById('editUserRole').value;
    const sede = document.getElementById('editUserSede').value;
    if (!name || !username) { app.toast('Compila tutti i campi', 'error'); return; }
    const list = getUsers();
    if (id) {
      const idx = list.findIndex(u => u.id === id);
      if (idx === -1) return;
      if (password) list[idx].password = password;
      list[idx].name = name;
      list[idx].username = username;
      list[idx].role = role;
      list[idx].sede = sede;
      list[idx].avatar = list[idx].avatar || '';
      app.toast('Utente aggiornato', 'success');
    } else {
      if (!password) { app.toast('Password richiesta', 'error'); return; }
      if (list.find(u => u.username === username)) { app.toast('Username già esistente', 'error'); return; }
      list.push({ id: uid(), username, password, name, role, sede });
      app.toast('Utente creato', 'success');
    }
    setUsers(list);
    app.closeModal('userModal');
    this.render();
    app.populateSelects();
  },
  delete(id) {
    if (id === currentUser.id) { app.toast('Non puoi eliminare te stesso', 'error'); return; }
    if (!app.confirm('Eliminare questo utente?')) return;
    const list = getUsers().filter(u => u.id !== id);
    setUsers(list);
    app.toast('Utente eliminato', 'success');
    this.render();
    app.populateSelects();
  }
};

const notify = {
  init() {
    const cfg = getEmailCfg();
    if (cfg.key) {
      try { emailjs.init(cfg.key); } catch(e) {}
    }
    this.updateBadge();
  },
  updateBadge() {
    const badge = document.getElementById('notifBadge');
    if (!badge) return;
    const unread = getNotifs().filter(n => !n.read).length;
    badge.textContent = unread;
    badge.classList.toggle('hidden', unread === 0);
  },
  add(title, msg, type = 'info') {
    const list = getNotifs();
    list.unshift({ id: uid(), title, msg, type, date: Date.now(), read: false });
    setNotifs(list.slice(0, 100));
    this.updateBadge();
  },
  async sendTicketAlert(ticket) {
    const cfg = getEmailCfg();
    if (!cfg.key || !cfg.service || !cfg.template || !cfg.to) {
      this.add('Notifica non inviata', 'Configura EmailJS nelle Impostazioni per ricevere email', 'warning');
      return;
    }
    try {
      const ipResp = await fetch('https://api.ipify.org?format=json').catch(() => ({ json: () => ({ ip: 'N/D' }) }));
      const ipData = await ipResp.json();
      const clientIP = ipData.ip || 'N/D';
      const user = getUser(ticket.createdBy);
      const cat = getCategory(ticket.category);
      const now = new Date();
      const dateStr = now.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      const admins = getUsers().filter(u => u.role === 'admin');
      const templateParams = {
        to_name: admins.map(a => a.name).join(', '),
        to_email: cfg.to,
        from_name: user ? user.name : 'Sconosciuto',
        from_sede: ticket.sede || 'N/D',
        from_ip: clientIP,
        ticket_title: ticket.title,
        ticket_category: cat.name,
        ticket_priority: ticket.priority,
        ticket_description: ticket.description,
        ticket_date: dateStr,
        message: `Nuovo ticket da ${user ? user.name : 'Sconosciuto'} (${ticket.sede || 'N/D'}, IP: ${clientIP})`
      };
      await emailjs.send(cfg.service, cfg.template, templateParams);
      this.add('Email inviata', `Notifica ticket "${ticket.title}" inviata a ${cfg.to}`, 'success');
    } catch (err) {
      this.add('Errore invio email', err.text || err.message || 'Errore sconosciuto', 'error');
    }
  },
  renderModal() {
    const list = getNotifs();
    const body = document.getElementById('notifBody');
    if (!list.length) { body.innerHTML = '<p class="empty-state">Nessuna notifica</p>'; return; }
    body.innerHTML = list.map(n => `
      <div class="ticket-item" style="opacity:${n.read ? 0.6 : 1}">
        <div class="ticket-priority" style="background:${n.type === 'error' ? 'var(--danger)' : n.type === 'warning' ? 'var(--warning)' : 'var(--success)'};width:4px;min-height:40px;border-radius:2px"></div>
        <div class="ticket-info">
          <h4>${n.title}</h4>
          <div class="ticket-meta">
            <span>${n.msg}</span>
            <span><i class="fas fa-clock"></i> ${dashboard.timeAgo(n.date)}</span>
          </div>
        </div>
      </div>
    `).join('');
    setNotifs(list.map(n => { n.read = true; return n; }));
    this.updateBadge();
  }
};

window.auth = auth;
window.app = app;
window.chat = chat;
window.dashboard = dashboard;
window.tickets = tickets;
window.users = users;
window.notify = notify;

auth.startBgRotation();

})();
