const CLIENTS = ['株式会社ABC商事', 'XYZ工業株式会社', 'DEF物産', 'GHIテクノロジー', 'JKLサービス'];

const TODAY = '2026-03-15';

const DEMO_DATA = [
  { id: 'INV-2025-001', client: '株式会社ABC商事', issueDate: '2025-10-05', dueDate: '2025-11-05', amount: 330000, paid: true },
  { id: 'INV-2025-002', client: 'XYZ工業株式会社', issueDate: '2025-10-12', dueDate: '2025-11-12', amount: 550000, paid: true },
  { id: 'INV-2025-003', client: 'DEF物産', issueDate: '2025-10-20', dueDate: '2025-11-20', amount: 220000, paid: false },
  { id: 'INV-2025-004', client: 'GHIテクノロジー', issueDate: '2025-11-03', dueDate: '2025-12-03', amount: 880000, paid: true },
  { id: 'INV-2025-005', client: 'JKLサービス', issueDate: '2025-11-10', dueDate: '2025-12-10', amount: 165000, paid: true },
  { id: 'INV-2025-006', client: '株式会社ABC商事', issueDate: '2025-11-18', dueDate: '2025-12-18', amount: 440000, paid: false },
  { id: 'INV-2025-007', client: 'XYZ工業株式会社', issueDate: '2025-12-02', dueDate: '2026-01-02', amount: 660000, paid: true },
  { id: 'INV-2025-008', client: 'DEF物産', issueDate: '2025-12-10', dueDate: '2026-01-10', amount: 275000, paid: false },
  { id: 'INV-2026-009', client: 'GHIテクノロジー', issueDate: '2026-01-08', dueDate: '2026-02-08', amount: 990000, paid: true },
  { id: 'INV-2026-010', client: 'JKLサービス', issueDate: '2026-01-15', dueDate: '2026-02-15', amount: 198000, paid: false },
  { id: 'INV-2026-011', client: '株式会社ABC商事', issueDate: '2026-02-03', dueDate: '2026-03-03', amount: 385000, paid: false },
  { id: 'INV-2026-012', client: 'XYZ工業株式会社', issueDate: '2026-02-10', dueDate: '2026-03-10', amount: 715000, paid: false },
  { id: 'INV-2026-013', client: 'DEF物産', issueDate: '2026-02-18', dueDate: '2026-03-18', amount: 242000, paid: false },
  { id: 'INV-2026-014', client: 'GHIテクノロジー', issueDate: '2026-03-01', dueDate: '2026-04-01', amount: 1100000, paid: false },
  { id: 'INV-2026-015', client: 'JKLサービス', issueDate: '2026-03-08', dueDate: '2026-04-08', amount: 176000, paid: false },
];

let records = [];
let monthlyChart, statusChart, clientChart;

const fmt = (n) => '¥' + n.toLocaleString('ja-JP');
const monthKey = (d) => d.slice(0, 7);

function getStatus(inv) {
  if (inv.paid) return 'paid';
  if (inv.dueDate < TODAY) return 'overdue';
  return 'pending';
}

const STATUS_LABELS = { paid: '入金済', pending: '未入金', overdue: '期限超過' };
const STATUS_BADGE = { paid: 'badge--paid', pending: 'badge--pending', overdue: 'badge--overdue' };

function showLoading(show) {
  document.getElementById('loading').hidden = !show;
  if (show) document.getElementById('dashboard').hidden = true;
}

function runWithDelay(fn) {
  showLoading(true);
  setTimeout(() => {
    fn();
    showLoading(false);
    document.getElementById('dashboard').hidden = false;
  }, 1200);
}

function aggregate(data) {
  const total = data.reduce((s, r) => s + r.amount, 0);
  const paid = data.filter((r) => getStatus(r) === 'paid').reduce((s, r) => s + r.amount, 0);
  const pending = data.filter((r) => getStatus(r) === 'pending').reduce((s, r) => s + r.amount, 0);
  const overdue = data.filter((r) => getStatus(r) === 'overdue').reduce((s, r) => s + r.amount, 0);

  document.getElementById('kpiTotal').textContent = fmt(total);
  document.getElementById('kpiPaid').textContent = fmt(paid);
  document.getElementById('kpiPending').textContent = fmt(pending);
  document.getElementById('kpiOverdue').textContent = fmt(overdue);

  const monthly = {};
  data.forEach((r) => {
    const m = monthKey(r.issueDate);
    monthly[m] = (monthly[m] || 0) + r.amount;
  });
  const months = Object.keys(monthly).sort();

  const statusCounts = { paid: 0, pending: 0, overdue: 0 };
  data.forEach((r) => { statusCounts[getStatus(r)] += r.amount; });

  const clientTotals = {};
  data.forEach((r) => { clientTotals[r.client] = (clientTotals[r.client] || 0) + r.amount; });

  updateCharts(months, monthly, statusCounts, clientTotals);
  updateTable(data);
  updateMonthFilter(months);
}

