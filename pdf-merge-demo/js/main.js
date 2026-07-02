const PDFS = [
  { name: '表紙_提案書.pdf', pages: 2 },
  { name: '見積書_2026Q1.pdf', pages: 4 },
  { name: '会社概要.pdf', pages: 6 },
  { name: '実績一覧.pdf', pages: 3 },
  { name: '添付資料.pdf', pages: 3 },
];

let order = PDFS.map((_, i) => i);
let merged = false;
let dragIdx = null;

function totalPages() {
  return order.reduce((sum, i) => sum + PDFS[i].pages, 0);
}

function renderPdfList() {
  const list = document.getElementById('pdfList');
  list.innerHTML = order.map((pdfIdx, pos) => {
    const p = PDFS[pdfIdx];
    const upDisabled = pos === 0 ? 'disabled' : '';
    const downDisabled = pos === order.length - 1 ? 'disabled' : '';
    const cls = merged ? 'pdf-item merged' : 'pdf-item';
    return `<li class="${cls}" draggable="${!merged}" data-pos="${pos}">
      <span class="drag-handle" title="ドラッグで並べ替え">⠿</span>
      <span class="pdf-icon">📄</span>
      <div class="pdf-info">
        <div class="pdf-name">${p.name}</div>
        <div class="pdf-meta">${p.pages}ページ</div>
      </div>
      <div class="pdf-order">
        <button class="order-btn" data-dir="up" data-pos="${pos}" ${upDisabled}>▲</button>
        <button class="order-btn" data-dir="down" data-pos="${pos}" ${downDisabled}>▼</button>
      </div>
    </li>`;
  }).join('');
  document.getElementById('mergePageTotal').textContent = `合計 ${totalPages()}ページ`;
  bindListEvents();
}

function bindListEvents() {
  document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (merged) return;
      const pos = parseInt(btn.dataset.pos, 10);
      const dir = btn.dataset.dir;
      const newPos = dir === 'up' ? pos - 1 : pos + 1;
      if (newPos < 0 || newPos >= order.length) return;
      [order[pos], order[newPos]] = [order[newPos], order[pos]];
      renderPdfList();
    });
  });

  document.querySelectorAll('.pdf-item').forEach(item => {
    item.addEventListener('dragstart', e => {
      dragIdx = parseInt(item.dataset.pos, 10);
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
    item.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
    item.addEventListener('drop', e => {
      e.preventDefault();
      if (merged || dragIdx === null) return;
      const dropPos = parseInt(item.dataset.pos, 10);
      if (dragIdx === dropPos) return;
      const [moved] = order.splice(dragIdx, 1);
      order.splice(dropPos, 0, moved);
      dragIdx = null;
      renderPdfList();
    });
  });
}

function renderPageGrid() {
  const grid = document.getElementById('pageGrid');
  const total = 18;
  grid.innerHTML = Array.from({ length: total }, (_, i) => {
    const num = i + 1;
    const selected = num <= 3 ? 'selected' : '';
    return `<div class="page-thumb ${selected}" data-page="${num}">p.${num}</div>`;
  }).join('');
}

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById(tab === 'merge' ? 'panelMerge' : 'panelSplit').classList.add('active');
}

function mergePdfs() {
  if (merged) return;
  merged = true;
  const btn = document.getElementById('mergeBtn');
  btn.disabled = true;

  const items = document.querySelectorAll('.pdf-item');
  items.forEach((el, idx) => {
    setTimeout(() => el.classList.add('merged'), idx * 120);
  });

  const names = order.map(i => PDFS[i].name).join(' + ');
  const pages = totalPages();

  setTimeout(() => {
    btn.classList.add('success');
    btn.textContent = '完了 ✓';
    document.getElementById('mergeResultText').textContent =
      `「結合済みレポート.pdf」を作成しました（${pages}ページ）。\n${names}`;
    document.getElementById('mergeResult').classList.remove('hidden');
    document.getElementById('mergeResetBtn').classList.remove('hidden');
  }, items.length * 120 + 300);
}

function splitPdf() {
  const btn = document.getElementById('splitBtn');
  btn.disabled = true;
  btn.classList.add('success');
  btn.textContent = '完了 ✓';
  document.getElementById('splitResultText').textContent =
    '「抽出_ページ1-3.pdf」を作成しました（3ページ）。';
  document.getElementById('splitResult').classList.remove('hidden');
}

function resetMerge() {
  merged = false;
  order = PDFS.map((_, i) => i);
  const btn = document.getElementById('mergeBtn');
  btn.disabled = false;
  btn.classList.remove('success');
  btn.textContent = '結合する（デモ）';
  document.getElementById('mergeResult').classList.add('hidden');
  document.getElementById('mergeResetBtn').classList.add('hidden');
  renderPdfList();
}

document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => switchTab(t.dataset.tab));
});
document.getElementById('mergeBtn').addEventListener('click', mergePdfs);
document.getElementById('mergeResetBtn').addEventListener('click', resetMerge);
document.getElementById('splitBtn').addEventListener('click', splitPdf);

renderPdfList();
renderPageGrid();
