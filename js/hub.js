/**
 * Portfolio data — used to render & filter works grid
 */
const PORTFOLIO = [
  { type: 'tool', tags: ['API', '連携', 'Webhook'], title: 'SyncBridge API連携', category: '業務自動化', desc: '注文・問い合わせをAPI/Webhook経由でスプレッドシートへ自動同期。連携フローをリアルタイム可視化。', url: 'api-sync-demo/index.html', thumb: 'api-sync-demo/assets/images/preview.png', badge: 'Tool', featured: true, stack: ['HTML', 'CSS', 'JavaScript', 'Fetch API', 'Webhook'], case: { challenge: 'フォームやECのデータを手動でスプレッドシートに転記', solution: 'Webhook受信→API連携→シート自動反映の一気通貫フロー', effect: '転記ミスゼロ・反映まで数秒に短縮' } },
  { type: 'tool', tags: ['カンバン', 'タスク', 'プロジェクト'], title: 'FlowBoard カンバン', category: '業務ツール', desc: 'ドラッグ&ドロップで案件ステータスを管理。未着手・進行中・完了の3列ボード。', url: 'kanban-demo/index.html', thumb: 'kanban-demo/assets/images/preview.png', badge: 'Tool', featured: true, stack: ['HTML', 'CSS', 'JavaScript', 'LocalStorage', 'Drag & Drop'], case: { challenge: '案件の進捗がチャットとExcelに散らばり把握できない', solution: 'カンバンUIでステータスを一元管理・ドラッグで更新', effect: '進捗の見える化で確認工数を大幅削減' } },
  { type: 'tool', tags: ['会員', '決済', 'EC'], title: 'MemberPortal 会員・決済', category: '業務ツール', desc: 'ログイン・プロフィール編集・注文履歴・Stripe風チェックアウトUIの会員ポータル。', url: 'portal-demo/index.html', thumb: 'portal-demo/assets/images/preview.png', badge: 'Tool', featured: true, stack: ['HTML', 'CSS', 'JavaScript', 'Auth', 'LocalStorage'], case: { challenge: 'ECサイトに会員機能と決済導線がなくリピート率が伸びない', solution: 'マイページ＋注文履歴＋決済UIを一体で構築', effect: '会員登録〜購入完了までの導線を一本化' } },
  { type: 'tool', tags: ['通知', 'フォーム', 'Slack'], title: 'FormNotify 問い合わせ通知', category: '業務ツール', desc: '問い合わせフォーム送信時にメール・Slackへ自動通知。通知フローをリアルタイム表示。', url: 'form-notify-demo/index.html', thumb: 'form-notify-demo/assets/images/preview.png', badge: 'Tool', featured: true, stack: ['HTML', 'CSS', 'JavaScript', 'Webhook'], case: { challenge: '問い合わせメールの見落とし・対応遅れが発生', solution: 'フォーム送信と同時にメール・Slackへ自動通知', effect: '初動対応を即時化し取りこぼしを防止' } },
  { type: 'tool', tags: ['管理画面', 'ダッシュボード', 'UI'], title: 'AdminPanel 管理画面', category: '業務ツール', desc: 'ログイン・ダッシュボード・ユーザー管理テーブル。編集モーダル付き管理画面デモ。', url: 'admin-demo/index.html', thumb: 'admin-demo/assets/images/preview.png', badge: 'Tool', featured: true, stack: ['HTML', 'CSS', 'JavaScript', 'Auth', 'LocalStorage'], case: { challenge: 'データ更新のたびに開発者へ依頼が必要', solution: 'ログイン付き管理画面で非エンジニアでも編集可能に', effect: '更新作業を内製化し依頼コストを削減' } },
  { type: 'tool', tags: ['自動化', 'ダッシュボード'], title: 'SalesFlow 売上集計', category: '業務自動化', desc: 'Excel・CSVの手作業集計を自動化。動くダッシュボード・グラフ・CSVエクスポート。', url: 'automation-demo/index.html', thumb: 'automation-demo/assets/images/preview.png', badge: 'Tool', featured: true, stack: ['HTML', 'CSS', 'JavaScript', 'Chart.js', 'CSV'], case: { challenge: '複数店舗の売上を毎月手作業で集計', solution: 'CSV取込→自動集計→グラフ化ダッシュボード', effect: '集計時間を3時間→10秒に短縮' } },
  { type: 'tool', tags: ['自動化', '勤怠'], title: 'TimeTrack 勤怠集計', category: '業務自動化', desc: '複数CSVから勤怠・残業を自動集計。部署別グラフ・出勤率の可視化。', url: 'attendance-demo/index.html', thumb: 'attendance-demo/assets/images/preview.png', badge: 'Tool', featured: true, stack: ['HTML', 'CSS', 'JavaScript', 'Chart.js', 'CSV'], case: { challenge: '勤怠CSVのフォーマットがバラバラで集計に半日', solution: '複数形式のCSVを統一フォーマットで自動集計', effect: '月末の勤怠締め作業を数分で完了' } },
  { type: 'tool', tags: ['CRM', '顧客管理', 'ダッシュボード'], title: 'CRM Lite 顧客管理', category: '業務ツール', desc: '顧客情報・商談ステータス・フォロー予定を一元管理。検索・フィルター・追加モーダル付き。', url: 'crm-demo/index.html', thumb: 'crm-demo/assets/images/preview.png', badge: 'Tool', featured: true, stack: ['HTML', 'CSS', 'JavaScript', 'LocalStorage'], case: { challenge: '顧客リストがExcelと名刺で分散管理', solution: 'CRMダッシュボードでステータス・フォロー日を一元化', effect: '商談漏れを防ぎフォロー率を向上' } },
  { type: 'tool', tags: ['チャットボット', 'FAQ', '美容室'], title: 'HelpBot FAQチャット', category: '業務ツール', desc: '店舗サイトに埋め込むFAQチャットボット。キーワード応答・提案質問・入力アニメーション。', url: 'faq-bot-demo/index.html', thumb: 'faq-bot-demo/assets/images/preview.png', badge: 'Tool', featured: true, case: { challenge: '営業時間・料金の問い合わせが電話対応を圧迫', solution: 'サイト埋め込み型FAQチャットで自動応答', effect: '定型的な問い合わせ対応を70%削減（想定）' } },
  { type: 'tool', tags: ['予約', 'UI'], title: 'Reserve+ 予約システム', category: '業務ツール', desc: 'サロン・飲食向けの予約UIデモ。日時選択→メニュー→確認の4ステップ。', url: 'booking-demo/index.html', thumb: 'booking-demo/assets/images/preview.png', badge: 'Tool', featured: true, case: { challenge: '電話予約のみで営業時間外の取りこぼし', solution: '4ステップのWeb予約UIで24時間受付', effect: '予約導線をオンライン化し機会損失を防止' } },
  { type: 'tool', tags: ['自動化', '請求書', '入金'], title: 'BillTrack 請求管理', category: '業務自動化', desc: '請求書・入金状況を一元管理。未入金・期限超過を自動で可視化。', url: 'invoice-demo/index.html', thumb: 'invoice-demo/assets/images/preview.png', badge: 'Tool', featured: true, stack: ['HTML', 'CSS', 'JavaScript', 'Chart.js', 'CSV'], case: { challenge: '未入金・期限超過の請求書を見落とす', solution: '請求データを取込みステータス別に自動可視化', effect: '入金漏れを防止しキャッシュフローを改善' } },
  { type: 'tool', tags: ['自動化', '在庫'], title: 'StockAlert 在庫管理', category: '業務自動化', desc: '在庫不足・欠品をアラート。カテゴリ別の在庫状況をダッシュボードで把握。', url: 'inventory-demo/index.html', thumb: 'inventory-demo/assets/images/preview.png', badge: 'Tool', featured: true, stack: ['HTML', 'CSS', 'JavaScript', 'Chart.js', 'CSV'], case: { challenge: '在庫切れに気づかず機会損失が発生', solution: '在庫CSV取込→不足アラート→要発注リスト自動生成', effect: '欠品を未然に防ぎ発注判断を迅速化' } },
  { type: 'tool', tags: ['自動化', '経費'], title: 'ExpenseFlow 経費精算', category: '業務自動化', desc: '経費申請の承認ワークフロー。カテゴリ別集計・月次推移グラフ。', url: 'expense-demo/index.html', thumb: 'expense-demo/assets/images/preview.png', badge: 'Tool', featured: true, stack: ['HTML', 'CSS', 'JavaScript', 'Chart.js', 'CSV'], case: { challenge: '経費申請の承認が紙・メールで非効率', solution: '申請一覧→承認/却下→カテゴリ別集計を自動化', effect: '経費処理のリードタイムを大幅短縮' } },
  { type: 'tool', tags: ['見積書', 'UI'], title: 'QuoteQuick 見積作成', category: '業務ツール', desc: '品目を入力するだけで見積書を自動生成。プレビュー・PDF出力（デモ）。', url: 'quote-demo/index.html', thumb: 'quote-demo/assets/images/preview.png', badge: 'Tool', featured: true, case: { challenge: '見積書をWordで毎回手作りし時間がかかる', solution: '品目入力→見積プレビュー→PDF出力を自動化', effect: '見積作成時間を15分→2分に短縮' } },
  { type: 'tool', tags: ['デスクトップ', '整理', 'ファイル'], title: 'TidyDesk フォルダ整理', category: 'デスクトップアプリ', desc: 'ダウンロードフォルダを種類別に自動仕分け。デスクトップアプリ風UIのデモ。', url: 'tidy-desk-demo/index.html', thumb: 'tidy-desk-demo/assets/images/preview.png', badge: 'App', featured: true, case: { challenge: 'ダウンロードフォルダが散らかりファイルが見つからない', solution: '拡張子・カテゴリ別の自動仕分けツール', effect: 'ファイル検索時間を削減し作業効率を向上' } },
  { type: 'tool', tags: ['デスクトップ', 'リネーム', 'ファイル'], title: 'BatchRename 一括リネーム', category: 'デスクトップアプリ', desc: 'プレフィックス・連番・置換ルールでファイル名を一括変更。プレビュー付き。', url: 'rename-demo/index.html', thumb: 'rename-demo/assets/images/preview.png', badge: 'App', case: { challenge: '大量ファイルのリネームに手作業で時間がかかる', solution: 'ルール指定→プレビュー→一括リネーム', effect: '100ファイルのリネームを数秒で完了' } },
  { type: 'tool', tags: ['デスクトップ', 'PDF'], title: 'PDF Stitch 結合・分割', category: 'デスクトップアプリ', desc: '複数PDFの結合・ページ分割。並べ替えてワンクリック処理（デモ）。', url: 'pdf-merge-demo/index.html', thumb: 'pdf-merge-demo/assets/images/preview.png', badge: 'App', case: { challenge: '複数PDFの結合・分割を都度ソフトで手作業', solution: 'ドラッグ並べ替え→ワンクリック結合/分割', effect: 'PDF処理の手間を大幅に削減' } },
  { type: 'tool', tags: ['デスクトップ', '重複', 'ファイル'], title: 'DupScan 重複検出', category: 'デスクトップアプリ', desc: '重複ファイルをスキャンしてグループ表示。整理ボタンで一括処理（デモ）。', url: 'duplicate-demo/index.html', thumb: 'duplicate-demo/assets/images/preview.png', badge: 'App', case: { challenge: '同じファイルが複数コピーされストレージを圧迫', solution: '重複ファイルをグループ検出→一括整理', effect: '不要ファイルを安全に削除し容量を確保' } },
  { type: 'tool', tags: ['デスクトップ', '画像', 'リサイズ'], title: 'ResizeKit 画像リサイズ', category: 'デスクトップアプリ', desc: '画像をWeb用・SNS用プリセットで一括リサイズ。実際にダウンロード可能。', url: 'resize-demo/index.html', thumb: 'resize-demo/assets/images/preview.png', badge: 'App', stack: ['HTML', 'CSS', 'JavaScript', 'Canvas API'], case: { challenge: 'SNS・Web用に画像サイズを1枚ずつ調整', solution: 'プリセット一括リサイズ＋Canvas処理', effect: '画像加工時間を10分の1に短縮' } },
  { type: 'tool', tags: ['デスクトップ', '定型文', '効率化'], title: 'SnipPaste 定型文', category: 'デスクトップアプリ', desc: 'よく使うメール文面をワンクリックでコピー。カテゴリ検索付きランチャー。', url: 'snippet-demo/index.html', thumb: 'snippet-demo/assets/images/preview.png', badge: 'App', case: { challenge: '同じメール文面を毎回コピペで作成', solution: 'カテゴリ別定型文ランチャーでワンクリックコピー', effect: 'メール作成時間を半減' } },
  { type: 'tool', tags: ['シフト', '店舗', 'UI'], title: 'ShiftBoard シフト管理', category: '業務ツール', desc: '週間シフト表をクリックで編集。早番・遅番・全日を色分け、勤務時間を自動集計。', url: 'shift-demo/index.html', thumb: 'shift-demo/assets/images/preview.png', badge: 'Tool', featured: true, case: { challenge: '紙・Excelのシフト表で変更が煩雑', solution: 'クリック操作の週間シフトボード＋自動集計', effect: 'シフト作成・共有の手間を削減' } },
  { type: 'tool', tags: ['アンケート', '集計', 'NPS'], title: 'SurveySnap アンケート集計', category: '業務自動化', desc: '満足度・NPS・自由記述を自動集計。棒グラフ・ドーナツ・キーワードタグで可視化。', url: 'survey-demo/index.html', thumb: 'survey-demo/assets/images/preview.png', badge: 'Tool', featured: true, stack: ['HTML', 'CSS', 'JavaScript', 'Chart.js'], case: { challenge: 'アンケート結果を手作業でグラフ化', solution: '回答データを自動集計→NPS・満足度を可視化', effect: '集計・レポート作成を即時化' } },
  { type: 'lp', tags: ['美容'], title: '美容室 LUMIÈRE', category: '美容・サロン', desc: 'メニュー・スタイリスト紹介・予約導線を備えた美容室LP。', url: 'salon-lp/index.html', thumb: 'salon-lp/assets/images/concept-main.jpg', badge: 'LP', case: { challenge: '新規集客用のWebサイトがなく予約が電話のみ', solution: 'メニュー・スタイリスト紹介付きの美容室LP', effect: 'Web経由の予約導線を確保' } },
  { type: 'lp', tags: ['美容', '整体'], title: '整体院 和', category: '整体・ウェルネス', desc: '施術メニュー・お客様の声・初回体験訴求の整体LP。', url: 'wellness-lp/index.html', thumb: 'wellness-lp/assets/images/hero.jpg', badge: 'LP', case: { challenge: '初回来院のハードルが高く新規が伸びない', solution: '施術メニュー＋体験訴求の整体LP', effect: '初回体験への導線を強化' } },
  { type: 'lp', tags: ['飲食'], title: 'CAFÉ KOMOREBI', category: '飲食・カフェ', desc: 'こだわり・メニュー・空間紹介のカフェLP。', url: 'cafe-lp/index.html', thumb: 'cafe-lp/assets/images/hero.jpg', badge: 'LP', case: { challenge: '店舗の魅力がSNSだけでは伝わりきらない', solution: 'こだわり・メニューを伝えるカフェLP', effect: '来店前の期待値を高め集客を支援' } },
  { type: 'lp', tags: ['医療'], title: 'さくら内科クリニック', category: '医療・クリニック', desc: '診療科目・診療時間・アクセスのクリニックLP。', url: 'clinic-lp/index.html', thumb: 'clinic-lp/assets/images/hero.jpg', badge: 'LP', case: { challenge: '診療時間・科目の問い合わせが多い', solution: '診療情報を網羅したクリニックLP', effect: '電話問い合わせを削減し患者の利便性向上' } },
  { type: 'lp', tags: ['士業'], title: '税理士法人 山田会計', category: '士業・専門家', desc: '業務内容・相談フロー・無料相談CTAの税理士LP。', url: 'professional-lp/index.html', thumb: 'professional-lp/assets/images/hero.jpg', badge: 'LP', case: { challenge: '初回相談への申込み導線が弱い', solution: '業務内容＋無料相談CTAの士業LP', effect: '相談申込みのハードルを下げる' } },
  { type: 'lp', tags: ['士業'], title: '行政書士 田中事務所', category: '士業・専門家', desc: 'ビザ・会社設立・許認可の行政書士向けLP。', url: 'gyosei-lp/index.html', thumb: 'gyosei-lp/assets/images/hero.jpg', badge: 'LP', case: { challenge: '対応業務が多く何を頼めるか分かりにくい', solution: 'ビザ・許認可など業務別に整理したLP', effect: '依頼内容の明確化で問い合わせ精度向上' } },
  { type: 'lp', tags: ['不動産'], title: 'LIVIO 表参道', category: '不動産', desc: '賃貸マンションの物件紹介LP。設備・間取り・問い合わせ導線。', url: 'realestate-lp/index.html', thumb: 'realestate-lp/assets/images/hero.jpg', badge: 'LP', case: { challenge: '物件の魅力が一覧サイトでは伝わらない', solution: '設備・間取りを訴求する物件LP', effect: '内見申込みへの導線を強化' } },
  { type: 'lp', tags: ['建設'], title: '株式会社 匠リフォーム', category: '建設・リフォーム', desc: '施工事例・実績数・無料見積もりのリフォームLP。', url: 'construction-lp/index.html', thumb: 'construction-lp/assets/images/hero.jpg', badge: 'LP', case: { challenge: '施工実績が見えず見積依頼に至らない', solution: '事例・実績数を前面にしたリフォームLP', effect: '見積依頼の信頼感を醸成' } },
  { type: 'lp', tags: ['EC'], title: 'STUDIO K', category: 'EC・物販', desc: 'ファッション商品のシングルプロダクトページ。サイズ選択・カートUI。', url: 'ec-lp/index.html', thumb: 'ec-lp/assets/images/hero.jpg', badge: 'LP', case: { challenge: '商品の魅力が伝わる販売ページがない', solution: 'サイズ選択・カートUI付き商品LP', effect: '購入導線を明確化' } },
  { type: 'lp', tags: ['教育'], title: '進学塾 ブレインズ', category: '教育・スクール', desc: 'コース紹介・合格実績・無料体験の学習塾LP。', url: 'school-lp/index.html', thumb: 'school-lp/assets/images/hero.jpg', badge: 'LP', case: { challenge: '体験授業の申込みが電話中心', solution: '合格実績＋無料体験CTAの塾LP', effect: 'Webからの体験申込みを促進' } },
  { type: 'lp', tags: ['イベント'], title: 'Wedding Venue LUCE', category: '結婚式場', desc: 'プラン・ギャラリー・見学予約のウェディング会場LP。', url: 'wedding-lp/index.html', thumb: 'wedding-lp/assets/images/hero.jpg', badge: 'LP', case: { challenge: '会場の雰囲気が伝わらず見学予約が少ない', solution: 'プラン・ギャラリー付きウェディングLP', effect: '見学予約への動機づけを強化' } },
  { type: 'lp', tags: ['SaaS', 'IT'], title: 'TaskPilot', category: 'SaaS・アプリ', desc: 'プロジェクト管理SaaSのLP。機能・料金プラン・登録CTA。', url: 'saas-lp/index.html', thumb: 'saas-lp/assets/images/hero.jpg', badge: 'LP', case: { challenge: 'SaaSの機能訴求が弱くトライアルに繋がらない', solution: '機能・料金プランを整理したSaaS LP', effect: '無料トライアルへの導線を確保' } },
  { type: 'hp', tags: ['採用'], title: '株式会社アトラス 採用', category: '採用・リクルート', desc: '文化・募集職種・福利厚生の採用特設ページ。', url: 'recruit-lp/index.html', thumb: 'recruit-lp/assets/images/hero.jpg', badge: 'HP', case: { challenge: '採用情報が本社サイトに埋もれている', solution: '文化・職種を訴求する採用特設ページ', effect: '応募者の会社理解を深めミスマッチ防止' } },
  { type: 'hp', tags: ['コーポレート'], title: '株式会社ネクストブリッジ', category: 'コーポレート', desc: '5ページ構成の企業HP。サービス・実績・お問い合わせ。', url: 'corporate-hp/index.html', thumb: 'corporate-hp/assets/images/hero.jpg', badge: 'HP', case: { challenge: '会社の信頼性を示すWebサイトがない', solution: '5ページ構成のコーポレートHP', effect: '取引先・採用候補者への信頼感を醸成' } },
  { type: 'hp', tags: ['メディア', 'ブログ'], title: 'Tech & Life', category: 'メディア・ブログ', desc: '記事一覧＋詳細ページのメディアサイト構成。', url: 'media-site/index.html', thumb: 'media-site/assets/images/hero.jpg', badge: 'HP', case: { challenge: '記事が散在しメディアとしての体裁がない', solution: '一覧＋記事詳細のメディアサイト構成', effect: 'コンテンツの回遊率と滞在時間を向上' } },
];

