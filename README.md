# Site Collection — ポートフォリオサイト

制作したWebサイト・アプリを1か所にまとめ、リンクを送るだけで相手がすぐに作品を見られるポートフォリオサイトです。

## ★ フォルダの運用ルール（重要）

**デスクトップに作品フォルダを増やさず、すべてこの `Site-Collection` の中に格納します。**

| 作ったもの | 格納先 | 例 |
|---|---|---|
| **Webサイト**（HTML/CSS/JSだけで動く静的サイト） | `works/サイト名/` | `works/reoma-website/` |
| **Webアプリ**（サーバーやDBが必要なアプリの開発プロジェクト一式） | `apps/アプリ名/` | `apps/Quiz_Claude/` |

- `works/` に入れたサイトは、そのまま公開されて閲覧できます（`url: "works/サイト名/index.html"` をカードに設定）
- `apps/` は Webアプリ（ゲーム・ツール類）の置き場です。
  **HTML/CSS/JSだけで動くアプリ**（オセロ・2048など）は、そのまま `apps/アプリ名/index.html` を
  カードにリンクすれば遊べます（フォルダを移動してもURLだけ直せばOK）。
  **サーバーやDBが必要なアプリ**（Java/Spring Boot 等）は本体を `apps/` に置きつつ、
  ブラウザで動く紹介ページ・デモ版を `works/` に作ってカードはそちらへリンクします
  （例: `apps/Quiz_Claude/`（本体） と `works/quiz-claude/`（遊べるデモ） のセット）

### 新しい作品を追加する手順

1. 完成したフォルダを上のルールどおり `works/` または `apps/` に移動する
2. `js/projects.js` の `PROJECTS` にカードを1ブロック追加する（下記参照）
3. サムネイル画像を `images/` に入れる（任意）
4. 公開している場合は、GitHubにpushして反映する

## ファイル構成

```
Site-Collection/
├── index.html        … ページ本体（基本的に編集不要）
├── css/
│   └── style.css     … デザイン（色やフォントを変えたいときはここ）
├── js/
│   ├── projects.js   … ★ 作品データ・設定（普段編集するのはここだけ）
│   └── main.js       … 動作ロジック（編集不要）
├── images/           … 作品のサムネイル画像置き場
├── works/            … ★ Webサイト（静的）をフォルダごと置く場所
│   ├── entertainment-website/ … STELLA PRODUCTION（芸能事務所サイト）
│   ├── fortnite/     … TORANOBU_GAME（フォートナイト風の紹介ページ）
│   ├── reoma-website/ … ※準備中（中身が入ったらカード追加）
│   └── …            … そのほかの作品サイト
├── apps/             … ★ Webアプリ（ゲーム・ツール類）を置く場所
│   ├── quiz-claude/  … かわいいクイズランド（紹介ページ＋遊べるデモ）
│   ├── history-quiz/ … 日本史クイズ（4択・旧石器〜江戸・そのまま遊べる）
│   ├── othello/      … パンダオセロ（1人用リバーシ・そのまま遊べる）
│   ├── neon-2048/    … NEON 2048（スライドパズル・そのまま遊べる）
│   └── Web-Appli-A/  … ※準備中
└── README.md         … このファイル
```

## 作品カードの追加方法

`js/projects.js` の `PROJECTS` 配列にブロックをコピペして書き換えます。

```js
{
  title: "作品名",
  description: "1〜2文の紹介文。",
  url: "works/my-site/index.html",  // works内の相対パス or "https://..."
  category: "webapp",            // webapp / website / game
  tags: ["HTML", "CSS"],         // 使用技術
  emoji: "🚀",                   // サムネイル用の絵文字
  image: "",                     // スクショを使う場合 → "images/xxx.png"
  date: "2026",                  // 制作時期
  featured: true,                // 代表作なら true（大きく表示・1つ推奨）
},
```

- カテゴリは「Webアプリ・Webサイト・ゲーム」の3つ。**ゲームカテゴリはフォートナイト
  （TORANOBU_GAME）専用**で、カードは `works/fortnite/` の紹介ページ経由で
  公式クリエイターページ（fortnite.com/@toranobu_game）へリンクしています
- 一覧は4件ごとのページネーション付き。ページ数は作品数に応じて自動で増えます
  （1ページの件数は `projects.js` の `ITEMS_PER_PAGE` で変更可）

## 主な機能

- **1クリックで作品を開く** — カード全体がリンク。新しいタブで実物が開きます
- **カテゴリ絞り込み・検索** — `/` キーで検索欄にフォーカス
- **ページネーション** — 4件区切り・作品数に応じて自動で増加
- **ライト / ダークテーマ** — 右上のボタンで切り替え。訪問者のOS設定にも自動追従
- **レスポンシブ対応** — スマホ・iPadでも綺麗に表示されます
- **各作品に「TOPページへ」ボタン** — どの作品ページからも1クリックでこの一覧に戻れます

## 動作確認（ローカル）

`index.html` をダブルクリックしてブラウザで開くだけで動きます。

## 公開URL・更新方法

このサイトは GitHub Pages で公開済みです。

- **公開URL(共有用)**: <https://hidenobu88.github.io/site-collection/>
- **リポジトリ**: <https://github.com/hidenobu88/site-collection>

作品を追加・修正したら、ターミナルで以下を実行すると1〜2分で公開URLに反映されます。

```bash
cd ~/Desktop/Site-Collection
git add -A && git commit -m "作品追加" && git push
```
