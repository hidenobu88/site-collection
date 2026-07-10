# Site Collection — ポートフォリオサイト

制作したWebサイト・アプリを1か所にまとめ、リンクを送るだけで相手がすぐに作品を見られるポートフォリオサイトです。

## ★ フォルダの運用ルール（重要）

**デスクトップに作品フォルダを増やさず、すべてこの `Site-Collection` の中に格納します。**

| 作ったもの | 格納先 | 例 |
|---|---|---|
| **Webサイト**（HTML/CSS/JSだけで動く静的サイト） | `works/サイト名/` | `works/reoma-website/` |
| **Webアプリ**（サーバーやDBが必要なアプリの開発プロジェクト一式） | `apps/アプリ名/` | `apps/Quiz_Claude/` |

- `works/` に入れたサイトは、そのまま公開されて閲覧できます（`url: "works/サイト名/index.html"` をカードに設定）
- `apps/` はソースコードの保管場所です。サーバーが必要でブラウザだけでは動かないため、
  **紹介ページやブラウザで動くデモ版を `works/` に作って、カードはそちらへリンク**します
  （例: `apps/Quiz_Claude/`（本体） と `works/quiz-claude/`（紹介ページ＋遊べるデモ） のセット）

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
│   ├── quiz-claude/  … かわいいクイズランド（紹介ページ＋遊べるデモ）
│   ├── fortnite/     … TORANOBU GAMES（フォートナイト風の紹介ページ）
│   ├── reoma-website/ … ※準備中（中身が入ったらカード追加）
│   └── …            … そのほかの作品サイト
├── apps/             … ★ Webアプリ（サーバー型）の開発プロジェクト置き場
│   ├── Quiz_Claude/  … ○×クイズアプリ本体（Java / Spring Boot / PostgreSQL）
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
  （TORANOBU GAMES）専用**で、カードは `works/fortnite/` の紹介ページ経由で
  公式クリエイターページ（fortnite.com/@toranobu_game）へリンクしています
- 一覧は4件ごとのページネーション付き。ページ数は作品数に応じて自動で増えます
  （1ページの件数は `projects.js` の `ITEMS_PER_PAGE` で変更可）

## 主な機能

- **1クリックで作品を開く** — カード全体がリンク。新しいタブで実物が開きます
- **カテゴリ絞り込み・検索** — `/` キーで検索欄にフォーカス
- **ページネーション** — 4件区切り・作品数に応じて自動で増加
- **ライト / ダークテーマ** — 右上のボタンで切り替え。訪問者のOS設定にも自動追従
- **レスポンシブ対応** — スマホ・iPadでも綺麗に表示されます

## 動作確認（ローカル）

`index.html` をダブルクリックしてブラウザで開くだけで動きます。

## 公開する方法（https:// のURLで相手に送る）

git の準備（init〜コミット）は完了済みです。残りは以下だけです。

### おすすめ：GitHub Pages（無料）

1. <https://github.com/new> で新しいリポジトリを作る
   - 名前: `site-collection`（自由）／ Public を選択 ／ README等は追加しない
2. ターミナルでこのフォルダに移動して push:
   ```bash
   cd ~/Desktop/Site-Collection
   git remote add origin https://github.com/TORA-NOBU/site-collection.git
   git push -u origin main
   ```
   （初回はGitHubのログイン画面が出るので、ブラウザで認証してください）
3. リポジトリの **Settings → Pages → Branch: `main` / (root)** を選んで Save
4. 数分後に公開URLが発行されます:
   **`https://tora-nobu.github.io/site-collection/`**
   このURLを友達や採用担当者に送ればOKです

以後の更新は `git add -A && git commit -m "作品追加" && git push` だけで反映されます。

### 代替案：Netlify Drop（アカウント作成してドラッグ&ドロップ）

<https://app.netlify.com/drop> にこのフォルダをドラッグするだけでも公開できます
（`apps/` の中身も一緒にアップロードされる点だけ注意）。
