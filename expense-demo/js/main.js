const DEMO_CLAIMS = [
  { id: 1, date: '2026-06-28', applicant: '田中 健太', category: '交通費', description: '客先訪問（新宿→品川）', amount: 580, status: 'pending', submitted: '2026-06-28', processedDays: null },
  { id: 2, date: '2026-06-27', applicant: '佐藤 美咲', category: '交際費', description: 'クライアント接待（2名）', amount: 12800, status: 'pending', submitted: '2026-06-27', processedDays: null },
  { id: 3, date: '2026-06-26', applicant: '鈴木 大輔', category: '備品購入', description: 'モニターアーム', amount: 8900, status: 'pending', submitted: '2026-06-26', processedDays: null },
  { id: 4, date: '2026-06-25', applicant: '高橋 由美', category: '通信費', description: '携帯電話利用料（6月分）', amount: 4200, status: 'approved', submitted: '2026-06-25', processedDays: 2 },
  { id: 5, date: '2026-06-24', applicant: '伊藤 誠', category: '交通費', description: '出張（東京→大阪 往復）', amount: 28600, status: 'approved', submitted: '2026-06-24', processedDays: 3 },
  { id: 6, date: '2026-06-22', applicant: '渡辺 花子', category: '会議費', description: '社内打合せ ケータリング', amount: 6500, status: 'approved', submitted: '2026-06-22', processedDays: 1 },
  { id: 7, date: '2026-06-20', applicant: '山本 翔', category: '交通費', description: 'タクシー（終電後帰宅）', amount: 3200, status: 'rejected', submitted: '2026-06-20', processedDays: 4 },
  { id: 8, date: '2026-06-18', applicant: '中村 愛', category: '書籍・研修', description: '技術書購入', amount: 3850, status: 'approved', submitted: '2026-06-18', processedDays: 2 },
  { id: 9, date: '2026-06-15', applicant: '小林 拓也', category: '交際費', description: '展示会後ディナー', amount: 15600, status: 'pending', submitted: '2026-06-15', processedDays: null },
  { id: 10, date: '2026-06-12', applicant: '加藤 真理', category: '備品購入', description: '文房具セット', amount: 2340, status: 'approved', submitted: '2026-06-12', processedDays: 1 },
  { id: 11, date: '2026-06-10', applicant: '吉田 浩二', category: '交通費', description: '定期券更新（7月分）', amount: 15200, status: 'approved', submitted: '2026-06-10', processedDays: 2 },
  { id: 12, date: '2026-06-08', applicant: '松本 恵', category: '通信費', description: 'クラウドサービス利用料', amount: 9800, status: 'pending', submitted: '2026-06-08', processedDays: null },
];

const MONTHLY_TREND = {
  '2026-01': 142000, '2026-02': 168500, '2026-03': 155200,
  '2026-04': 178900, '2026-05': 192400, '2026-06': 186400,
};

const STATUS_LABEL = { pending: '申請中', approved: '承認済', rejected: '却下' };
const STATUS_CLASS = { pending: 'badge--pending', approved: 'badge--approved', rejected: 'badge--rejected' };

let claims = DEMO_CLAIMS.map(c => ({ ...c }));
let categoryChart, monthlyChart;

const fmt = (n) => '¥' + n.toLocaleString('ja-JP');
const currentMonth = '2026-06';

function updateKPIs() {
  const pending = claims.filter(c => c.status === 'pending').length;
  const rejected = claims.filter(c => c.status === 'rejected').length;
  const approvedThisMonth = claims
    .filter(c => c.status === 'approved' && c.date.startsWith(currentMonth))
    .reduce((s, c) => s + c.amount, 0);

  const processed = claims.filter(c => c.processedDays !== null);
  const avgDays = processed.length
    ? (processed.reduce((s, c) => s + c.processedDays, 0) / processed.length).toFixed(1)
    : '0';

  document.getElementById('kpiPending').textContent = pending;
  document.getElementById('kpiApproved').textContent = fmt(approvedThisMonth);
  document.getElementById('kpiRejected').textContent = rejected;
  document.getElementById('kpiAvgDays').textContent = avgDays;
  document.getElementById('kpiApprovedChange').textContent = '前月比 +8.2%（デモ）';
}

