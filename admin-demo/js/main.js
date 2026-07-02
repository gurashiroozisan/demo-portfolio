const SESSION_KEY = 'adminPanelSession';
const DEMO_EMAIL = 'admin@demo.jp';
const DEMO_PASSWORD = 'password123';

const STATUS_LABELS = {
  active: { text: 'アクティブ', class: 'status--active' },
  pending: { text: '保留中', class: 'status--pending' },
  inactive: { text: '無効', class: 'status--inactive' },
};

let users = [
  { id: 1, name: '山田 太郎', email: 'taro@example.com', role: '管理者', status: 'active', joined: '2025-11-02' },
  { id: 2, name: '佐藤 花子', email: 'hanako@example.com', role: '編集者', status: 'active', joined: '2025-12-15' },
  { id: 3, name: '鈴木 一郎', email: 'ichiro@example.com', role: '閲覧者', status: 'pending', joined: '2026-01-08' },
  { id: 4, name: '田中 美咲', email: 'misaki@example.com', role: '編集者', status: 'active', joined: '2026-02-20' },
  { id: 5, name: '高橋 健太', email: 'kenta@example.com', role: '閲覧者', status: 'inactive', joined: '2026-03-05' },
  { id: 6, name: '伊藤 さくら', email: 'sakura@example.com', role: '編集者', status: 'active', joined: '2026-03-28' },
];

const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const usersBody = document.getElementById('usersBody');
const recentUsersBody = document.getElementById('recentUsersBody');
const modalOverlay = document.getElementById('modalOverlay');
const editForm = document.getElementById('editForm');
const pageTitle = document.getElementById('pageTitle');
const pageSub = document.getElementById('pageSub');

const views = {
  dashboard: document.getElementById('viewDashboard'),
  users: document.getElementById('viewUsers'),
  settings: document.getElementById('viewSettings'),
};

const viewMeta = {
  dashboard: { title: 'ダッシュボード', sub: '概要・統計情報' },
  users: { title: 'ユーザー管理', sub: 'ユーザーの一覧・編集' },
  settings: { title: '設定', sub: 'システム設定' },
};

function statusBadge(status) {
  const s = STATUS_LABELS[status] || STATUS_LABELS.inactive;
  return `<span class="status ${s.class}">${s.text}</span>`;
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${y}/${m}/${d}`;
}

function renderUsersTable(tbody, compact = false) {
  tbody.innerHTML = users.map((u) => {
    const cols = compact
      ? `<td>${u.name}</td><td>${u.email}</td><td>${statusBadge(u.status)}</td><td>${formatDate(u.joined)}</td>`
      : `<td>${u.id}</td><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td><td>${statusBadge(u.status)}</td><td>${formatDate(u.joined)}</td><td><button class="btn-edit" data-id="${u.id}">編集</button></td>`;
    return `<tr>${cols}</tr>`;
  }).join('');
}

function updateStats() {
  const active = users.filter((u) => u.status === 'active').length;
  const pending = users.filter((u) => u.status === 'pending').length;
  document.getElementById('statUsers').textContent = users.length;
  document.getElementById('statActive').textContent = active;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('userCount').textContent = `${users.length} 件`;
}

function renderAll() {
  renderUsersTable(usersBody);
  renderUsersTable(recentUsersBody, true);
  updateStats();
}

function showView(name) {
  Object.entries(views).forEach(([key, el]) => {
    el.hidden = key !== name;
  });
  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.view === name);
  });
  pageTitle.textContent = viewMeta[name].title;
  pageSub.textContent = viewMeta[name].sub;
}

function saveSession(email) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email, loggedInAt: Date.now() }));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function showDashboard(email) {
  loginScreen.hidden = true;
  dashboard.hidden = false;
  document.getElementById('userEmail').textContent = email;
  document.getElementById('userAvatar').textContent = email.charAt(0).toUpperCase();
  renderAll();
  showView('dashboard');
}

function showLogin() {
  loginScreen.hidden = false;
  dashboard.hidden = true;
  loginForm.reset();
  loginError.hidden = true;
}

function openModal(id) {
  const user = users.find((u) => u.id === id);
  if (!user) return;
  document.getElementById('editId').value = user.id;
  document.getElementById('editName').value = user.name;
  document.getElementById('editEmail').value = user.email;
  document.getElementById('editRole').value = user.role;
  document.getElementById('editStatus').value = user.status;
  modalOverlay.hidden = false;
}

function closeModal() {
  modalOverlay.hidden = true;
  editForm.reset();
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    saveSession(email);
    showDashboard(email);
  } else {
    loginError.hidden = false;
  }
});

logoutBtn.addEventListener('click', () => {
  clearSession();
  showLogin();
});

document.querySelectorAll('.nav-item').forEach((btn) => {
  btn.addEventListener('click', () => showView(btn.dataset.view));
});

document.querySelectorAll('[data-goto]').forEach((btn) => {
  btn.addEventListener('click', () => showView(btn.dataset.goto));
});

usersBody.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-edit');
  if (btn) openModal(Number(btn.dataset.id));
});

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = Number(document.getElementById('editId').value);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return;

  users[idx] = {
    ...users[idx],
    name: document.getElementById('editName').value.trim(),
    email: document.getElementById('editEmail').value.trim(),
    role: document.getElementById('editRole').value,
    status: document.getElementById('editStatus').value,
  };

  renderAll();
  closeModal();
});

const session = getSession();
if (session?.email) {
  showDashboard(session.email);
} else {
  showLogin();
}
