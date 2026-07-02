const FILES = [
  { name: '議事録_2026.pdf', path: 'Downloads', size: '1.2 MB', icon: '📄', group: 1, keep: true },
  { name: '議事録_2026.pdf', path: 'Documents\\会議', size: '1.2 MB', icon: '📄', group: 1, keep: false },
  { name: 'IMG_001.jpg', path: 'Pictures', size: '3.4 MB', icon: '🖼', group: 2, keep: true },
  { name: 'IMG_001.jpg', path: 'Downloads', size: '3.4 MB', icon: '🖼', group: 2, keep: false },
  { name: 'backup.zip', path: 'Downloads', size: '48 MB', icon: '📦', group: 3, keep: true },
  { name: 'backup (コピー).zip', path: 'Downloads', size: '48 MB', icon: '📦', group: 3, keep: false },
  { name: '見積書.xlsx', path: 'Documents', size: '256 KB', icon: '📄', group: null },
  { name: 'logo.png', path: 'Pictures', size: '890 KB', icon: '🖼', group: null },
  { name: 'readme.txt', path: 'Downloads', size: '4 KB', icon: '📎', group: null },
  { name: 'presentation.pptx', path: 'Documents', size: '5.1 MB', icon: '📄', group: null },
  { name: 'music.mp3', path: 'Music', size: '8.2 MB', icon: '🎵', group: null },
  { name: 'setup.exe', path: 'Downloads', size: '72 MB', icon: '📎', group: null },
];

const GROUP_COLORS = { 1: 'dup-red', 2: 'dup-yellow', 3: 'dup-red' };
const GROUP_LABELS = { 1: '重複 A', 2: '重複 B', 3: '重複 C' };

let scanned = false;
let cleaned = false;

function renderFiles() {
  const list = document.getElementById('fileList');
  list.innerHTML = FILES.map((f, i) => {
    let cls = 'file-row';
    let badge = '';
    if (scanned && f.group) {
      cls += ' ' + GROUP_COLORS[f.group];
      badge = `<span class="badge">${GROUP_LABELS[f.group]}</span>`;
    }
    if (cleaned && !f.keep && f.group) cls += ' removed';
    return `<li class="${cls}" data-i="${i}">
      <span class="icon">${f.icon}</span>
      <div class="info">
        <div class="name">${f.name}</div>
        <div class="path">${f.path}</div>
      </div>
      <span class="size">${f.size}</span>
      ${badge}
    </li>`;
  }).join('');
}

function startScan() {
  if (scanned) return;
  const btn = document.getElementById('scanBtn');
  btn.disabled = true;
  btn.classList.add('scanning');
  btn.textContent = 'スキャン中...';
  document.getElementById('statusLabel').textContent = 'スキャン中...';
  document.getElementById('progressBar').classList.remove('hidden');

  const fill = document.getElementById('progressFill');
  const rows = document.querySelectorAll('.file-row');
  let progress = 0;

  const interval = setInterval(() => {
    progress += 100 / FILES.length;
    fill.style.width = Math.min(progress, 100) + '%';
    const idx = Math.floor(progress / (100 / FILES.length));
    if (rows[idx]) rows[idx].classList.add('scanning');
  }, 120);

  setTimeout(() => {
    clearInterval(interval);
    fill.style.width = '100%';
    scanned = true;
    btn.classList.remove('scanning');
    btn.textContent = 'スキャン完了';
    document.getElementById('statusLabel').textContent = 'スキャン完了';
    document.getElementById('scanStats').classList.remove('hidden');
    document.getElementById('scanBanner').classList.remove('hidden');
    document.getElementById('bannerText').textContent = '8件中 3グループの重複を検出';
    document.getElementById('cleanBtn').classList.remove('hidden');
    renderFiles();

    const dupRows = document.querySelectorAll('.file-row.dup-red, .file-row.dup-yellow');
    dupRows.forEach((row, idx) => {
      setTimeout(() => row.style.animationDelay = (idx * 0.1) + 's', 0);
    });
  }, FILES.length * 120 + 200);
}

function cleanDuplicates() {
  if (cleaned) return;
  cleaned = true;
  const btn = document.getElementById('cleanBtn');
  btn.disabled = true;

  let removeCount = 0;

  FILES.forEach((f, i) => {
    if (f.group && !f.keep) {
      removeCount++;
      setTimeout(() => {
        const row = document.querySelector(`.file-row[data-i="${i}"]`);
        if (row) row.classList.add('removed');
      }, removeCount * 150);
    }
  });

  setTimeout(() => {
    btn.classList.add('success');
    btn.textContent = '完了 ✓';
    document.getElementById('cleanResultText').textContent =
      `${removeCount}件の重複ファイルをゴミ箱に移動しました。`;
    document.getElementById('cleanResult').classList.remove('hidden');
    document.getElementById('scanBanner').classList.add('hidden');
    document.getElementById('resetBtn').classList.remove('hidden');
    document.getElementById('statusLabel').textContent = '整理済み';
  }, removeCount * 150 + 400);
}

function reset() {
  scanned = false;
  cleaned = false;
  document.getElementById('scanBtn').disabled = false;
  document.getElementById('scanBtn').textContent = 'スキャン開始';
  document.getElementById('cleanBtn').classList.add('hidden');
  document.getElementById('cleanBtn').disabled = false;
  document.getElementById('cleanBtn').classList.remove('success');
  document.getElementById('cleanBtn').textContent = '重複を整理（デモ）';
  document.getElementById('resetBtn').classList.add('hidden');
  document.getElementById('scanStats').classList.add('hidden');
  document.getElementById('scanBanner').classList.add('hidden');
  document.getElementById('cleanResult').classList.add('hidden');
  document.getElementById('progressBar').classList.add('hidden');
  document.getElementById('progressFill').style.width = '0';
  document.getElementById('statusLabel').textContent = 'スキャン待機中';
  renderFiles();
}

document.getElementById('scanBtn').addEventListener('click', startScan);
document.getElementById('cleanBtn').addEventListener('click', cleanDuplicates);
document.getElementById('resetBtn').addEventListener('click', reset);
renderFiles();
