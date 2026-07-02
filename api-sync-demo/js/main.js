const STEP_ORDER = ['api', 'webhook', 'sheet', 'done'];
const STEP_LABELS = {
  api: { running: '送信中…', done: '200 OK' },
  webhook: { running: '受信中…', done: '受信完了' },
  sheet: { running: '書き込み中…', done: '反映完了' },
  done: { running: '処理中…', done: '同期完了' },
};

const TRIGGERS = {
  order: {
    label: '新規注文',
    method: 'POST',
    endpoint: '/api/v1/orders',
    typeClass: 'badge--order',
    typeLabel: '注文',
    buildPayload: () => {
      const id = `ORD-${Date.now().toString().slice(-6)}`;
      return {
        order_id: id,
        customer: { name: '田中 美咲', email: 'misaki@example.com' },
        items: [
          { sku: 'WB-001', name: 'ワイヤレスイヤホン', qty: 1, price: 12800 },
          { sku: 'CS-012', name: '充電ケース', qty: 1, price: 3200 },
        ],
        total: 16000,
        currency: 'JPY',
        status: 'confirmed',
        created_at: new Date().toISOString(),
      };
    },
    buildRow: (payload) => ({
      id: payload.order_id,
      type: '注文',
      typeClass: 'badge--order',
      content: `${payload.customer.name} — ${payload.items[0].name} 他`,
      amount: `¥${payload.total.toLocaleString('ja-JP')}`,
    }),
  },
  inquiry: {
    label: '問い合わせ',
    method: 'POST',
    endpoint: '/webhooks/inquiry',
    typeClass: 'badge--inquiry',
    typeLabel: '問い合わせ',
    buildPayload: () => {
      const id = `INQ-${Date.now().toString().slice(-6)}`;
      return {
        event: 'inquiry.created',
        inquiry_id: id,
        source: 'contact_form',
        contact: { name: '佐藤 健太', email: 'kenta@corp.example.jp', company: 'テック商事' },
        subject: '導入スケジュールについて',
        message: '来月からの本番導入を検討しています。API連携の工数感を教えてください。',
        received_at: new Date().toISOString(),
      };
    },
    buildRow: (payload) => ({
      id: payload.inquiry_id,
      type: '問い合わせ',
      typeClass: 'badge--inquiry',
      content: `${payload.contact.company} — ${payload.subject}`,
      amount: '—',
    }),
  },
  sheet: {
    label: 'シート同期',
    method: 'PUT',
    endpoint: '/api/v1/sheets/sync',
    typeClass: 'badge--sheet',
    typeLabel: '同期',
    buildPayload: () => {
      const id = `SYN-${Date.now().toString().slice(-6)}`;
      return {
        sync_id: id,
        sheet_id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        range: 'Orders!A:F',
        rows_appended: 1,
        mode: 'append',
        triggered_by: 'manual',
        synced_at: new Date().toISOString(),
      };
    },
    buildRow: (payload) => ({
      id: payload.sync_id,
      type: '同期',
      typeClass: 'badge--sheet',
      content: `Orders シート — ${payload.rows_appended}行追加`,
      amount: '—',
    }),
  },
};

const DEFAULT_ROWS = [
  { id: 'ORD-482910', type: '注文', typeClass: 'badge--order', content: '鈴木 由美 — スターターキット', amount: '¥9,800', syncedAt: '10:24:15', status: 'synced' },
  { id: 'INQ-771203', type: '問い合わせ', typeClass: 'badge--inquiry', content: 'LUMIÈRE美容室 — 見積依頼', amount: '—', syncedAt: '11:02:41', status: 'synced' },
  { id: 'ORD-483055', type: '注文', typeClass: 'badge--order', content: '高橋 誠 — 月額プラン', amount: '¥4,980', syncedAt: '11:18:33', status: 'synced' },
];

let sheetRows = [...DEFAULT_ROWS];
let todayCount = 0;
let successCount = 0;
let totalRuns = 0;
let lastSyncTime = null;
let isRunning = false;
let activeTrigger = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function formatTime(date = new Date()) {
  return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

function formatLastSync(date) {
  if (!date) return '—';
  return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mockFetch(endpoint, payload, ms = 800) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          endpoint,
          received: payload,
          timestamp: new Date().toISOString(),
        }),
      });
    }, ms);
  });
}

function addLog(message, type = 'info') {
  const log = $('#activityLog');
  const li = document.createElement('li');
  li.className = `log-entry log-entry--${type}`;
  li.innerHTML = `<time>${formatTime()}</time><span>${message}</span>`;
  log.prepend(li);
  while (log.children.length > 50) log.lastElementChild.remove();
}

function updateKPIs() {
  $('#kpiToday').textContent = todayCount;
  const rate = totalRuns === 0 ? 100 : Math.round((successCount / totalRuns) * 100);
  $('#kpiSuccess').textContent = `${rate}%`;
  $('#kpiLastSync').textContent = formatLastSync(lastSyncTime);
}

