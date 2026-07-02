/**
 * Portfolio data — used to render & filter works grid
 */
const PORTFOLIO = [
  { type: 'tool', tags: ['自動化', 'ダッシュボード'], title: 'SalesFlow 売上集計', category: '業務自動化', desc: 'Excel・CSVの手作業集計を自動化。動くダッシュボード・グラフ・CSVエクスポート。', url: 'automation-demo/index.html', thumb: 'automation-demo/assets/images/preview.png', badge: 'Tool', featured: true },
  { type: 'tool', tags: ['自動化', '勤怠'], title: 'TimeTrack 勤怠集計', category: '業務自動化', desc: '複数CSVから勤怠・残業を自動集計。部署別グラフ・出勤率の可視化。', url: 'attendance-demo/index.html', thumb: 'attendance-demo/assets/images/preview.png', badge: 'Tool', featured: true },
  { type: 'tool', tags: ['予約', 'UI'], title: 'Reserve+ 予約システム', category: '業務ツール', desc: 'サロン・飲食向けの予約UIデモ。日時選択→メニュー→確認の4ステップ。', url: 'booking-demo/index.html', thumb: 'booking-demo/assets/images/preview.png', badge: 'Tool', featured: true },
  { type: 'tool', tags: ['自動化', '請求書', '入金'], title: 'BillTrack 請求管理', category: '業務自動化', desc: '請求書・入金状況を一元管理。未入金・期限超過を自動で可視化。', url: 'invoice-demo/index.html', thumb: 'invoice-demo/assets/images/preview.png', badge: 'Tool', featured: true },
  { type: 'tool', tags: ['自動化', '在庫'], title: 'StockAlert 在庫管理', category: '業務自動化', desc: '在庫不足・欠品をアラート。カテゴリ別の在庫状況をダッシュボードで把握。', url: 'inventory-demo/index.html', thumb: 'inventory-demo/assets/images/preview.png', badge: 'Tool', featured: true },
  { type: 'tool', tags: ['自動化', '経費'], title: 'ExpenseFlow 経費精算', category: '業務自動化', desc: '経費申請の承認ワークフロー。カテゴリ別集計・月次推移グラフ。', url: 'expense-demo/index.html', thumb: 'expense-demo/assets/images/preview.png', badge: 'Tool', featured: true },
  { type: 'tool', tags: ['見積書', 'UI'], title: 'QuoteQuick 見積作成', category: '業務ツール', desc: '品目を入力するだけで見積書を自動生成。プレビュー・PDF出力（デモ）。', url: 'quote-demo/index.html', thumb: 'quote-demo/assets/images/preview.png', badge: 'Tool', featured: true },
  { type: 'tool', tags: ['デスクトップ', '整理', 'ファイル'], title: 'TidyDesk フォルダ整理', category: 'デスクトップアプリ', desc: 'ダウンロードフォルダを種類別に自動仕分け。デスクトップアプリ風UIのデモ。', url: 'tidy-desk-demo/index.html', thumb: 'tidy-desk-demo/assets/images/preview.png', badge: 'App', featured: true },
  { type: 'lp', tags: ['美容'], title: '美容室 LUMIÈRE', category: '美容・サロン', desc: 'メニュー・スタイリスト紹介・予約導線を備えた美容室LP。', url: 'salon-lp/index.html', thumb: 'salon-lp/assets/images/concept-main.jpg', badge: 'LP' },
  { type: 'lp', tags: ['美容', '整体'], title: '整体院 和', category: '整体・ウェルネス', desc: '施術メニュー・お客様の声・初回体験訴求の整体LP。', url: 'wellness-lp/index.html', thumb: 'wellness-lp/assets/images/hero.jpg', badge: 'LP' },
  { type: 'lp', tags: ['飲食'], title: 'CAFÉ KOMOREBI', category: '飲食・カフェ', desc: 'こだわり・メニュー・空間紹介のカフェLP。', url: 'cafe-lp/index.html', thumb: 'cafe-lp/assets/images/hero.jpg', badge: 'LP' },
  { type: 'lp', tags: ['医療'], title: 'さくら内科クリニック', category: '医療・クリニック', desc: '診療科目・診療時間・アクセスのクリニックLP。', url: 'clinic-lp/index.html', thumb: 'clinic-lp/assets/images/hero.jpg', badge: 'LP' },
  { type: 'lp', tags: ['士業'], title: '税理士法人 山田会計', category: '士業・専門家', desc: '業務内容・相談フロー・無料相談CTAの税理士LP。', url: 'professional-lp/index.html', thumb: 'professional-lp/assets/images/hero.jpg', badge: 'LP' },
  { type: 'lp', tags: ['士業'], title: '行政書士 田中事務所', category: '士業・専門家', desc: 'ビザ・会社設立・許認可の行政書士向けLP。', url: 'gyosei-lp/index.html', thumb: 'gyosei-lp/assets/images/hero.jpg', badge: 'LP' },
  { type: 'lp', tags: ['不動産'], title: 'LIVIO 表参道', category: '不動産', desc: '賃貸マンションの物件紹介LP。設備・間取り・問い合わせ導線。', url: 'realestate-lp/index.html', thumb: 'realestate-lp/assets/images/hero.jpg', badge: 'LP' },
  { type: 'lp', tags: ['建設'], title: '株式会社 匠リフォーム', category: '建設・リフォーム', desc: '施工事例・実績数・無料見積もりのリフォームLP。', url: 'construction-lp/index.html', thumb: 'construction-lp/assets/images/hero.jpg', badge: 'LP' },
  { type: 'lp', tags: ['EC'], title: 'STUDIO K', category: 'EC・物販', desc: 'ファッション商品のシングルプロダクトページ。サイズ選択・カートUI。', url: 'ec-lp/index.html', thumb: 'ec-lp/assets/images/hero.jpg', badge: 'LP' },
  { type: 'lp', tags: ['教育'], title: '進学塾 ブレインズ', category: '教育・スクール', desc: 'コース紹介・合格実績・無料体験の学習塾LP。', url: 'school-lp/index.html', thumb: 'school-lp/assets/images/hero.jpg', badge: 'LP' },
  { type: 'lp', tags: ['イベント'], title: 'Wedding Venue LUCE', category: '結婚式場', desc: 'プラン・ギャラリー・見学予約のウェディング会場LP。', url: 'wedding-lp/index.html', thumb: 'wedding-lp/assets/images/hero.jpg', badge: 'LP' },
  { type: 'lp', tags: ['SaaS', 'IT'], title: 'TaskPilot', category: 'SaaS・アプリ', desc: 'プロジェクト管理SaaSのLP。機能・料金プラン・登録CTA。', url: 'saas-lp/index.html', thumb: 'saas-lp/assets/images/hero.jpg', badge: 'LP' },
  { type: 'hp', tags: ['採用'], title: '株式会社アトラス 採用', category: '採用・リクルート', desc: '文化・募集職種・福利厚生の採用特設ページ。', url: 'recruit-lp/index.html', thumb: 'recruit-lp/assets/images/hero.jpg', badge: 'HP' },
  { type: 'hp', tags: ['コーポレート'], title: '株式会社ネクストブリッジ', category: 'コーポレート', desc: '5ページ構成の企業HP。サービス・実績・お問い合わせ。', url: 'corporate-hp/index.html', thumb: 'corporate-hp/assets/images/hero.jpg', badge: 'HP' },
  { type: 'hp', tags: ['メディア', 'ブログ'], title: 'Tech & Life', category: 'メディア・ブログ', desc: '記事一覧＋詳細ページのメディアサイト構成。', url: 'media-site/index.html', thumb: 'media-site/assets/images/hero.jpg', badge: 'HP' },
];

