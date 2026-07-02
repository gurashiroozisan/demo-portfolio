const EMPLOYEES = [
  { name: '田中 太郎', dept: '営業部' },
  { name: '佐藤 花子', dept: '営業部' },
  { name: '鈴木 健太', dept: '開発部' },
  { name: '高橋 美咲', dept: '開発部' },
  { name: '伊藤 大輔', dept: '総務部' },
  { name: '渡辺 由美', dept: '総務部' },
  { name: '山本 慎一', dept: '開発部' },
  { name: '中村 真理', dept: '営業部' },
];

const MONTHS = ['2025-10', '2025-11', '2025-12'];

function generateDemoData() {
  const records = [];
  let seed = 42;

  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return seed / 2147483647;
  };

  MONTHS.forEach((month) => {
    const [y, m] = month.split('-').map(Number);
    const daysInMonth = new Date(y, m, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(y, m - 1, day);
      const dow = date.getDay();
      if (dow === 0 || dow === 6) continue;

      EMPLOYEES.forEach((emp, idx) => {
        const absentChance = 0.03 + idx * 0.002;
        const isAbsent = rand() < absentChance;

        if (isAbsent) {
          records.push({
            date: `${month}-${String(day).padStart(2, '0')}`,
            name: emp.name,
            dept: emp.dept,
            workHours: 0,
            overtime: 0,
          });
          return;
        }

        const baseWork = 7.5 + Math.floor(rand() * 2);
        const overtime = emp.dept === '開発部'
          ? +(rand() * 3.5).toFixed(1)
          : +(rand() * 2).toFixed(1);

        records.push({
          date: `${month}-${String(day).padStart(2, '0')}`,
          name: emp.name,
          dept: emp.dept,
          workHours: baseWork,
          overtime,
        });
      });
    }
  });

  return records;
}

const DEMO_DATA = generateDemoData();

let records = [];
let overtimeChart, deptChart, attendanceChart;

const monthKey = (d) => d.slice(0, 7);
const fmtHours = (n) => n.toLocaleString('ja-JP', { maximumFractionDigits: 1 });

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
  const workDays = data.filter((r) => r.workHours > 0).length;
  const overtimeTotal = data.reduce((s, r) => s + r.overtime, 0);
  const absentCount = data.filter((r) => r.workHours === 0).length;
  const employees = new Set(data.map((r) => r.name)).size;

  document.getElementById('kpiWorkDays').textContent = workDays.toLocaleString('ja-JP');
  document.getElementById('kpiOvertime').textContent = fmtHours(Math.round(overtimeTotal * 10) / 10);
  document.getElementById('kpiAbsent').textContent = absentCount;
  document.getElementById('kpiEmployees').textContent = employees;

  const monthlyOvertime = {};
  const monthlySlots = {};
  const monthlyPresent = {};
  const deptOvertime = {};

  data.forEach((r) => {
    const m = monthKey(r.date);
    monthlyOvertime[m] = (monthlyOvertime[m] || 0) + r.overtime;
    monthlySlots[m] = (monthlySlots[m] || 0) + 1;
    if (r.workHours > 0) monthlyPresent[m] = (monthlyPresent[m] || 0) + 1;
    deptOvertime[r.dept] = (deptOvertime[r.dept] || 0) + r.overtime;
  });

  const months = Object.keys(monthlyOvertime).sort();
  const attendanceRates = months.map((m) => {
    const slots = monthlySlots[m] || 1;
    const present = monthlyPresent[m] || 0;
    return Math.round((present / slots) * 1000) / 10;
  });

  updateCharts(months, monthlyOvertime, deptOvertime, attendanceRates);
  updateTable(data);
  updateMonthFilter(months);
}

