# スミカ不動産(SUMIKA ESTATE)

架空の賃貸物件紹介サイトのデモです。アパート・マンション・タワーマンションの
架空の建物9棟・全39部屋を掲載しており、条件検索・ページ切り替え・部屋ごとの詳細ページ・
問い合わせフォーム(デモ)を備えています。

> 掲載されている物件名・住所・鉄道路線・電話番号などはすべて架空のものです。

## 使い方(3通り)

### 1. そのままブラウザで開く(いちばん簡単)
`index.html` をダブルクリックするだけ。データは `js/data.js` から読み込まれます。

### 2. 静的サーバーで開く
```bash
python3 -m http.server 8000
# → http://localhost:8000
```

### 3. PostgreSQL + APIサーバーで動かす
データベース(`sumika_estate`)からデータを配信するモードです。

```bash
npm install          # 初回のみ(express, pg)
npm run db:start     # PostgreSQL(Homebrew版)をポート5434で起動
npm run db:setup     # DB作成+スキーマ+シード投入(初回のみ)
npm start            # → http://localhost:3000
```

ページを開くと自動で `/api/data` からDBのデータを取得します
(APIがない場合は `js/data.js` に自動フォールバックするため、どのモードでも同じように動きます)。

終了するときは `Ctrl+C` でサーバーを止め、`npm run db:stop` でDBを停止します。

> **注意(この環境固有)**: この Mac には EDB インストーラ版 PostgreSQL がポート5432で常駐しているため、
> 本プロジェクトは Homebrew 版 PostgreSQL 18 を **ポート5434** で使う構成にしています。
> 別の接続先を使う場合は環境変数 `DATABASE_URL` で上書きできます。

## 機能

- **物件一覧+条件検索**
  - 建物の種類(アパート / マンション / タワーマンション)
  - 賃料の下限・上限、間取り、築年数、駅徒歩、専有面積
  - こだわり条件(ペット可、駐車場あり、敷金なし、礼金なし、オートロック、
    バス・トイレ別、宅配ボックス、追い焚き、床暖房、ネット無料、2階以上、コンシェルジュ)
  - キーワード検索、並び替え(賃料 / 築年数 / 広さ)
  - ページネーション(12件/ページ)
- **部屋詳細ページ**(カードクリックで遷移)
  - 賃料・敷金・礼金・間取り・面積・向き・駐車場・ペット可否などの基本情報
  - 画像ギャラリー(内装+建物外観、サムネイル切り替え)
  - 設備タグ、建物情報、同じ建物のほかの部屋への導線
  - 回遊導線(検索一覧へ戻る、前後の物件、カテゴリ別リンク、ヘッダーナビ)
- **お気に入り**(ハートで登録、localStorage に保存。ヘッダーから絞り込み表示)

## ファイル構成

```
Rental-Properties/
├── index.html            # 物件一覧・検索ページ
├── detail.html           # 部屋詳細ページ (detail.html?id=部屋ID)
├── server.js             # APIサーバー(Express + PostgreSQL)
├── css/style.css         # スタイル
├── js/
│   ├── data.js           # 建物・部屋データ(ここを編集して物件を追加/変更)
│   ├── api.js            # API稼働時にDBデータへ差し替える処理
│   ├── app.js            # 一覧・検索・ページネーション
│   └── detail.js         # 詳細ページ・ナビゲーション
├── db/
│   ├── schema.sql        # buildings / rooms テーブル定義
│   └── seed.sql          # シードデータ(自動生成)
├── images/
│   ├── buildings/*.svg   # 建物外観のダミー画像(自動生成)
│   └── rooms/*.svg       # 部屋内装のダミー画像(自動生成)
└── tools/
    ├── generate-images.js # ダミー画像の再生成 (npm run images)
    └── export-seed.js     # data.js → seed.sql の再生成 (npm run seed:export)
```

## 画像の差し替え方法

現在は自動生成のSVGイラスト(内装+外観)が表示されています。実写真に差し替えるには
`js/data.js` の各部屋に `images` 配列を指定してください(指定がある部屋は自動割り当てされません)。

```js
{
  id: "r0101", buildingId: "b01", ...
  images: ["images/rooms/r0101-1.jpg", "images/rooms/r0101-2.jpg"],
  ...
}
```

- 1枚目が一覧カードと詳細ページのメイン写真、2枚目以降は詳細ページのサムネイルになります
- すべて NoImage 表示に戻したい場合は `js/data.js` 末尾の `assignDefaultImages(ROOMS);` を削除してください
- ダミー画像のデザインを変えたい場合は `tools/generate-images.js` を編集して `npm run images` で再生成できます

## データの追加・変更方法

1. `js/data.js` の `BUILDINGS`(建物)と `ROOMS`(部屋)を編集
   (賃料・管理費は「円」、敷金・礼金は「賃料の何ヶ月分」、0 = なし)
2. ダミー画像を使う場合は `npm run images` で追加分を生成
3. DBモードを使う場合は `npm run seed:export && npm run db:setup` でDBに反映

## API

| エンドポイント | 内容 |
|---|---|
| `GET /api/data` | 全建物・全部屋(フロントの `js/data.js` と同じ形) |
| `GET /api/health` | DB接続の死活確認 |
