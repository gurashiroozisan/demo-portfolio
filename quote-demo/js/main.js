const DEFAULT_ITEMS = [
  { name: 'Webサイト制作（5ページ）', qty: 1, price: 500000 },
  { name: 'レスポンシブ対応', qty: 1, price: 80000 },
  { name: '保守サポート（月額）', qty: 3, price: 15000 },
];

let lineItems = DEFAULT_ITEMS.map(item => ({ ...item, id: crypto.randomUUID() }));

const fmt = (n) => '¥' + Math.round(n).toLocaleString('ja-JP');
const fmtDate = (iso) => {
  const [y, m, d] = iso.split('-');
  return `${y}年${+m}月${+d}日`;
};

function initDate() {
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById('quoteDate').value = today;
}

function renderLineItems() {
  const tbody = document.getElementById('lineItemsBody');
  tbody.innerHTML = lineItems.map(item => {
    const amount = item.qty * item.price;
    return `<tr data-id="${item.id}">
      <td><input type="text" class="input-name" value="${item.name}" placeholder="品名"></td>
      <td><input type="number" class="input-qty" value="${item.qty}" min="1" step="1"></td>
      <td><input type="number" class="input-price" value="${item.price}" min="0" step="100"></td>
      <td class="line-amount">${fmt(amount)}</td>
      <td><button class="btn--remove" data-remove="${item.id}">×</button></td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('.input-name, .input-qty, .input-price').forEach(input => {
    input.addEventListener('input', onLineInput);
  });
  tbody.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => removeLine(btn.dataset.remove));
  });

  updatePreview();
}

function onLineInput(e) {
  const row = e.target.closest('tr');
  const id = row.dataset.id;
  const item = lineItems.find(i => i.id === id);
  if (!item) return;

  item.name = row.querySelector('.input-name').value;
  item.qty = Math.max(1, parseInt(row.querySelector('.input-qty').value, 10) || 1);
  item.price = Math.max(0, parseInt(row.querySelector('.input-price').value, 10) || 0);

  row.querySelector('.input-qty').value = item.qty;
  row.querySelector('.line-amount').textContent = fmt(item.qty * item.price);
  updatePreview();
}

function addLine() {
  lineItems.push({ id: crypto.randomUUID(), name: '', qty: 1, price: 0 });
  renderLineItems();
  const lastInput = document.querySelector('#lineItemsBody tr:last-child .input-name');
  if (lastInput) lastInput.focus();
}

function removeLine(id) {
  if (lineItems.length <= 1) {
    alert('最低1行は必要です（デモ）');
    return;
  }
  lineItems = lineItems.filter(i => i.id !== id);
  renderLineItems();
}

function calcTotals() {
  const subtotal = lineItems.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

function updatePreview() {
  const client = document.getElementById('clientName').value.trim() || '（未入力）';
  const dateVal = document.getElementById('quoteDate').value;
  const { subtotal, tax, total } = calcTotals();

  document.getElementById('previewClient').textContent = client + ' 御中';
  document.getElementById('previewDate').textContent = dateVal ? fmtDate(dateVal) : '—';
  document.getElementById('previewNo').textContent = document.getElementById('quoteNo').value;

  document.getElementById('previewItems').innerHTML = lineItems
    .filter(i => i.name.trim())
    .map(i => `<tr>
      <td>${i.name}</td>
      <td>${i.qty}</td>
      <td>${fmt(i.price)}</td>
      <td>${fmt(i.qty * i.price)}</td>
    </tr>`).join('') || '<tr><td colspan="4" style="text-align:center;color:#999">品目を入力してください</td></tr>';

  document.getElementById('previewSubtotal').textContent = fmt(subtotal);
  document.getElementById('previewTax').textContent = fmt(tax);
  document.getElementById('previewTotal').textContent = fmt(total);
}

function handlePrint() {
  if (typeof window.print === 'function') {
    window.print();
  } else {
    alert('PDF出力（デモ）\n\n実際のシステムではPDFファイルが生成・ダウンロードされます。');
  }
}

function resetForm() {
  lineItems = DEFAULT_ITEMS.map(item => ({ ...item, id: crypto.randomUUID() }));
  document.getElementById('clientName').value = '株式会社テックソリューション';
  initDate();
  renderLineItems();
}

document.getElementById('clientName').addEventListener('input', updatePreview);
document.getElementById('quoteDate').addEventListener('change', updatePreview);
document.getElementById('addLine').addEventListener('click', addLine);
document.getElementById('printBtn').addEventListener('click', handlePrint);
document.getElementById('resetBtn').addEventListener('click', resetForm);

document.addEventListener('DOMContentLoaded', () => {
  initDate();
  renderLineItems();
});
