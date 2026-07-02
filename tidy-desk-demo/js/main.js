const FILES = [
  { name: 'report_2026.pdf', icon: '📄', cat: 'docs' },
  { name: 'photo_vacation.jpg', icon: '🖼', cat: 'images' },
  { name: 'meeting_notes.docx', icon: '📄', cat: 'docs' },
  { name: 'tutorial.mp4', icon: '🎬', cat: 'videos' },
  { name: 'invoice_march.xlsx', icon: '📄', cat: 'docs' },
  { name: 'screenshot_001.png', icon: '🖼', cat: 'images' },
  { name: 'backup.zip', icon: '📦', cat: 'archives' },
  { name: 'presentation.pptx', icon: '📄', cat: 'docs' },
  { name: 'profile_pic.jpeg', icon: '🖼', cat: 'images' },
  { name: 'demo_clip.mov', icon: '🎬', cat: 'videos' },
  { name: 'contract_draft.pdf', icon: '📄', cat: 'docs' },
  { name: 'wallpaper.png', icon: '🖼', cat: 'images' },
  { name: 'installer.exe', icon: '📎', cat: 'other' },
  { name: 'data_export.csv', icon: '📄', cat: 'docs' },
  { name: 'family.jpg', icon: '🖼', cat: 'images' },
  { name: 'webinar_recording.mp4', icon: '🎬', cat: 'videos' },
  { name: 'old_project.zip', icon: '📦', cat: 'archives' },
  { name: 'readme.txt', icon: '📎', cat: 'other' },
  { name: 'budget_2026.xlsx', icon: '📄', cat: 'docs' },
  { name: 'logo_design.ai', icon: '🖼', cat: 'images' },
  { name: 'setup.msi', icon: '📎', cat: 'other' },
  { name: 'archive_2025.rar', icon: '📦', cat: 'archives' },
  { name: 'memo.pdf', icon: '📄', cat: 'docs' },
  { name: 'clip_short.gif', icon: '🖼', cat: 'images' },
];

const CAT_LABELS = { images: '画像', docs: '書類', videos: '動画', archives: 'アーカイブ', other: 'その他' };
const FOLDER_IDS = { images: 'folderImages', docs: 'folderDocs', videos: 'folderVideos', archives: 'folderArchives', other: 'folderOther' };

let organized = false;

function renderFiles() {
  const grid = document.getElementById('fileGrid');
  grid.innerHTML = FILES.map((f, i) =>
    `<div class="file-item" data-i="${i}" data-cat="${f.cat}">
      <span class="icon">${f.icon}</span>
      <span class="name">${f.name}</span>
    </div>`
  ).join('');
  grid.classList.remove('hidden');
  document.getElementById('result').classList.add('hidden');
}

function organize() {
  if (organized) return;
  organized = true;
  document.getElementById('organizeBtn').disabled = true;
  const items = document.querySelectorAll('.file-item');
  items.forEach((el, idx) => {
    setTimeout(() => el.classList.add('moving'), idx * 40);
    setTimeout(() => el.classList.add('organized'), idx * 40 + 300);
  });
  setTimeout(() => {
    document.getElementById('fileGrid').classList.add('hidden');
    const counts = {};
    FILES.forEach(f => { counts[f.cat] = (counts[f.cat] || 0) + 1; });
    const summary = Object.entries(counts).map(([k, v]) => `${CAT_LABELS[k]}: ${v}件`).join(' / ');
    document.getElementById('resultText').textContent = `${FILES.length}件を5フォルダに整理しました。（${summary}）`;
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('pathLabel').textContent = 'ダウンロード（整理済み）';
    document.getElementById('resetBtn').classList.remove('hidden');
    Object.values(FOLDER_IDS).forEach(id => {
      const el = document.getElementById(id);
      el.classList.remove('hidden');
      el.classList.add('show');
    });
  }, items.length * 40 + 500);
}

function reset() {
  organized = false;
  document.getElementById('organizeBtn').disabled = false;
  document.getElementById('resetBtn').classList.add('hidden');
  document.getElementById('pathLabel').textContent = 'ダウンロード（未整理 24件）';
  Object.values(FOLDER_IDS).forEach(id => {
    const el = document.getElementById(id);
    el.classList.add('hidden');
    el.classList.remove('show');
  });
  renderFiles();
}

document.getElementById('organizeBtn').addEventListener('click', organize);
document.getElementById('resetBtn').addEventListener('click', reset);
renderFiles();
