const STORAGE_KEY = 'flowboard-tasks';

const COLUMNS = [
  { id: 'todo', label: '未着手' },
  { id: 'doing', label: '進行中' },
  { id: 'done', label: '完了' },
];

const DEFAULT_TASKS = [
  { id: 't1', title: '新規LP制作', assignee: '田中 花子', due: '2026-07-15', column: 'todo' },
  { id: 't2', title: '問い合わせフォーム改修', assignee: '佐藤 健', due: '2026-07-20', column: 'todo' },
  { id: 't3', title: 'ECサイトリニューアル', assignee: '鈴木 美咲', due: '2026-07-10', column: 'doing' },
  { id: 't4', title: '社内Wiki移行', assignee: '高橋 大輔', due: '2026-07-25', column: 'doing' },
  { id: 't5', title: '名刺デザイン', assignee: '伊藤 さくら', due: '2026-06-28', column: 'done' },
  { id: 't6', title: '月次レポート自動化', assignee: '山田 誠', due: '2026-06-30', column: 'done' },
];

let tasks = [];
let draggedId = null;

const modal = document.getElementById('modal');
const addForm = document.getElementById('addForm');
const toast = document.getElementById('toast');

function uid() {
  return `t${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length) {
        tasks = parsed;
        return;
      }
    }
  } catch {
    /* fall through to defaults */
  }
  tasks = DEFAULT_TASKS.map((t) => ({ ...t }));
  saveTasks();
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${y}年${Number(m)}月${Number(d)}日`;
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

function openModal() {
  addForm.reset();
  document.getElementById('taskDue').value = '2026-07-15';
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

function renderCard(task) {
  return `
    <article class="card" draggable="true" data-id="${task.id}">
      <h4 class="card__title">${escapeHtml(task.title)}</h4>
      <div class="card__meta">
        <span>担当者：<strong>${escapeHtml(task.assignee)}</strong></span>
        <span>期限：<strong>${formatDate(task.due)}</strong></span>
      </div>
      <div class="card__footer">
        <button type="button" class="card__delete" data-delete="${task.id}" aria-label="削除">削除</button>
      </div>
    </article>`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render() {
  COLUMNS.forEach(({ id }) => {
    const list = document.getElementById(`list-${id}`);
    const count = document.getElementById(`count-${id}`);
    const columnTasks = tasks.filter((t) => t.column === id);
    list.innerHTML = columnTasks.map(renderCard).join('');
    count.textContent = columnTasks.length;
  });
  bindCardEvents();
}

function bindCardEvents() {
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('dragstart', onDragStart);
    card.addEventListener('dragend', onDragEnd);
  });

  document.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.delete;
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks();
      render();
      showToast('タスクを削除しました');
    });
  });
}

function onDragStart(e) {
  draggedId = e.currentTarget.dataset.id;
  e.currentTarget.classList.add('is-dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggedId);
}

function onDragEnd(e) {
  e.currentTarget.classList.remove('is-dragging');
  draggedId = null;
  document.querySelectorAll('.column__list').forEach((el) => el.classList.remove('is-drag-over'));
}

function setupDropZones() {
  document.querySelectorAll('.column__list').forEach((list) => {
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      list.classList.add('is-drag-over');
    });

    list.addEventListener('dragleave', (e) => {
      if (!list.contains(e.relatedTarget)) {
        list.classList.remove('is-drag-over');
      }
    });

    list.addEventListener('drop', (e) => {
      e.preventDefault();
      list.classList.remove('is-drag-over');
      const id = e.dataTransfer.getData('text/plain') || draggedId;
      const column = list.id.replace('list-', '');
      const task = tasks.find((t) => t.id === id);
      if (!task || task.column === column) return;
      task.column = column;
      saveTasks();
      render();
    });
  });
}

document.getElementById('addTaskBtn').addEventListener('click', openModal);

document.querySelectorAll('[data-close]').forEach((el) => {
  el.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value.trim();
  const assignee = document.getElementById('taskAssignee').value.trim();
  const due = document.getElementById('taskDue').value;
  const column = document.getElementById('taskColumn').value;
  if (!title || !assignee || !due) return;

  tasks.push({ id: uid(), title, assignee, due, column });
  saveTasks();
  render();
  closeModal();
  showToast('タスクを追加しました');
});

document.getElementById('resetBtn').addEventListener('click', () => {
  tasks = DEFAULT_TASKS.map((t) => ({ ...t }));
  saveTasks();
  render();
  showToast('初期データに戻しました');
});

loadTasks();
setupDropZones();
render();