const CHART_STACK = ['HTML', 'CSS', 'JavaScript', 'Chart.js'];
const CANVAS_STACK = ['HTML', 'CSS', 'JavaScript', 'Canvas API'];
const BASE_STACK = ['HTML', 'CSS', 'JavaScript'];
const STORAGE_STACK = ['HTML', 'CSS', 'JavaScript', 'LocalStorage'];

const STACK_BY_URL = {
  'automation-demo/index.html': CHART_STACK,
  'attendance-demo/index.html': CHART_STACK,
  'invoice-demo/index.html': CHART_STACK,
  'inventory-demo/index.html': CHART_STACK,
  'expense-demo/index.html': CHART_STACK,
  'survey-demo/index.html': CHART_STACK,
  'resize-demo/index.html': CANVAS_STACK,
  'crm-demo/index.html': STORAGE_STACK,
  'admin-demo/index.html': STORAGE_STACK,
};

function getStack(item) {
  return item.stack || STACK_BY_URL[item.url] || BASE_STACK;
}

function techClass(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function renderTechTags(stack) {
  return `<div class="card__stack">${stack.map(t =>
    `<span class="card__tech card__tech--${techClass(t)}">${t}</span>`
  ).join('')}</div>`;
}

function renderCaseStudy(c) {
  if (!c) return '';
  return `<div class="card__case">
    <div class="case-row"><span class="case-label case-label--challenge">課題</span><p>${c.challenge}</p></div>
    <div class="case-row"><span class="case-label case-label--solution">解決</span><p>${c.solution}</p></div>
    <div class="case-row"><span class="case-label case-label--effect">効果</span><p>${c.effect}</p></div>
  </div>`;
}

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
  const stack = getStack(item);
  return `
    <a href="${item.url}" class="card${featured}" target="_blank" rel="noopener"
       data-type="${item.type}" data-tags="${item.tags.join(' ')} ${item.title} ${item.category} ${item.desc} ${stack.join(' ')} ${item.case ? Object.values(item.case).join(' ') : ''}">
      <div class="card__thumb">
        <img src="${item.thumb}" alt="${item.title}" loading="lazy">
        <span class="${badgeClass(item.badge)}">${item.badge}</span>
      </div>
      <div class="card__body">
        <p class="card__category">${item.category}</p>
        <h2>${item.title}</h2>
        <p>${item.desc}</p>
        ${renderCaseStudy(item.case)}
        ${renderTechTags(stack)}
        <span class="card__link">${action}</span>
      </div>
    </a>`;
}

function filterItems() {
  return PORTFOLIO.filter(item => {
    const matchType = currentFilter === 'all' || item.type === currentFilter;
    const q = searchQuery.toLowerCase();
    const caseText = item.case ? Object.values(item.case).join(' ') : '';
    const haystack = `${item.title} ${item.category} ${item.desc} ${item.tags.join(' ')} ${getStack(item).join(' ')} ${caseText}`.toLowerCase();
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

document.getElementById('statTotal').textContent = PORTFOLIO.length;
document.getElementById('statTool').textContent = PORTFOLIO.filter(p => p.type === 'tool').length;
document.getElementById('statLp').textContent = PORTFOLIO.filter(p => p.type === 'lp').length;
document.getElementById('statHp').textContent = PORTFOLIO.filter(p => p.type === 'hp').length;

render();
