// Demo sales data — 3 stores, 6 months
const DEMO_DATA = [
  { date: '2025-10-03', store: '渋谷店', category: 'カット', amount: 5500 },
  { date: '2025-10-05', store: '池袋店', category: 'カラー', amount: 8800 },
  { date: '2025-10-08', store: '横浜店', category: 'カット', amount: 5500 },
  { date: '2025-10-12', store: '渋谷店', category: 'パーマ', amount: 13200 },
  { date: '2025-10-15', store: '池袋店', category: 'トリートメント', amount: 5500 },
  { date: '2025-10-18', store: '横浜店', category: 'カラー', amount: 9900 },
  { date: '2025-10-22', store: '渋谷店', category: 'カット', amount: 5500 },
  { date: '2025-10-25', store: '池袋店', category: 'カット', amount: 5500 },
  { date: '2025-10-28', store: '横浜店', category: 'パーマ', amount: 14300 },
  { date: '2025-11-02', store: '渋谷店', category: 'カラー', amount: 8800 },
  { date: '2025-11-06', store: '池袋店', category: 'カット', amount: 5500 },
  { date: '2025-11-10', store: '横浜店', category: 'カット', amount: 5500 },
  { date: '2025-11-14', store: '渋谷店', category: 'トリートメント', amount: 5500 },
  { date: '2025-11-18', store: '池袋店', category: 'カラー', amount: 9900 },
  { date: '2025-11-22', store: '横浜店', category: 'カット', amount: 5500 },
  { date: '2025-11-26', store: '渋谷店', category: 'パーマ', amount: 13200 },
  { date: '2025-11-29', store: '池袋店', category: 'パーマ', amount: 14300 },
  { date: '2025-12-03', store: '横浜店', category: 'カラー', amount: 8800 },
  { date: '2025-12-07', store: '渋谷店', category: 'カット', amount: 5500 },
  { date: '2025-12-11', store: '池袋店', category: 'カット', amount: 5500 },
  { date: '2025-12-15', store: '横浜店', category: 'トリートメント', amount: 5500 },
  { date: '2025-12-19', store: '渋谷店', category: 'カラー', amount: 9900 },
  { date: '2025-12-22', store: '池袋店', category: 'カラー', amount: 8800 },
  { date: '2025-12-26', store: '横浜店', category: 'カット', amount: 5500 },
  { date: '2025-12-28', store: '渋谷店', category: 'パーマ', amount: 14300 },
  { date: '2026-01-05', store: '池袋店', category: 'カット', amount: 5500 },
  { date: '2026-01-08', store: '横浜店', category: 'カラー', amount: 8800 },
  { date: '2026-01-12', store: '渋谷店', category: 'カット', amount: 5500 },
  { date: '2026-01-15', store: '池袋店', category: 'パーマ', amount: 13200 },
  { date: '2026-01-18', store: '横浜店', category: 'カット', amount: 5500 },
  { date: '2026-01-22', store: '渋谷店', category: 'トリートメント', amount: 5500 },
  { date: '2026-01-25', store: '池袋店', category: 'カラー', amount: 9900 },
  { date: '2026-02-02', store: '横浜店', category: 'パーマ', amount: 14300 },
  { date: '2026-02-06', store: '渋谷店', category: 'カラー', amount: 8800 },
  { date: '2026-02-10', store: '池袋店', category: 'カット', amount: 5500 },
  { date: '2026-02-14', store: '横浜店', category: 'カット', amount: 5500 },
  { date: '2026-02-18', store: '渋谷店', category: 'パーマ', amount: 13200 },
  { date: '2026-02-22', store: '池袋店', category: 'トリートメント', amount: 5500 },
  { date: '2026-02-26', store: '横浜店', category: 'カラー', amount: 9900 },
  { date: '2026-03-03', store: '渋谷店', category: 'カット', amount: 5500 },
  { date: '2026-03-07', store: '池袋店', category: 'カラー', amount: 8800 },
  { date: '2026-03-11', store: '横浜店', category: 'パーマ', amount: 14300 },
];

let records = [];
let monthlyChart, categoryChart, storeChart;

