const DEMO_DATA = [
  { code: 'P-001', name: 'ボルト M6×20', category: 'ファスナー', stock: 120, minStock: 50, unitPrice: 15, turnover: 'high' },
  { code: 'P-002', name: 'ナット M6', category: 'ファスナー', stock: 8, minStock: 30, unitPrice: 8, turnover: 'high' },
  { code: 'P-003', name: 'ワッシャー M6', category: 'ファスナー', stock: 0, minStock: 20, unitPrice: 5, turnover: 'high' },
  { code: 'P-004', name: '六角レンチ 6mm', category: '工具', stock: 45, minStock: 10, unitPrice: 350, turnover: 'medium' },
  { code: 'P-005', name: 'ドライバーセット', category: '工具', stock: 22, minStock: 5, unitPrice: 2800, turnover: 'low' },
  { code: 'P-006', name: '作業手袋 L', category: '安全用品', stock: 85, minStock: 40, unitPrice: 280, turnover: 'high' },
  { code: 'P-007', name: '安全ヘルメット', category: '安全用品', stock: 12, minStock: 15, unitPrice: 1500, turnover: 'medium' },
  { code: 'P-008', name: '保護メガネ', category: '安全用品', stock: 0, minStock: 10, unitPrice: 450, turnover: 'medium' },
  { code: 'P-009', name: '潤滑油 500ml', category: '消耗品', stock: 34, minStock: 20, unitPrice: 680, turnover: 'high' },
  { code: 'P-010', name: '工業用テープ', category: '消耗品', stock: 56, minStock: 25, unitPrice: 320, turnover: 'high' },
  { code: 'P-011', name: 'ケーブルタイ 200mm', category: '配線部品', stock: 5, minStock: 50, unitPrice: 12, turnover: 'high' },
  { code: 'P-012', name: '結束バンド', category: '配線部品', stock: 18, minStock: 30, unitPrice: 25, turnover: 'medium' },
  { code: 'P-013', name: 'LANケーブル 5m', category: '配線部品', stock: 42, minStock: 15, unitPrice: 890, turnover: 'medium' },
  { code: 'P-014', name: '電源タップ 6口', category: '電気部品', stock: 28, minStock: 10, unitPrice: 1200, turnover: 'low' },
  { code: 'P-015', name: 'ブレーカー 20A', category: '電気部品', stock: 3, minStock: 8, unitPrice: 2400, turnover: 'low' },
  { code: 'P-016', name: 'LED電球 E26', category: '電気部品', stock: 67, minStock: 20, unitPrice: 580, turnover: 'medium' },
  { code: 'P-017', name: '段ボール箱 大', category: '梱包材', stock: 150, minStock: 50, unitPrice: 120, turnover: 'high' },
  { code: 'P-018', name: '緩衝材ロール', category: '梱包材', stock: 9, minStock: 15, unitPrice: 980, turnover: 'medium' },
  { code: 'P-019', name: '梱包テープ', category: '梱包材', stock: 0, minStock: 12, unitPrice: 220, turnover: 'high' },
  { code: 'P-020', name: 'ラベルシール A4', category: '事務用品', stock: 38, minStock: 20, unitPrice: 450, turnover: 'medium' },
];

let records = [];
let categoryChart, turnoverChart;
let currentFilter = 'all';

const fmt = (n) => '¥' + n.toLocaleString('ja-JP');

function isLowStock(item) {
  return item.stock < item.minStock;
}

function isOutOfStock(item) {
  return item.stock === 0;
}

function needsReorder(item) {
  return isLowStock(item);
}

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

function getFilteredData() {
  if (currentFilter === 'reorder') return records.filter(needsReorder);
  return records;
}

function aggregate() {
  const data = getFilteredData();
  const allRecords = records;

  document.getElementById('kpiProducts').textContent = allRecords.length;
  document.getElementById('kpiLow').textContent = allRecords.filter(isLowStock).length;
  document.getElementById('kpiOut').textContent = allRecords.filter(isOutOfStock).length;
  document.getElementById('kpiValue').textContent = fmt(
    allRecords.reduce((s, r) => s + r.stock * r.unitPrice, 0)
  );

  const categoryStock = {};
  allRecords.forEach((r) => {
    categoryStock[r.category] = (categoryStock[r.category] || 0) + r.stock;
  });

  const turnoverCounts = { high: 0, medium: 0, low: 0 };
  allRecords.forEach((r) => { turnoverCounts[r.turnover]++; });

  updateCharts(categoryStock, turnoverCounts);
  updateTable(data);
}