function updateCharts(months, monthlyOvertime, deptOvertime, attendanceRates) {
  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { labels: { color: '#8892A8', font: { size: 11 } } } },
    scales: {
      x: { ticks: { color: '#8892A8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#8892A8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  if (overtimeChart) overtimeChart.destroy();
  overtimeChart = new Chart(document.getElementById('overtimeChart'), {
    type: 'bar',
    data: {
      labels: months.map((m) => m.replace('-', '/')),
      datasets: [{
        label: '残業時間（h）',
        data: months.map((m) => Math.round(monthlyOvertime[m] * 10) / 10),
        backgroundColor: '#8B5CF6',
        borderRadius: 4,
      }],
    },
    options: {
      ...chartDefaults,
      scales: {
        ...chartDefaults.scales,
        y: { ...chartDefaults.scales.y, ticks: { ...chartDefaults.scales.y.ticks, callback: (v) => v + 'h' } },
      },
    },
  });

  if (deptChart) deptChart.destroy();
  deptChart = new Chart(document.getElementById('deptChart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(deptOvertime),
      datasets: [{
        data: Object.values(deptOvertime).map((v) => Math.round(v * 10) / 10),
        backgroundColor: ['#8B5CF6', '#3B82F6', '#22C55E'],
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: '#8892A8', font: { size: 11 } } } },
    },
  });

  if (attendanceChart) attendanceChart.destroy();
  attendanceChart = new Chart(document.getElementById('attendanceChart'), {
    type: 'line',
    data: {
      labels: months.map((m) => m.replace('-', '/')),
      datasets: [{
        label: '出勤率（%）',
        data: attendanceRates,
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34,197,94,0.15)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      }],
    },
    options: {
      ...chartDefaults,
      scales: {
        ...chartDefaults.scales,
        y: {
          ...chartDefaults.scales.y,
          min: 90,
          max: 100,
          ticks: { ...chartDefaults.scales.y.ticks, callback: (v) => v + '%' },
        },
      },
    },
  });
}

function updateTable(data) {
  const tbody = document.querySelector('#dataTable tbody');
  const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));
  tbody.innerHTML = sorted.slice(0, 80).map((r) => {
    const absent = r.workHours === 0;
    const rowClass = absent ? ' class="row--absent"' : '';
    return `<tr${rowClass}><td>${r.date}</td><td>${r.name}</td><td>${r.dept}</td><td>${absent ? '—' : r.workHours + 'h'}</td><td>${absent ? '—' : r.overtime + 'h'}</td></tr>`;
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
  const dateIdx = header.findIndex((h) => /日付|date/i.test(h));
  const nameIdx = header.findIndex((h) => /社員名|氏名|name/i.test(h));
  const deptIdx = header.findIndex((h) => /部署|dept/i.test(h));
  const workIdx = header.findIndex((h) => /勤務時間|work/i.test(h));
  const otIdx = header.findIndex((h) => /残業|overtime/i.test(h));

  if (dateIdx < 0 || nameIdx < 0) {
    alert('CSVには「日付」「社員名」列が必要です。\n例: 日付,社員名,部署,勤務時間,残業時間');
    return null;
  }

  const parseNum = (v) => parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0;

  return lines.slice(1).filter((l) => l.trim()).map((line) => {
    const cols = line.split(',').map((c) => c.trim());
    return {
      date: cols[dateIdx],
      name: cols[nameIdx],
      dept: deptIdx >= 0 ? cols[deptIdx] : '不明',
      workHours: workIdx >= 0 ? parseNum(cols[workIdx]) : 8,
      overtime: otIdx >= 0 ? parseNum(cols[otIdx]) : 0,
    };
  });
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
  const filtered = val === 'all' ? records : records.filter((r) => monthKey(r.date) === val);
  aggregate(filtered);
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const header = '日付,社員名,部署,勤務時間,残業時間\n';
  const rows = records.map((r) =>
    `${r.date},${r.name},${r.dept},${r.workHours},${r.overtime}`
  ).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'attendance_report_demo.csv';
  a.click();
});