const grid = document.getElementById('grid');
const searchInput = document.getElementById('search');
const filterBtns = document.querySelectorAll('.filter__btn');
const resultCount = document.getElementById('resultCount');
const emptyState = document.getElementById('emptyState');

let currentFilter = 'all';
let searchQuery = '';

function badgeClass(badge) {
  if (badge === 'Tool') return 'card__badge card__badge--tool';
  if (badge === 'App') return 'card__badge card__badge--app';
  if (badge === 'HP') return 'card__badge card__badge--hp';
  return 'card__badge';
}

function renderCard(item) {
  const featured = item.featured ? ' card--featured' : '';
  const action = item.type === 'tool' ? 'デモを試す →' : 'デモを見る →';
  return `
    <a href="${item.url}" class="card${featured}" target="_blank" rel="noopener"
       data-type="${item.type}" data-tags="${item.tags.join(' ')} ${item.title} ${item.category} ${item.desc}">
      <div class="card__thumb">
        <img src="${item.thumb}" alt="${item.title}" loading="lazy">
        <span class="${badgeClass(item.badge)}">${item.badge}</span>
      </div>
      <div class="card__body">
        <p class="card__category">${item.category}</p>
        <h2>${item.title}</h2>
        <p>${item.desc}</p>
        <span class="card__link">${action}</span>
      </div>
    </a>`;
}

function filterItems() {
  return PORTFOLIO.filter(item => {
    const matchType = currentFilter === 'all' || item.type === currentFilter;
    const q = searchQuery.toLowerCase();
    const haystack = `${item.title} ${item.category} ${item.desc} ${item.tags.join(' ')}`.toLowerCase();
    const matchSearch = !q || haystack.includes(q);
    return matchType && matchSearch;
  });
}

function render() {
  const items = filterItems();
  grid.innerHTML = items.map(renderCard).join('');
  resultCount.textContent = `${items.length} 件`;
  emptyState.hidden = items.length > 0;
  grid.hidden = items.length === 0;
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  render();
});

// Stats
document.getElementById('statTotal').textContent = PORTFOLIO.length;
document.getElementById('statTool').textContent = PORTFOLIO.filter(p => p.type === 'tool').length;
document.getElementById('statLp').textContent = PORTFOLIO.filter(p => p.type === 'lp').length;
document.getElementById('statHp').textContent = PORTFOLIO.filter(p => p.type === 'hp').length;

render();