function renderSheet(highlightId = null) {
  const tbody = $('#sheetBody');
  tbody.innerHTML = sheetRows.map((row) => `
    <tr class="${row.id === highlightId ? 'is-new' : ''}">
      <td><code>${esc(row.id)}</code></td>
      <td><span class="badge ${row.typeClass}">${esc(row.type)}</span></td>
      <td>${esc(row.content)}</td>
      <td>${esc(row.amount)}</td>
      <td class="mono">${esc(row.syncedAt)}</td>
      <td><span class="badge badge--synced">同期済</span></td>
    </tr>
  `).join('');
  $('#sheetMeta').textContent = `${sheetRows.length} 行`;
}

function esc(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

function getStepEl(key) {
  return $('#steps').querySelector(`[data-step="${key}"]`);
}

function resetSteps() {
  STEP_ORDER.forEach((key) => {
    const el = getStepEl(key);
    el.classList.remove('is-active', 'is-running', 'is-done');
    el.querySelector('.step__status').textContent = '待機中';
    el.querySelector('.step__check').hidden = true;
    el.querySelector('.step__spinner').hidden = true;
    el.querySelector('.step__pending').hidden = false;
  });
}

function setStepRunning(key) {
  const el = getStepEl(key);
  el.classList.add('is-active', 'is-running');
  el.classList.remove('is-done');
  el.querySelector('.step__status').textContent = STEP_LABELS[key].running;
  el.querySelector('.step__pending').hidden = true;
  el.querySelector('.step__spinner').hidden = false;
  el.querySelector('.step__check').hidden = true;
}

function setStepDone(key) {
  const el = getStepEl(key);
  el.classList.remove('is-running');
  el.classList.add('is-done');
  el.querySelector('.step__status').textContent = STEP_LABELS[key].done;
  el.querySelector('.step__pending').hidden = true;
  el.querySelector('.step__spinner').hidden = true;
  el.querySelector('.step__check').hidden = false;
}

function showPayload(triggerKey) {
  const config = TRIGGERS[triggerKey];
  const payload = config.buildPayload();
  $('#payloadMethod').textContent = `${config.method} ${config.endpoint}`;
  $('#payloadPreview').innerHTML = `<code>${esc(JSON.stringify(payload, null, 2))}</code>`;
  return payload;
}

function setTriggersDisabled(disabled) {
  $$('.trigger-btn').forEach((btn) => { btn.disabled = disabled; });
  $('#connectionStatus').classList.toggle('is-busy', disabled);
}

async function runSync(triggerKey) {
  if (isRunning) return;
  isRunning = true;
  setTriggersDisabled(true);

  const config = TRIGGERS[triggerKey];
  const payload = showPayload(triggerKey);
  const monitor = $('.panel--monitor');

  resetSteps();
  monitor.classList.add('is-busy');
  $('#idleState').hidden = true;

  addLog(`${config.label}トリガーを実行 — ${config.method} ${config.endpoint}`, 'info');

  try {
    setStepRunning('api');
    const res = await mockFetch(config.endpoint, payload, 900);
    const data = await res.json();
    setStepDone('api');
    addLog(`API Request 完了 — ${res.status} ${config.endpoint}`, 'success');
    await delay(350);

    setStepRunning('webhook');
    await mockFetch('/webhooks/sync-bridge', { event: config.label, data }, 700);
    setStepDone('webhook');
    addLog('Webhook受信 — sync-bridge エンドポイントへ配信', 'success');
    await delay(350);

    setStepRunning('sheet');
    await delay(800);
    const rowData = config.buildRow(payload);
    const syncedAt = formatTime();
    const newRow = {
      ...rowData,
      syncedAt,
      status: 'synced',
    };
    sheetRows.unshift(newRow);
    renderSheet(newRow.id);
    setStepDone('sheet');
    addLog(`スプレッドシート反映 — ${newRow.id} を追加`, 'success');
    await delay(350);

    setStepRunning('done');
    await delay(500);
    setStepDone('done');

    todayCount += 1;
    totalRuns += 1;
    successCount += 1;
    lastSyncTime = new Date();
    updateKPIs();
    addLog(`${config.label}の同期が完了しました（${data.received.order_id || data.received.inquiry_id || data.received.sync_id || 'OK'}）`, 'success');
  } catch {
    totalRuns += 1;
    addLog('同期処理中にエラーが発生しました（デモ）', 'warn');
    updateKPIs();
  } finally {
    isRunning = false;
    setTriggersDisabled(false);
  }
}

$$('.trigger-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.trigger;
    $$('.trigger-btn').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    activeTrigger = key;
    showPayload(key);
    runSync(key);
  });

  btn.addEventListener('mouseenter', () => {
    if (!isRunning) showPayload(btn.dataset.trigger);
  });
});

$('#clearLog').addEventListener('click', () => {
  $('#activityLog').innerHTML = `
    <li class="log-entry log-entry--info">
      <time>${formatTime()}</time>
      <span>ログをクリアしました</span>
    </li>
  `;
});

renderSheet();
updateKPIs();
if (activeTrigger) showPayload('order');
else {
  $('#payloadMethod').textContent = 'POST /api/v1/orders';
  showPayload('order');
}
