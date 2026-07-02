const state = { step: 1, date: null, time: null, menu: null };
const menus = [
  { name: 'カット', desc: '60分', price: '¥5,500' },
  { name: 'カラー', desc: '90分', price: '¥8,800' },
  { name: 'カット + カラー', desc: '120分', price: '¥12,100' },
];
const times = ['10:00','10:30','11:00','13:00','13:30','14:00','15:00','16:00','17:00'];

function renderCalendar() {
  const cal = document.getElementById('calendar');
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  let html = ['日','月','火','水','木','金','土'].map(d => `<div class="cal-head">${d}</div>`).join('');
  for (let i = 0; i < first; i++) html += '<div class="cal-day empty"></div>';
  for (let d = 1; d <= days; d++) {
    const disabled = d < now.getDate() ? ' disabled' : '';
    html += `<div class="cal-day${disabled}" data-day="${d}">${d}</div>`;
  }
  cal.innerHTML = html;
  cal.querySelectorAll('.cal-day:not(.disabled):not(.empty)').forEach(el => {
    el.addEventListener('click', () => {
      cal.querySelectorAll('.cal-day').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      state.date = `${m + 1}/${el.dataset.day}`;
      renderTimes();
    });
  });
}

function renderTimes() {
  const t = document.getElementById('times');
  t.innerHTML = times.map(time =>
    `<button type="button" class="time-btn${state.time === time ? ' selected' : ''}" data-time="${time}">${time}</button>`
  ).join('');
  t.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      t.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.time = btn.dataset.time;
    });
  });
}

function renderMenus() {
  document.getElementById('menus').innerHTML = menus.map((m, i) =>
    `<div class="menu-item${state.menu === i ? ' selected' : ''}" data-i="${i}"><div><strong>${m.name}</strong><span>${m.desc}</span></div><span>${m.price}</span></div>`
  ).join('');
  document.querySelectorAll('.menu-item').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.menu-item').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      state.menu = +el.dataset.i;
    });
  });
}

function updateSteps() {
  document.querySelectorAll('.steps li').forEach((li, i) => {
    li.classList.remove('active', 'done');
    if (i + 1 < state.step) li.classList.add('done');
    if (i + 1 === state.step) li.classList.add('active');
  });
  document.querySelectorAll('.step').forEach(s => s.classList.toggle('hidden', +s.dataset.step !== state.step));
  document.getElementById('prev').disabled = state.step === 1;
  document.getElementById('next').textContent = state.step === 4 ? '予約を確定（デモ）' : '次へ';
}

function showConfirm() {
  const m = menus[state.menu];
  document.getElementById('confirm').innerHTML = `
    <dt>日時</dt><dd>${state.date} ${state.time}</dd>
    <dt>メニュー</dt><dd>${m.name}（${m.price}）</dd>
    <dt>お名前</dt><dd>${document.querySelector('#form input').value || '—'}</dd>
    <dt>電話</dt><dd>${document.querySelectorAll('#form input')[1].value || '—'}</dd>`;
}

document.getElementById('next').addEventListener('click', () => {
  if (state.step === 1 && (!state.date || !state.time)) return alert('日時を選択してください');
  if (state.step === 2 && state.menu === null) return alert('メニューを選択してください');
  if (state.step === 3 && !document.getElementById('form').checkValidity()) { document.getElementById('form').reportValidity(); return; }
  if (state.step === 4) { alert('デモのため予約は完了しません。ありがとうございました！'); return; }
  state.step++;
  if (state.step === 2) renderMenus();
  if (state.step === 4) showConfirm();
  updateSteps();
});
document.getElementById('prev').addEventListener('click', () => { if (state.step > 1) { state.step--; updateSteps(); } });

renderCalendar();
renderTimes();
updateSteps();
