const FILES = [
  { name: 'IMG_4521.jpg', icon: '🖼' },
  { name: 'スクリーンショット 2026.png', icon: '🖼' },
  { name: 'DSC_0892.JPG', icon: '🖼' },
  { name: '写真 (1).jpeg', icon: '🖼' },
  { name: 'P1040923.jpg', icon: '🖼' },
  { name: '無題のデザイン.png', icon: '🖼' },
  { name: 'IMG_4522.jpg', icon: '🖼' },
  { name: 'スキャン_001.pdf', icon: '📄' },
];

let renamed = false;

function getExt(name) {
  const i = name.lastIndexOf('.');
  return i > 0 ? name.slice(i) : '';
}

function computeNewName(file, index) {
  const prefix = document.getElementById('prefix').value;
  const startNum = parseInt(document.getElementById('startNum').value, 10) || 1;
  const find = document.getElementById('findText').value;
  const replace = document.getElementById('replaceText').value;

  let stem = file.name;
  const ext = getExt(file.name);
  if (ext) stem = file.name.slice(0, -ext.length);

  if (find) stem = stem.split(find).join(replace);

  const num = String(startNum + index).padStart(3, '0');
  if (prefix) return `${prefix}${num}${ext}`;
  return stem + ext;
}

function renderTable() {
  const tbody = document.getElementById('fileTableBody');
  tbody.innerHTML = FILES.map((f, i) => {
    const newName = computeNewName(f, i);
    const cls = renamed ? 'renamed' : '';
    return `<tr class="${cls}" data-i="${i}">
      <td class="old-name">${f.icon} ${f.name}</td>
      <td class="arrow-cell">→</td>
      <td class="new-name">${newName}</td>
    </tr>`;
  }).join('');
}

function bindInputs() {
  ['prefix', 'startNum', 'findText', 'replaceText'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      if (!renamed) renderTable();
    });
  });
}

function executeRename() {
  if (renamed) return;
  renamed = true;
  const btn = document.getElementById('renameBtn');
  btn.disabled = true;

  const rows = document.querySelectorAll('#fileTableBody tr');
  rows.forEach((row, idx) => {
    setTimeout(() => {
      row.classList.add('renaming');
      setTimeout(() => row.classList.add('renamed'), 300);
    }, idx * 80);
  });

  setTimeout(() => {
    btn.classList.add('success');
    btn.textContent = '完了 ✓';
    document.querySelector('.file-table-wrap').classList.add('hidden');
    document.getElementById('resultText').textContent =
      `${FILES.length}件のファイル名を変更しました。`;
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('pathLabel').textContent = 'リネーム済み: 8件';
    document.getElementById('resetBtn').classList.remove('hidden');
    document.getElementById('renameForm').querySelectorAll('input').forEach(el => el.disabled = true);
  }, rows.length * 80 + 400);
}

function reset() {
  renamed = false;
  const btn = document.getElementById('renameBtn');
  btn.disabled = false;
  btn.classList.remove('success');
  btn.textContent = 'リネーム実行（デモ）';
  document.getElementById('resetBtn').classList.add('hidden');
  document.querySelector('.file-table-wrap').classList.remove('hidden');
  document.getElementById('result').classList.add('hidden');
  document.getElementById('pathLabel').textContent = '選択中: 8件のファイル';
  document.getElementById('renameForm').querySelectorAll('input').forEach(el => el.disabled = false);
  renderTable();
}

document.getElementById('renameBtn').addEventListener('click', executeRename);
document.getElementById('resetBtn').addEventListener('click', reset);
bindInputs();
renderTable();
