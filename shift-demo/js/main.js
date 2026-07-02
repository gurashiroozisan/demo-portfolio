const STAFF = [
  '田中 花子',
  '佐藤 健',
  '鈴木 美咲',
  '高橋 大輔',
  '伊藤 さくら',
];

const DAYS = ['月', '火', '水', '木', '金', '土', '日'];

const SHIFT_TYPES = [
  { key: 'off', label: '休み', hours: 0, class: 'shift-cell--off' },
  { key: 'early', label: '早番', hours: 6, class: 'shift-cell--early' },
  { key: 'late', label: '遅番', hours: 6, class: 'shift-cell--late' },
  { key: 'full', label: '全日', hours: 8, class: 'shift-cell--full' },
];

const DEFAULT_GRID = [
  ['early', 'full', 'off', 'late', 'early', 'full', 'off'],
  ['late', 'early', 'full', 'off', 'late', 'off', 'full'],
  ['full', 'off', 'early', 'late', 'full', 'early', 'off'],
  ['off', 'late', 'full', 'early', 'off', 'late', 'early'],
  ['early', 'full', 'late', 'off', 'full', 'off', 'late'],
];

let weekOffset = 0;
let grid = DEFAULT_GRID.map((row) => [...row]);

const shiftBody = document.getElementById('shiftBody');
const summaryEl = document.getElementById('summary');
const weekLabel = document.getElementById('weekLabel');
const toast = document.getElementById('toast');

function getWeekLabel() {
  const now = new Date(2026, 6, 1);
  const start = new Date(now);
  start.setDate(now.getDate() + weekOffset * 7 - now.getDay() + 1);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${start.getFullYear()}年${start.getMonth() + 1}月 ${fmt(start)} 〜 ${fmt(end)}`;
}

function getShiftType(key) {
  return SHIFT_TYPES.find((s) => s.key === key) || SHIFT_TYPES[0];
}

function cycleShift(current) {
  const idx = SHIFT_TYPES.findIndex((s) => s.key === current);
  return SHIFT_TYPES[(idx + 1) % SHIFT_TYPES.length].key;
}

function renderGrid() {
  weekLabel.textContent = getWeekLabel();
  shiftBody.innerHTML = STAFF.map((name, rowIdx) => {
    const cells = grid[rowIdx].map((shift, colIdx) => {
      const type = getShiftType(shift);
      return `<td><button type="button" class="shift-cell ${type.class}" data-row="${rowIdx}" data-col="${colIdx}" aria-label="${name} ${DAYS[colIdx]} ${type.label}">${type.label}</button></td>`;
    }).join('');
    return `<tr><td class="name-cell">${name}</td>${cells}</tr>`;
  }).join('');
}

function renderSummary() {
  summaryEl.innerHTML = STAFF.map((name, idx) => {
    const total = grid[idx].reduce((sum, key) => sum + getShiftType(key).hours, 0);
    return `
      <div class="summary-card">
        <span class="summary-card__name">${name}</span>
        <span class="summary-card__hours">${total}<span>h</span></span>
      </div>`;
  }).join('');
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  toast.classList.add('is-visible');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 2800);
}

shiftBody.addEventListener('click', (e) => {
  const btn = e.target.closest('.shift-cell');
  if (!btn) return;
  const row = Number(btn.dataset.row);
  const col = Number(btn.dataset.col);
  grid[row][col] = cycleShift(grid[row][col]);
  renderGrid();
  renderSummary();
});

document.getElementById('confirmBtn').addEventListener('click', () => {
  const totalHours = grid.reduce(
    (sum, row) => sum + row.reduce((s, key) => s + getShiftType(key).hours, 0),
    0
  );
  showToast(`シフトを確定しました（デモ）— 合計 ${totalHours} 時間`);
});

document.getElementById('resetBtn').addEventListener('click', () => {
  grid = DEFAULT_GRID.map((row) => [...row]);
  renderGrid();
  renderSummary();
});

document.getElementById('prevWeek').addEventListener('click', () => {
  weekOffset -= 1;
  renderGrid();
});

document.getElementById('nextWeek').addEventListener('click', () => {
  weekOffset += 1;
  renderGrid();
});

renderGrid();
renderSummary();
