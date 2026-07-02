const STORAGE_KEY = 'crm-lite-customers';

const DEFAULT_CUSTOMERS = [
  { id: '1', name: '田中 美咲', company: '株式会社ブルーム', status: '商談中', followUp: '2026-07-05', memo: 'パンフレット送付済み。来週デモ予定。' },
  { id: '2', name: '佐藤 健太', company: 'サロン・アール', status: '成約', followUp: '2026-08-12', memo: '年間契約。四半期レビュー実施。' },
  { id: '3', name: '鈴木 由美', company: '個人', status: 'リード', followUp: '2026-07-03', memo: '展示会で名刺交換。初回ヒアリング待ち。' },
  { id: '4', name: '高橋 誠', company: 'テック商事', status: '商談中', followUp: '2026-07-04', memo: '見積提出予定。競合比較中とのこと。' },
  { id: '5', name: '伊藤 彩', company: 'LUMIÈRE美容室', status: '成約', followUp: '2026-09-01', memo: '月次メンテナンス契約。満足度高。' },
  { id: '6', name: '渡辺 大輔', company: 'スタートアップ合同会社', status: 'リード', followUp: '2026-07-08', memo: '初回MTG調整中。紹介案件。' },
  { id: '7', name: '中村 真理', company: '和カフェ', status: '休眠', followUp: '2026-03-15', memo: '3ヶ月連絡なし。再アプローチ検討。' },
  { id: '8', name: '小林 翔太', company: '匠リフォーム', status: '商談中', followUp: '2026-07-02', memo: '本日フォロー予定。現場視察後の返答待ち。' },
];

const STATUS_CLASS = {
  'リード': 'badge--lead',
  '商談中': 'badge--active',
  '成約': 'badge--won',
  '休眠': 'badge--dormant',
};

let customers = [];
let currentStatus = 'all';
let searchQuery = '';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function loadCustomers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    customers = saved ? JSON.parse(saved) : [...DEFAULT_CUSTOMERS];
  } catch {
    customers = [...DEFAULT_CUSTOMERS];
  }
}

function saveCustomers() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  } catch { /* optional persistence */ }
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' });
}

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

function isThisWeek(iso) {
  const d = new Date(iso + 'T00:00:00');
  const { monday, sunday } = getWeekRange();
  return d >= monday && d <= sunday;
}

function getDateClass(iso) {
  const d = new Date(iso + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d < today) return 'is-overdue';
  if (isThisWeek(iso)) return 'is-soon';
  return '';
}

function updateKPIs() {
  $('#kpiTotal').textContent = customers.length;
  $('#kpiActive').textContent = customers.filter(c => c.status === '商談中').length;
  $('#kpiFollowUp').textContent = customers.filter(c => isThisWeek(c.followUp)).length;
}

function filterCustomers() {
  const q = searchQuery.toLowerCase();
  return customers.filter(c => {
    const matchStatus = currentStatus === 'all' || c.status === currentStatus;
    const haystack = `${c.name} ${c.company} ${c.memo}`.toLowerCase();
    const matchSearch = !q || haystack.includes(q);
    return matchStatus && matchSearch;
  });
}

function renderTable() {
  const filtered = filterCustomers();
  const tbody = $('#tableBody');
  const empty = $('#emptyState');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    empty.hidden = false;
  } else {
    empty.hidden = true;
    tbody.innerHTML = filtered.map(c => `
      <tr data-id="${c.id}">
        <td><strong>${esc(c.name)}</strong></td>
        <td>${esc(c.company)}</td>
        <td><span class="badge ${STATUS_CLASS[c.status]}">${esc(c.status)}</span></td>
        <td class="date-cell ${getDateClass(c.followUp)}">${formatDate(c.followUp)}</td>
        <td class="memo-cell" title="${esc(c.memo)}">${esc(c.memo)}</td>
        <td><button class="btn--ghost" data-delete="${c.id}" type="button">削除</button></td>
      </tr>
    `).join('');
  }

  $('#resultCount').textContent = `${filtered.length} 件`;
  updateKPIs();
}

function esc(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

function showToast(msg) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => { toast.hidden = true; }, 2800);
}

function openModal() {
  const modal = $('#modal');
  modal.hidden = false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 7);
  $('#addForm').reset();
  $('#addForm [name="followUp"]').value = tomorrow.toISOString().slice(0, 10);
}

function closeModal() {
  $('#modal').hidden = true;
}

// Events
$('#openModal').addEventListener('click', openModal);
$$('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

$('#searchInput').addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  renderTable();
});

$('#statusTabs').addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  $$('#statusTabs .tab').forEach(t => t.classList.remove('is-active'));
  tab.classList.add('is-active');
  currentStatus = tab.dataset.status;
  renderTable();
});

$('#addForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const customer = {
    id: Date.now().toString(),
    name: fd.get('name').trim(),
    company: fd.get('company').trim() || '—',
    status: fd.get('status'),
    followUp: fd.get('followUp'),
    memo: fd.get('memo').trim() || '—',
  };
  customers.unshift(customer);
  saveCustomers();
  closeModal();
  renderTable();
  showToast(`${customer.name} を追加しました（デモ）`);
});

$('#tableBody').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-delete]');
  if (!btn) return;
  const id = btn.dataset.delete;
  const name = customers.find(c => c.id === id)?.name;
  customers = customers.filter(c => c.id !== id);
  saveCustomers();
  renderTable();
  showToast(`${name} を削除しました（デモ）`);
});

loadCustomers();
renderTable();
