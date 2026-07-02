const FAQ_RULES = [
  {
    keywords: ['営業時間', '営業', '何時', '開店', '閉店', '定休', '休み', '時間'],
    answer: '営業時間は<strong>平日 10:00〜20:00</strong>、<strong>土日祝 9:00〜19:00</strong> です。定休日は<strong>火曜日</strong>となっております。最終受付は閉店30分前です。',
  },
  {
    keywords: ['料金', '値段', '価格', 'いくら', 'メニュー', 'カット', 'カラー', 'パーマ', 'トリートメント', '費用'],
    answer: '主なメニュー料金は以下の通りです：<br>・カット <strong>¥5,500〜</strong><br>・カラー <strong>¥8,800〜</strong><br>・パーマ <strong>¥13,200〜</strong><br>・トリートメント <strong>¥5,500〜</strong><br>※ 髪の長さ・使用薬剤により変動します。詳細はカウンセリング時にご案内します。',
  },
  {
    keywords: ['予約', '予約方法', '予約したい', '取りたい', '空き', 'line', 'ライン', '電話', 'web'],
    answer: 'ご予約は以下の方法で承っております：<br>① <strong>お電話</strong>：03-1234-5678<br>② <strong>LINE公式</strong>：@lumiere_salon<br>③ <strong>Web予約フォーム</strong>：24時間受付<br>当日予約も空きがあれば対応可能です。キャンセルは前日までにご連絡ください。',
  },
  {
    keywords: ['アクセス', '場所', '住所', '行き方', '駅', '駐車', '地図', '表参道', '神宮前'],
    answer: '<strong>東京都港区神宮前4-12-8 LUMIÈREビル 2F</strong><br>・<strong>表参道駅</strong> A2出口より徒歩3分<br>・明治神宮前駅 5番出口より徒歩7分<br>お車の場合は近隣コインパーキングをご利用ください（提携割引あり）。',
  },
  {
    keywords: ['駐車', 'パーキング', '車'],
    answer: '専用駐車場はございませんが、徒歩1分のコインパーキング3箇所と提携しており、ご利用の方に<strong>1時間無料サービス券</strong>をお渡ししています。',
  },
  {
    keywords: ['クレジット', 'カード', '支払', '現金', 'paypay', '電子マネー'],
    answer: 'お支払いは<strong>現金・各種クレジットカード・電子マネー（PayPay、交通系IC）</strong>に対応しております。',
  },
  {
    keywords: ['こんにちは', 'hello', 'はじめまして', 'よろしく'],
    answer: 'こんにちは！LUMIÈRE美容室のHelpBotです。営業時間・料金・予約・アクセスなど、お気軽にご質問ください 😊',
  },
  {
    keywords: ['ありがとう', '助かり', 'thanks'],
    answer: 'どういたしまして！他にご不明な点があれば、いつでもお聞きください。ご来店をお待ちしております ✨',
  },
];

const FALLBACK = '申し訳ございません、その内容にはお答えできません。営業時間・料金・予約方法・アクセスについてお聞きいただければご案内いたします。お急ぎの場合は <strong>03-1234-5678</strong> までお電話ください。';

const $ = (sel) => document.querySelector(sel);
const chatBody = $('#chatBody');
const chatWidget = $('#chatWidget');
const chatFab = $('#chatFab');
const typingIndicator = $('#typingIndicator');
const suggestions = $('#suggestions');
const fabBadge = $('#fabBadge');

let isOpen = false;
let hasInteracted = false;

function matchAnswer(text) {
  const normalized = text.toLowerCase().replace(/\s/g, '');
  for (const rule of FAQ_RULES) {
    if (rule.keywords.some(kw => normalized.includes(kw.toLowerCase()))) {
      return rule.answer;
    }
  }
  return FALLBACK;
}

function scrollToBottom() {
  chatBody.scrollTop = chatBody.scrollHeight;
}

function addMessage(text, isUser = false) {
  const div = document.createElement('div');
  div.className = `chat-msg chat-msg--${isUser ? 'user' : 'bot'}`;
  div.innerHTML = `<div class="chat-msg__bubble">${isUser ? escapeHtml(text) : text}</div>`;
  chatBody.appendChild(div);
  scrollToBottom();
}

function escapeHtml(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

function hideSuggestions() {
  if (suggestions) suggestions.style.display = 'none';
}

function showTyping() {
  typingIndicator.hidden = false;
  scrollToBottom();
}

function hideTyping() {
  typingIndicator.hidden = true;
}

function botReply(question) {
  const answer = matchAnswer(question);
  const delay = 600 + Math.random() * 800;

  showTyping();
  setTimeout(() => {
    hideTyping();
    addMessage(answer, false);
  }, delay);
}

function handleUserMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  hasInteracted = true;
  fabBadge.parentElement.classList.add('no-badge');

  if (suggestions && suggestions.style.display !== 'none') {
    hideSuggestions();
  }

  addMessage(trimmed, true);
  botReply(trimmed);
}

function openChat() {
  isOpen = true;
  chatWidget.hidden = false;
  chatFab.classList.add('is-open');
  fabBadge.parentElement.classList.add('no-badge');
  $('#chatInput').focus();
}

function closeChat() {
  isOpen = false;
  chatWidget.hidden = true;
  chatFab.classList.remove('is-open');
}

chatFab.addEventListener('click', () => {
  if (isOpen) closeChat();
  else openChat();
});

$('#minimizeChat').addEventListener('click', closeChat);

$('#chatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $('#chatInput');
  handleUserMessage(input.value);
  input.value = '';
});

suggestions.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-q]');
  if (!btn) return;
  handleUserMessage(btn.dataset.q);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isOpen) closeChat();
});

// Open by default so the page immediately reads as a chatbot demo.
openChat();