function updateCharts(categoryStock, turnoverCounts) {
  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { labels: { color: '#8892A8', font: { size: 11 } } } },
    scales: {
      x: { ticks: { color: '#8892A8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#8892A8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  if (categoryChart) categoryChart.destroy();
  categoryChart = new Chart(document.getElementById('categoryChart'), {
    type: 'bar',
    data: {
      labels: Object.keys(categoryStock),
      datasets: [{
        label: '在庫数',
        data: Object.values(categoryStock),
        backgroundColor: '#14B8A6',
        borderRadius: 4,
      }],
    },
    options: chartDefaults,
  });

  if (turnoverChart) turnoverChart.destroy();
  turnoverChart = new Chart(document.getElementById('turnoverChart'), {
    type: 'doughnut',
    data: {
      labels: ['高回転', '中回転', '低回転'],
      datasets: [{
        data: [turnoverCounts.high, turnoverCounts.medium, turnoverCounts.low],
        backgroundColor: ['#14B8A6', '#3B82F6', '#8892A8'],
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: '#8892A8', font: { size: 11 } } } },
    },
  });
}

function updateTable(data) {
  const tbody = document.querySelector('#dataTable tbody');
  const sorted = [...data].sort((a, b) => a.stock - b.stock);
  tbody.innerHTML = sorted.map((r) => {
    const out = isOutOfStock(r);
    const low = isLowStock(r);
    const rowClass = out ? 'row--out' : low ? 'row--low' : '';
    const value = r.stock * r.unitPrice;
    return `<tr class="${rowClass}"><td>${r.code}</td><td>${r.name}</td><td>${r.category}</td><td>${r.stock}</td><td>${r.minStock}</td><td>${fmt(r.unitPrice)}</td><td>${fmt(value)}</td></tr>`;
  }).join('');
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const header = lines[0].split(',').map((h) => h.trim());
  const codeIdx = header.findIndex((h) => /コード|code|sku/i.test(h));
  const nameIdx = header.findIndex((h) => /商品名|name|品名/i.test(h));
  const catIdx = header.findIndex((h) => /カテゴリ|category/i.test(h));
  const stockIdx = header.findIndex((h) => /在庫|stock/i.test(h));
  const minIdx = header.findIndex((h) => /最低|min/i.test(h));
  const priceIdx = header.findIndex((h) => /単価|price/i.test(h));

  if (nameIdx < 0 || stockIdx < 0) {
    alert('CSVには「商品名」「在庫数」列が必要です。\n例: 商品コード,商品名,カテゴリ,在庫数,最低在庫,単価');
    return null;
  }

  return lines.slice(1).filter((l) => l.trim()).map((line, i) => {
    const cols = line.split(',').map((c) => c.trim());
    const stock = parseInt(cols[stockIdx], 10) || 0;
    const minStock = minIdx >= 0 ? parseInt(cols[minIdx], 10) || 0 : 10;
    return {
      code: codeIdx >= 0 ? cols[codeIdx] : `P-CSV-${i + 1}`,
      name: cols[nameIdx],
      category: catIdx >= 0 ? cols[catIdx] : 'その他',
      stock,
      minStock,
      unitPrice: priceIdx >= 0 ? parseInt(cols[priceIdx].replace(/[^0-9]/g, ''), 10) || 0 : 100,
      turnover: stock > minStock * 2 ? 'high' : stock > minStock ? 'medium' : 'low',
    };
  });
}

document.getElementById('runDemo').addEventListener('click', () => {
  records = DEMO_DATA.map((r) => ({ ...r }));
  currentFilter = 'all';
  document.getElementById('stockFilter').value = 'all';
  document.getElementById('stockFilter').disabled = false;
  runWithDelay(() => aggregate());
});

document.getElementById('csvInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const parsed = parseCSV(ev.target.result);
    if (!parsed || !parsed.length) return;
    records = parsed;
    currentFilter = 'all';
    document.getElementById('stockFilter').value = 'all';
    document.getElementById('stockFilter').disabled = false;
    runWithDelay(() => aggregate());
  };
  reader.readAsText(file, 'UTF-8');
});

document.getElementById('stockFilter').addEventListener('change', (e) => {
  currentFilter = e.target.value;
  aggregate();
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const header = '商品コード,商品名,カテゴリ,在庫数,最低在庫,単価,評価額\n';
  const rows = records.map((r) =>
    `${r.code},${r.name},${r.category},${r.stock},${r.minStock},${r.unitPrice},${r.stock * r.unitPrice}`
  ).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'inventory_report_demo.csv';
  a.click();
});