function updateCharts(months, monthly, statusCounts, clientTotals) {
  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { labels: { color: '#8892A8', font: { size: 11 } } } },
    scales: {
      x: { ticks: { color: '#8892A8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#8892A8', callback: (v) => '¥' + (v / 10000) + '万' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  if (monthlyChart) monthlyChart.destroy();
  monthlyChart = new Chart(document.getElementById('monthlyChart'), {
    type: 'bar',
    data: {
      labels: months.map((m) => m.replace('-', '/')),
      datasets: [{
        label: '請求額',
        data: months.map((m) => monthly[m]),
        backgroundColor: '#F59E0B',
        borderRadius: 4,
      }],
    },
    options: chartDefaults,
  });

  if (statusChart) statusChart.destroy();
  statusChart = new Chart(document.getElementById('statusChart'), {
    type: 'doughnut',
    data: {
      labels: ['入金済', '未入金', '期限超過'],
      datasets: [{
        data: [statusCounts.paid, statusCounts.pending, statusCounts.overdue],
        backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: '#8892A8', font: { size: 11 } } } },
    },
  });

  if (clientChart) clientChart.destroy();
  const clients = Object.keys(clientTotals).sort((a, b) => clientTotals[b] - clientTotals[a]);
  clientChart = new Chart(document.getElementById('clientChart'), {
    type: 'bar',
    data: {
      labels: clients.map((c) => c.replace(/株式会社|有限会社/g, '')),
      datasets: [{
        label: '取引先別請求額',
        data: clients.map((c) => clientTotals[c]),
        backgroundColor: '#F59E0B',
        borderRadius: 4,
      }],
    },
    options: { ...chartDefaults, indexAxis: 'y' },
  });
}

function updateTable(data) {
  const tbody = document.querySelector('#dataTable tbody');
  const sorted = [...data].sort((a, b) => b.issueDate.localeCompare(a.issueDate));
  tbody.innerHTML = sorted.map((r) => {
    const status = getStatus(r);
    return `<tr><td>${r.id}</td><td>${r.client}</td><td>${r.issueDate}</td><td>${r.dueDate}</td><td>${fmt(r.amount)}</td><td><span class="badge ${STATUS_BADGE[status]}">${STATUS_LABELS[status]}</span></td></tr>`;
  }).join('');
}

function updateMonthFilter(months) {
  const sel = document.getElementById('monthFilter');
  sel.innerHTML = '<option value="all">全期間</option>' +
    months.map((m) => `<option value="${m}">${m.replace('-', '年')}月</option>`).join('');
  sel.disabled = false;
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const header = lines[0].split(',').map((h) => h.trim());
  const idIdx = header.findIndex((h) => /請求|invoice|no/i.test(h));
  const clientIdx = header.findIndex((h) => /取引先|client|顧客/i.test(h));
  const issueIdx = header.findIndex((h) => /請求日|発行日|issue/i.test(h));
  const dueIdx = header.findIndex((h) => /期限|due/i.test(h));
  const amtIdx = header.findIndex((h) => /金額|amount/i.test(h));
  const paidIdx = header.findIndex((h) => /入金|paid|ステータス/i.test(h));

  if (clientIdx < 0 || amtIdx < 0) {
    alert('CSVには「取引先」「金額」列が必要です。\n例: 請求No,取引先,請求日,支払期限,金額,入金済');
    return null;
  }

  return lines.slice(1).filter((l) => l.trim()).map((line, i) => {
    const cols = line.split(',').map((c) => c.trim());
    const paidVal = paidIdx >= 0 ? cols[paidIdx] : '';
    const paid = /済|true|1|yes/i.test(paidVal);
    return {
      id: idIdx >= 0 ? cols[idIdx] : `INV-CSV-${i + 1}`,
      client: cols[clientIdx],
      issueDate: issueIdx >= 0 ? cols[issueIdx] : TODAY,
      dueDate: dueIdx >= 0 ? cols[dueIdx] : TODAY,
      amount: parseInt(cols[amtIdx].replace(/[^0-9]/g, ''), 10) || 0,
      paid,
    };
  }).filter((r) => r.amount > 0);
}

document.getElementById('runDemo').addEventListener('click', () => {
  records = DEMO_DATA.map((r) => ({ ...r }));
  runWithDelay(() => aggregate(records));
});

document.getElementById('csvInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const parsed = parseCSV(ev.target.result);
    if (!parsed || !parsed.length) return;
    records = parsed;
    runWithDelay(() => aggregate(records));
  };
  reader.readAsText(file, 'UTF-8');
});

document.getElementById('monthFilter').addEventListener('change', (e) => {
  const val = e.target.value;
  const filtered = val === 'all' ? records : records.filter((r) => monthKey(r.issueDate) === val);
  aggregate(filtered);
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const header = '請求No,取引先,請求日,支払期限,金額,ステータス\n';
  const rows = records.map((r) => {
    const status = STATUS_LABELS[getStatus(r)];
    return `${r.id},${r.client},${r.issueDate},${r.dueDate},${r.amount},${status}`;
  }).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'invoice_report_demo.csv';
  a.click();
});
