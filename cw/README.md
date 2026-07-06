# Food Huggers 提案LP（デモ）

CloudWorks応募用の制作デモです。**ポートフォリオ（hub.js）には未掲載**です。

## プレビュー

ローカル: `cw/cw-lp.html` をブラウザで開く  
デプロイ後: `https://（あなたのドメイン）/cw/cw-lp.html`

## 納品フォルダ構成

```
cw/
├── page.cw-lp.liquid   … Shopify用テンプレート
├── cw-lp.html          … ローカル確認用
├── cw-lp.css
├── cw-lp.js
└── cw-images/          … 既存LPから流用した画像
```

## Shopifyへのアップロード

1. `cw-lp.css` / `cw-lp.js` をテーマの `assets/` に配置
2. `cw-images/` 内の画像を `assets/cw-images/` に配置
3. `page.cw-lp.liquid` を `templates/` に配置
4. 管理画面でページを作成し、テンプレート「cw-lp」を選択

## デザイン方針

- ターゲット: 50〜60代女性
- 現行LP（fh-lp2）より温かみ・可読性重視（大きめ文字、落ち着いた配色）
- CSSクラスはすべて `cw-lp-` プレフィックス
- セクションごとに HTML コメントあり

## 差し替え箇所

- CTAのLINEリンク（`#cw-lp-cta` 内）
- フッターのデモ表記
- 価格・購入ボタン（クライアント様の構成案確定後）
