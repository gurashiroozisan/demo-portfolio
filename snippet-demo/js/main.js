const SNIPPETS = [
  {
    id: 1,
    title: 'お問い合わせ返信',
    category: 'customer',
    catLabel: 'カスタマー',
    text: `お問い合わせいただきありがとうございます。
担当の◯◯でございます。

ご質問の件、確認のうえ改めてご連絡いたします。
恐れ入りますが、2〜3営業日ほどお時間をいただけますと幸いです。

何卒よろしくお願いいたします。`,
  },
  {
    id: 2,
    title: '見積送付',
    category: 'sales',
    catLabel: '営業',
    text: `いつもお世話になっております。
◯◯株式会社の◯◯でございます。

ご依頼いただきました件、見積書を添付にてお送りいたします。
ご確認のうえ、ご不明点がございましたらお気軽にお申し付けください。

ご検討のほど、よろしくお願いいたします。`,
  },
  {
    id: 3,
    title: '日程調整',
    category: 'sales',
    catLabel: '営業',
    text: `お世話になっております。
打ち合わせの日程調整について、以下の候補日はいかがでしょうか。

・◯月◯日（◯） 10:00〜 / 14:00〜
・◯月◯日（◯） 11:00〜 / 15:00〜
・◯月◯日（◯） 13:00〜

ご都合の良い日時をお知らせいただけますと幸いです。`,
  },
  {
    id: 4,
    title: 'お礼メール',
    category: 'office',
    catLabel: '事務',
    text: `本日はお忙しい中、お時間をいただき誠にありがとうございました。

いただいたご意見を踏まえ、社内で検討のうえ改めてご報告いたします。
引き続きどうぞよろしくお願いいたします。`,
  },
  {
    id: 5,
    title: '資料送付',
    category: 'office',
    catLabel: '事務',
    text: `お世話になっております。
ご依頼の資料を添付ファイルにてお送りいたします。

ご確認のほど、よろしくお願いいたします。
追加で必要な資料がございましたら、お知らせください。`,
  },
  {
    id: 6,
    title: 'クレーム初回対応',
    category: 'customer',
    catLabel: 'カスタマー',
    text: `この度はご不便をおかけし、誠に申し訳ございません。
お寄せいただいた内容について、ただいま担当部署にて確認しております。

状況が分かり次第、改めてご連絡いたします。
お急ぎの場合は、お電話（◯◯-◯◯◯◯-◯◯◯◯）でも承っております。`,
  },
  {
    id: 7,
    title: 'フォローアップ',
    category: 'sales',
    catLabel: '営業',
    text: `先日はお打ち合わせの機会をいただき、ありがとうございました。

ご提案内容について、ご検討状況はいかがでしょうか。
追加のご質問やデモのご希望などございましたら、お気軽にお声がけください。`,
  },
  {
    id: 8,
    title: '不在連絡',
    category: 'office',
    catLabel: '事務',
    text: `平素より大変お世話になっております。

◯月◯日〜◯月◯日まで、◯◯の都合により不在とさせていただきます。
期間中のお問い合わせは、◯◯（◯◯@example.com）までお願いいたします。

何卒よろしくお願い申し上げます。`,
  },
];

const CAT_BADGE = { sales: 'snippet-item__badge--sales', office: 'snippet-item__badge--office', customer: 'snippet-item__badge--customer' };

let currentCategory = 'all';
let searchQuery = '';
let toastTimer = null;

const categoryList = document.getElementById('categoryList');
const searchInput = document.getElementById('searchInput');
const snippetList = document.getElementById('snippetList');
const emptyState = document.getElementById('emptyState');
const totalCount = document.getElementById('totalCount');
const visibleCount = document.getElementById('visibleCount');
const toast = document.getElementById('toast');

function filterSnippets() {
  return SNIPPETS.filter(s => {
    const matchCat = currentCategory === 'all' || s.category === currentCategory;
    const q = searchQuery.toLowerCase();
    const haystack = `${s.title} ${s.text} ${s.catLabel}`.toLowerCase();
    const matchSearch = !q || haystack.includes(q);
    return matchCat && matchSearch;
  });
}

function render() {
  const items = filterSnippets();
  totalCount.textContent = SNIPPETS.length;
  visibleCount.textContent = items.length;

  if (items.length === 0) {
    snippetList.innerHTML = '';
    snippetList.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  snippetList.classList.remove('hidden');
  snippetList.innerHTML = items.map(s => `
    <li class="snippet-item" data-id="${s.id}">
      <div class="snippet-item__head">
        <span class="snippet-item__title">${escapeHtml(s.title)}</span>
        <span class="snippet-item__badge ${CAT_BADGE[s.category]}">${s.catLabel}</span>
      </div>
      <p class="snippet-item__preview">${escapeHtml(s.text.replace(/\n/g, ' '))}</p>
      <p class="snippet-item__hint">クリックでコピー</p>
    </li>
  `).join('');

  snippetList.querySelectorAll('.snippet-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = Number(el.dataset.id);
      const snippet = SNIPPETS.find(s => s.id === id);
      if (snippet) copySnippet(snippet.text);
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function copySnippet(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  showToast();
}

function showToast() {
  toast.classList.remove('hidden');
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 2000);
}

categoryList.addEventListener('click', e => {
  const li = e.target.closest('li[data-cat]');
  if (!li) return;
  currentCategory = li.dataset.cat;
  categoryList.querySelectorAll('li').forEach(el => el.classList.toggle('active', el === li));
  render();
});

searchInput.addEventListener('input', e => {
  searchQuery = e.target.value.trim();
  render();
});

totalCount.textContent = SNIPPETS.length;
render();
