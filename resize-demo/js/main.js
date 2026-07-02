let targetWidth = 1200;
const queue = [];
let nextId = 1;

const fileInput = document.getElementById('fileInput');
const fileDrop = document.getElementById('fileDrop');
const queueList = document.getElementById('queueList');
const queueEmpty = document.getElementById('queueEmpty');
const queueCount = document.getElementById('queueCount');
const doneCount = document.getElementById('doneCount');
const processAllBtn = document.getElementById('processAllBtn');
const clearBtn = document.getElementById('clearBtn');
const customWidth = document.getElementById('customWidth');
const applyCustomBtn = document.getElementById('applyCustomBtn');

function updateUI() {
  const done = queue.filter(i => i.status === 'done').length;
  queueCount.textContent = queue.length;
  doneCount.textContent = done;
  processAllBtn.disabled = queue.length === 0 || queue.every(i => i.status === 'done');
  clearBtn.disabled = queue.length === 0;

  if (queue.length === 0) {
    queueEmpty.classList.remove('hidden');
    queueList.classList.add('hidden');
    queueList.innerHTML = '';
    return;
  }

  queueEmpty.classList.add('hidden');
  queueList.classList.remove('hidden');
  queueList.innerHTML = queue.map(item => renderItem(item)).join('');
  bindItemEvents();
}

function renderItem(item) {
  const dimsBefore = `${item.origW} × ${item.origH}`;
  const dimsAfter = item.newW
    ? `<span class="resized">${item.newW} × ${item.newH}</span>`
    : '—';
  const statusLabel = { pending: '待機中', processing: '処理中…', done: '完了' }[item.status];
  const statusClass = item.status;

  return `
    <li class="queue-item" data-id="${item.id}">
      <img class="queue-item__thumb" src="${item.previewUrl}" alt="">
      <div class="queue-item__info">
        <p class="queue-item__name">${escapeHtml(item.name)}</p>
        <p class="queue-item__dims">${dimsBefore}<span class="arrow">→</span>${dimsAfter}</p>
        <p class="queue-item__status ${statusClass}">${statusLabel}</p>
      </div>
      <div class="queue-item__actions">
        <button class="btn-download" data-action="download" ${item.status !== 'done' ? 'disabled' : ''}>ダウンロード</button>
        <button class="btn-remove" data-action="remove">削除</button>
      </div>
    </li>`;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function bindItemEvents() {
  queueList.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.closest('.queue-item').dataset.id);
      const item = queue.find(i => i.id === id);
      if (!item) return;
      if (btn.dataset.action === 'download') downloadItem(item);
      if (btn.dataset.action === 'remove') removeItem(id);
    });
  });
}

function setPreset(width) {
  targetWidth = width;
  document.querySelectorAll('.preset-btn:not(.preset-btn--custom)').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.width) === width);
  });
  customWidth.value = '';
}

function addFiles(files) {
  const imageFiles = [...files].filter(f => f.type.startsWith('image/'));
  imageFiles.forEach(file => {
    const previewUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      queue.push({
        id: nextId++,
        file,
        name: file.name,
        previewUrl,
        origW: img.naturalWidth,
        origH: img.naturalHeight,
        newW: null,
        newH: null,
        blob: null,
        status: 'pending',
      });
      updateUI();
    };
    img.src = previewUrl;
  });
}

function calcSize(origW, origH, maxW) {
  if (origW <= maxW) return { w: origW, h: origH };
  const ratio = maxW / origW;
  return { w: maxW, h: Math.round(origH * ratio) };
}

function resizeItem(item) {
  return new Promise((resolve, reject) => {
    item.status = 'processing';
    updateUI();

    const img = new Image();
    img.onload = () => {
      const { w, h } = calcSize(item.origW, item.origH, targetWidth);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      const mime = item.file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob(blob => {
        if (!blob) {
          item.status = 'pending';
          updateUI();
          reject(new Error('リサイズに失敗しました'));
          return;
        }
        item.newW = w;
        item.newH = h;
        item.blob = blob;
        item.status = 'done';
        updateUI();
        resolve();
      }, mime, 0.92);
    };
    img.onerror = () => {
      item.status = 'pending';
      updateUI();
      reject(new Error('画像の読み込みに失敗しました'));
    };
    img.src = item.previewUrl;
  });
}

async function processAll() {
  processAllBtn.disabled = true;
  for (const item of queue) {
    if (item.status !== 'done') await resizeItem(item);
  }
  processAllBtn.disabled = queue.every(i => i.status === 'done');
}

function downloadItem(item) {
  if (!item.blob) return;
  const ext = item.file.type === 'image/png' ? '.png' : '.jpg';
  const base = item.name.replace(/\.[^.]+$/, '');
  const url = URL.createObjectURL(item.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${base}_resize${ext}`;
  a.click();
  URL.revokeObjectURL(url);
}

function removeItem(id) {
  const idx = queue.findIndex(i => i.id === id);
  if (idx === -1) return;
  URL.revokeObjectURL(queue[idx].previewUrl);
  queue.splice(idx, 1);
  updateUI();
}

function clearQueue() {
  queue.forEach(i => URL.revokeObjectURL(i.previewUrl));
  queue.length = 0;
  updateUI();
}

document.querySelectorAll('.preset-btn:not(.preset-btn--custom)').forEach(btn => {
  btn.addEventListener('click', () => setPreset(Number(btn.dataset.width)));
});

applyCustomBtn.addEventListener('click', () => {
  const w = parseInt(customWidth.value, 10);
  if (!w || w < 50 || w > 8000) {
    customWidth.focus();
    return;
  }
  targetWidth = w;
  document.querySelectorAll('.preset-btn:not(.preset-btn--custom)').forEach(b => b.classList.remove('active'));
});

fileInput.addEventListener('change', e => {
  if (e.target.files.length) addFiles(e.target.files);
  fileInput.value = '';
});

fileDrop.addEventListener('dragover', e => {
  e.preventDefault();
  fileDrop.classList.add('dragover');
});
fileDrop.addEventListener('dragleave', () => fileDrop.classList.remove('dragover'));
fileDrop.addEventListener('drop', e => {
  e.preventDefault();
  fileDrop.classList.remove('dragover');
  if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
});

processAllBtn.addEventListener('click', processAll);
clearBtn.addEventListener('click', clearQueue);

updateUI();