function updateCharts() {
  const cats = {};
  claims.filter(c => c.status === 'approved').forEach(c => {
    cats[c.category] = (cats[c.category] || 0) + c.amount;
  });

  const chartColors = ['#F43F5E', '#8B5CF6', '#3B82F6', '#22C55E', '#F59E0B', '#06B6D4'];

  if (categoryChart) categoryChart.destroy();
  categoryChart = new Chart(document.getElementById('categoryChart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(cats),
      datasets: [{ data: Object.values(cats), backgroundColor: chartColors }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: '#8892A8', font: { size: 11 } } } }
    }
  });

  const months = Object.keys(MONTHLY_TREND).sort();
  if (monthlyChart) monthlyChart.destroy();
  monthlyChart = new Chart(document.getElementById('monthlyChart'), {
    type: 'line',
    data: {
      labels: months.map(m => m.replace('-', '/')),
      datasets: [{
        label: '承認額',
        data: months.map(m => MONTHLY_TREND[m]),
        borderColor: '#F43F5E',
        backgroundColor: 'rgba(244,63,94,0.15)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#F43F5E',
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#8892A8', font: { size: 11 } } } },
      scales: {
        x: { ticks: { color: '#8892A8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#8892A8', callback: v => '¥' + (v / 1000) + 'k' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}

function renderTable() {
  const tbody = document.querySelector('#dataTable tbody');
  const sorted = [...claims].sort((a, b) => b.date.localeCompare(a.date));

  tbody.innerHTML = sorted.map(c => {
    const actions = c.status === 'pending'
      ? `<td class="actions">
           <button class="btn--approve" data-action="approve" data-id="${c.id}">承認</button>
           <button class="btn--reject" data-action="reject" data-id="${c.id}">却下</button>
         </td>`
      : `<td class="actions">—</td>`;

    return `<tr>
      <td>${c.date}</td>
      <td>${c.applicant}</td>
      <td>${c.category}</td>
      <td>${c.description}</td>
      <td>${fmt(c.amount)}</td>
      <td><span class="badge ${STATUS_CLASS[c.status]}">${STATUS_LABEL[c.status]}</span></td>
      ${actions}
    </tr>`;
  }).join('');

  tbody.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => handleAction(btn.dataset.action, +btn.dataset.id));
  });
}

function handleAction(action, id) {
  const claim = claims.find(c => c.id === id);
  if (!claim || claim.status !== 'pending') return;

  if (action === 'approve') {
    claim.status = 'approved';
    claim.processedDays = Math.floor(Math.random() * 3) + 1;
    alert(`✅ 承認しました（デモ）\n\n申請者: ${claim.applicant}\n金額: ${fmt(claim.amount)}\n内容: ${claim.description}`);
  } else {
    claim.status = 'rejected';
    claim.processedDays = Math.floor(Math.random() * 3) + 1;
    alert(`❌ 却下しました（デモ）\n\n申請者: ${claim.applicant}\n金額: ${fmt(claim.amount)}\n理由: 領収書の不備（デモ）`);
  }

  updateKPIs();
  renderTable();
  updateCharts();
}

document.getElementById('exportBtn').addEventListener('click', () => {
  const header = '申請日,申請者,カテゴリ,内容,金額,状態\n';
  const rows = claims.map(c =>
    `${c.date},${c.applicant},${c.category},${c.description},${c.amount},${STATUS_LABEL[c.status]}`
  ).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'expense_report_demo.csv';
  a.click();
});

document.addEventListener('DOMContentLoaded', () => {
  updateKPIs();
  updateCharts();
  renderTable();
});
