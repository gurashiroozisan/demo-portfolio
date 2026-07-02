const SESSION_KEY = 'memberPortalSession';
const PROFILE_KEY = 'memberPortalProfile';
const DEMO_EMAIL = 'demo@example.com';
const DEMO_PASSWORD = 'demo123';

const ORDERS = [
  { id: 'ORD-2026-0142', product: 'プレミアム会員プラン', date: '2026-06-18', amount: '¥9,800', status: 'paid', statusLabel: '支払い済み' },
  { id: 'ORD-2026-0098', product: 'オリジナルTシャツ', date: '2026-05-02', amount: '¥3,200', status: 'shipped', statusLabel: '発送済み' },
  { id: 'ORD-2026-0031', product: 'デジタルガイドブック', date: '2026-03-15', amount: '¥1,500', status: 'pending', statusLabel: '処理中' },
];

const STATUS_CLASS = {
  paid: 'status--paid',
  shipped: 'status--shipped',
  pending: 'status--pending',
};

const loginScreen = document.getElementById('loginScreen');
const portal = document.getElementById('portal');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const headerUserEmail = document.getElementById('headerUserEmail');
const profileForm = document.getElementById('profileForm');
const ordersBody = document.getElementById('ordersBody');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const checkoutOpenBtn = document.getElementById('checkoutOpenBtn');
const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
const checkoutDoneBtn = document.getElementById('checkoutDoneBtn');
const checkoutStepForm = document.getElementById('checkoutStepForm');
const checkoutStepSuccess = document.getElementById('checkoutStepSuccess');
const paymentForm = document.getElementById('paymentForm');
const successOrderId = document.getElementById('successOrderId');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

const panels = {
  profile: document.getElementById('panelProfile'),
  orders: document.getElementById('panelOrders'),
};

let toastTimer = null;

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

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY));
  } catch {
    return null;
  }
}

function saveProfile(data) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
}

function defaultProfile(email) {
  return {
    name: '山田 太郎',
    email: email || DEMO_EMAIL,
    phone: '090-1234-5678',
  };
}

function loadProfileForm(email) {
  const profile = getProfile() || defaultProfile(email);
  document.getElementById('profileName').value = profile.name;
  document.getElementById('profileEmail').value = profile.email;
  document.getElementById('profilePhone').value = profile.phone || '';
}

function renderOrders() {
  ordersBody.innerHTML = ORDERS.map((o) => `
    <tr>
      <td><code>${o.id}</code></td>
      <td>${o.product}</td>
      <td>${o.date.replace(/-/g, '/')}</td>
      <td>${o.amount}</td>
      <td><span class="status ${STATUS_CLASS[o.status]}">${o.statusLabel}</span></td>
    </tr>
  `).join('');
}

function showTab(name) {
  Object.entries(panels).forEach(([key, el]) => {
    el.hidden = key !== name;
  });
  document.querySelectorAll('.tab').forEach((btn) => {
    const active = btn.dataset.tab === name;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-selected', active);
  });
}

function showPortal(email) {
  loginScreen.hidden = true;
  portal.hidden = false;
  headerUserEmail.textContent = email;
  loadProfileForm(email);
  renderOrders();
  showTab('profile');
}

function showLogin() {
  loginScreen.hidden = false;
  portal.hidden = true;
  closeCheckout();
  loginForm.reset();
  loginError.hidden = true;
}

function showToast(message) {
  toastMessage.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => { toast.hidden = true; }, 300);
  }, 2800);
}

function openCheckout() {
  checkoutStepForm.hidden = false;
  checkoutStepSuccess.hidden = true;
  paymentForm.reset();
  checkoutOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  checkoutOverlay.hidden = true;
  checkoutStepForm.hidden = false;
  checkoutStepSuccess.hidden = true;
  paymentForm.reset();
  document.body.style.overflow = '';
}

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    loginError.hidden = true;
    saveSession(email);
    showPortal(email);
  } else {
    loginError.hidden = false;
  }
});

logoutBtn.addEventListener('click', () => {
  clearSession();
  showLogin();
});

document.querySelectorAll('.tab').forEach((btn) => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
});

profileForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById('profileName').value.trim(),
    email: document.getElementById('profileEmail').value.trim(),
    phone: document.getElementById('profilePhone').value.trim(),
  };
  saveProfile(data);
  headerUserEmail.textContent = data.email;
  showToast('プロフィールを保存しました');
});

checkoutOpenBtn.addEventListener('click', openCheckout);
checkoutCloseBtn.addEventListener('click', closeCheckout);
checkoutDoneBtn.addEventListener('click', closeCheckout);

checkoutOverlay.addEventListener('click', (e) => {
  if (e.target === checkoutOverlay) closeCheckout();
});

document.getElementById('cardNumber').addEventListener('input', (e) => {
  e.target.value = formatCardNumber(e.target.value);
});

document.getElementById('cardExpiry').addEventListener('input', (e) => {
  e.target.value = formatExpiry(e.target.value);
});

document.getElementById('cardCvc').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
});

paymentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const orderId = `ORD-${Date.now().toString().slice(-8)}`;
  successOrderId.textContent = orderId;
  checkoutStepForm.hidden = true;
  checkoutStepSuccess.hidden = false;
});

const session = getSession();
if (session?.email) {
  showPortal(session.email);
} else {
  showLogin();
}