const fmt = (n) => '¥' + n.toLocaleString('ja-JP');
const monthKey = (d) => d.slice(0, 7);

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
  const count = data.length;
  const stores = new Set(data.map(r => r.store)).size;
  const avg = count ? Math.round(total / count) : 0;

  document.getElementById('kpiTotal').textContent = fmt(total);
  document.getElementById('kpiCount').textContent = count;
  document.getElementById('kpiAvg').textContent = fmt(avg);
  document.getElementById('kpiStores').textContent = stores;
  document.getElementById('kpiTotalChange').textContent = '前月比 +12.4%（デモ）';

  const monthly = {};
  data.forEach(r => {
    const m = monthKey(r.date);
    monthly[m] = (monthly[m] || 0) + r.amount;
  });
  const months = Object.keys(monthly).sort();

  const cats = {};
  data.forEach(r => { cats[r.category] = (cats[r.category] || 0) + r.amount; });

  const storesMap = {};
  data.forEach(r => { storesMap[r.store] = (storesMap[r.store] || 0) + r.amount; });

  updateCharts(months, monthly, cats, storesMap);
  updateTable(data);
  updateMonthFilter(months);
}

function updateCharts(months, monthly, cats, stores) {
  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { labels: { color: '#8892A8', font: { size: 11 } } } },
    scales: {
      x: { ticks: { color: '#8892A8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#8892A8', callback: v => '¥' + (v / 1000) + 'k' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  if (monthlyChart) monthlyChart.destroy();
  monthlyChart = new Chart(document.getElementById('monthlyChart'), {
    type: 'bar',
    data: {
      labels: months.map(m => m.replace('-', '/')),
      datasets: [{ label: '売上', data: months.map(m => monthly[m]), backgroundColor: '#3B82F6', borderRadius: 4 }]
    },
    options: chartDefaults
  });

  if (categoryChart) categoryChart.destroy();
  categoryChart = new Chart(document.getElementById('categoryChart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(cats),
      datasets: [{ data: Object.values(cats), backgroundColor: ['#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6'] }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#8892A8', font: { size: 11 } } } } }
  });

  if (storeChart) storeChart.destroy();
  storeChart = new Chart(document.getElementById('storeChart'), {
    type: 'bar',
    data: {
      labels: Object.keys(stores),
      datasets: [{ label: '店舗別売上', data: Object.values(stores), backgroundColor: ['#3B82F6', '#22C55E', '#F59E0B'], borderRadius: 4 }]
    },
    options: { ...chartDefaults, indexAxis: 'y' }
  });
}

function updateTable(data) {
  const tbody = document.querySelector('#dataTable tbody');
  const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));
  tbody.innerHTML = sorted.slice(0, 50).map(r =>
    `<tr><td>${r.date}</td><td>${r.store}</td><td>${r.category}</td><td>${fmt(r.amount)}</td></tr>`
  ).join('');
}

function updateMonthFilter(months) {
  const sel = document.getElementById('monthFilter');
  sel.innerHTML = '<option value="all">全期間</option>' +
    months.map(m => `<option value="${m}">${m.replace('-', '年')}月</option>`).join('');
  sel.disabled = false;
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const header = lines[0].split(',').map(h => h.trim());
  const dateIdx = header.findIndex(h => /日付|date/i.test(h));
  const storeIdx = header.findIndex(h => /店舗|store/i.test(h));
  const catIdx = header.findIndex(h => /カテゴリ|category|種別/i.test(h));
  const amtIdx = header.findIndex(h => /金額|amount|売上/i.test(h));

  if (dateIdx < 0 || amtIdx < 0) {
    alert('CSVには「日付」「金額」列が必要です。\n例: 日付,店舗,カテゴリ,金額');
    return null;
  }

  return lines.slice(1).filter(l => l.trim()).map(line => {
    const cols = line.split(',').map(c => c.trim());
    return {
      date: cols[dateIdx],
      store: storeIdx >= 0 ? cols[storeIdx] : '不明',
      category: catIdx >= 0 ? cols[catIdx] : 'その他',
      amount: parseInt(cols[amtIdx].replace(/[^0-9]/g, ''), 10) || 0
    };
  }).filter(r => r.amount > 0);
}

document.getElementById('runDemo').addEventListener('click', () => {
  records = [...DEMO_DATA];
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
  const filtered = val === 'all' ? records : records.filter(r => monthKey(r.date) === val);
  aggregate(filtered);
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const header = '日付,店舗,カテゴリ,金額\n';
  const rows = records.map(r => `${r.date},${r.store},${r.category},${r.amount}`).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sales_report_demo.csv';
  a.click();
});
