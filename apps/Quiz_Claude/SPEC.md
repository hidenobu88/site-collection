# SPEC.md — かわいい○×クイズアプリ 詳細仕様

## 1. 概要

Java / Spring Boot / Thymeleaf(HTML) / CSS / PostgreSQL で構築する、○×（マル・バツ）2択のクイズアプリ。
問題の**登録・更新・削除・一覧表示**（管理機能）と、問題に回答して遊ぶ**ゲーム機能**を持つ。
デザインは「かわいい」テイスト（パステルキャンディ）で、[DESIGN.md](DESIGN.md) 形式のデザインシステムにより後から差し替え可能。

- 対象URL: `http://localhost:8080`
- 文字コード: UTF-8（日本語対応）

## 2. 技術スタック

| 分類 | 採用技術 |
| --- | --- |
| 言語 | Java 21（JDK 26 でビルド、`--release 21`） |
| フレームワーク | Spring Boot 3.5.x（Web / Data JPA / Thymeleaf / Validation） |
| ビルド | Maven（`mvnw` ラッパー同梱） |
| テンプレート | Thymeleaf |
| DB | PostgreSQL |
| マイグレーション | Flyway |
| スタイル | 素のCSS（デザイントークン方式） |

## 3. 機能一覧

| # | 機能 | 説明 |
| --- | --- | --- |
| 1 | 登録機能 | 新しい○×問題を登録する |
| 2 | 更新機能 | 既存の問題を編集して更新する |
| 3 | 削除機能 | 問題を削除する（確認あり） |
| 4 | 一覧表示 | 登録済みの全問題を一覧で表示する |
| 5 | ○×ゲーム機能 | 問題に○/×で回答して正誤判定・採点する |
| 6 | パズル ミニゲーム | ピースをドラッグ&ドロップして絵を完成させる（クライアント完結・DB非依存） |
| 7 | ぴったりストップ ミニゲーム | 指定秒数を狙ってストップし、近さを判定する（クライアント完結・DB非依存） |

> ミニゲーム（6・7）は**現時点ではフロントエンド（見た目・動作）のみ**の実装です。
> 問題・パズルのデータやDB連携は後日まとめて結合する方針のため、ここでは未実装です。

## 4. 画面一覧と遷移

| 画面 | パス | 内容 |
| --- | --- | --- |
| トップ | `GET /` | 4つのあそび（○×クイズ / パズル / ぴったりストップ / 問題管理）へのカラフルな導線 |
| 問題一覧 | `GET /questions` | 問題の一覧。各行に「編集」「削除」 |
| 新規登録フォーム | `GET /questions/new` | 問題文・正解(○/×)・解説を入力 |
| 編集フォーム | `GET /questions/{id}/edit` | 既存値を初期表示して編集 |
| ○×ゲーム | `GET /game` | ○×クイズをプレイ |
| パズル | `GET /puzzle` | ドラッグ&ドロップのパズル ミニゲーム |
| ぴったりストップ | `GET /timer` | 秒数ぴったりを狙うタイマー ミニゲーム |

遷移: トップ → 一覧 →（新規/編集/削除）／ トップ → ゲーム → 結果表示 → もう一度 or トップ。

## 5. ルーティング（コントローラ）

### 管理（QuestionController）
| メソッド | パス | 処理 |
| --- | --- | --- |
| GET | `/` | トップ表示 |
| GET | `/questions` | 一覧表示 |
| GET | `/questions/new` | 新規フォーム |
| POST | `/questions` | 新規登録（バリデーション → 登録 → 一覧へリダイレクト） |
| GET | `/questions/{id}/edit` | 編集フォーム |
| POST | `/questions/{id}` | 更新（バリデーション → 更新 → 一覧へリダイレクト） |
| POST | `/questions/{id}/delete` | 削除 → 一覧へリダイレクト |

### ゲーム（GameController）
| メソッド | パス | 処理 |
| --- | --- | --- |
| GET | `/game` | ○×ゲーム画面（Thymeleaf） |
| GET | `/api/game/questions` | 出題用の問題一覧をJSONで返す |
| GET | `/puzzle` | パズル ミニゲーム画面（クライアントJSのみ・DB非依存） |
| GET | `/timer` | ぴったりストップ ミニゲーム画面（クライアントJSのみ・DB非依存） |

登録・更新・削除の後は **PRG（Post/Redirect/Get）パターン** でリダイレクトし、二重送信を防ぐ。処理結果は Flash 属性でメッセージ表示する。

## 6. データモデル

### テーブル: `questions`
| カラム | 型 | 制約 | 説明 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, 自動採番（IDENTITY） | 問題ID |
| `text` | VARCHAR(500) | NOT NULL | 問題文 |
| `answer` | BOOLEAN | NOT NULL | 正解。`true`=○（マル）/ `false`=×（バツ） |
| `explanation` | VARCHAR(1000) | NULL可 | 解説（任意） |
| `created_at` | TIMESTAMP | NOT NULL | 作成日時 |
| `updated_at` | TIMESTAMP | NOT NULL | 更新日時 |

エンティティ `Question` が対応。`created_at` / `updated_at` は JPA の `@PrePersist` / `@PreUpdate` で自動設定。

## 7. トランザクション方針（重点）

- サービス層 `QuestionService` にトランザクション境界を集約する。
- 参照系（一覧取得・単一取得）は `@Transactional(readOnly = true)`。
- 更新系（登録・更新・削除）は `@Transactional`。実行時例外でロールバックされる。
- 更新・削除は対象の存在を確認し、無ければ例外（`NoSuchElementException` 等）を送出 → トランザクションをロールバック。
- コントローラはトランザクションを持たず、サービスに委譲する（境界を1箇所に保つ）。

## 8. ゲーム機能の仕様

1. `GET /game` でプレイ画面を表示。
2. クライアントJSが `GET /api/game/questions` から問題一覧（JSON）を取得し、毎回シャッフルして出題。
3. 1問ずつ「問題文」と「○」「×」ボタンを表示。
4. 回答すると即座に判定し、
   - 正解: 画面いっぱいに大きく **「正解！」** を表示。
   - 不正解: 画面いっぱいに大きく **「残念・・・。」** を表示。
   - 解説があれば併せて表示。
5. 「次へ」で次の問題。全問終了で **スコア（○問正解！）** と評価コメントを表示。
6. 「もう一度」「トップへ」の導線を用意。

問題が0件のときは、その旨と「問題を登録する」への導線を表示する。

## 8.5 ミニゲームの仕様（フロントエンドのみ・DB非依存）

子どもが「楽しそう！」と感じる導線を増やすため、○×クイズに加えて2種類のミニゲームを用意する。
いずれも**クライアントJSのみで完結**し、現時点でDB・サーバAPIは使わない（データは後日まとめて結合予定）。

### パズル（`GET /puzzle`）— ドラッグ&ドロップ
1. 3×3（9ピース）のジグソーパズル。お手本の絵を盤面にうっすら表示する。
2. シャッフルされたピースがトレイに並ぶ。ピースを**ドラッグ&ドロップ**で盤面のマスへ運ぶ。
3. 正しいマスに落とすと **パチッとハマる**（スナップ＋効果音＋アニメ）。違うマスならトレイに戻り、プルプル揺れる。
4. 9ピースすべてハマると **「かんせい！」** を表示し、紙吹雪でお祝い。
5. 「つぎのパズルへ」で**次のパズルへ移行**。全パズル完了で「ぜんぶクリア！」。
6. 絵はSVGを`data:` URI化して用意（現状：おひさま / ケーキ / おさかな の3種）。差し替え・追加は `PUZZLES` 配列で行う。
7. 入力は Pointer Events で実装し、**マウス・タッチ（タブレット）両対応**。

### ぴったりストップ（`GET /timer`）— 体内時計ゲーム
1. 目標秒数を選ぶ（3 / 5 / 10 / 15 秒）。
2. 「スタート」で計測開始。**走行中は数字を隠し**、感覚で当てる。
3. 「ストップ」で停止し、経過時間と目標との差を表示。
4. 差に応じて評価：`≤0.1s`＝ピッタリ / `≤0.5s`＝ニアピン / `≤1.0s`＝おしい / `≤2.0s`＝あと少し / それ以上＝はやすぎ・おそすぎ。星（⭐）とコメントも表示し、好成績なら紙吹雪。

## 9. デザイン方針（差し替え可能）

- 見た目は [DESIGN.md](DESIGN.md) のデザインシステムに基づく。テーマは **パステルキャンディ 🍬**（ピンク×ミント）。
- `src/main/resources/static/css/tokens.css` に DESIGN.md のトークンを CSS 変数として定義。
- `style.css` は必ず `var(--…)` 経由で参照するため、`tokens.css` を差し替えるだけで全体の見た目が変わる。
- 別デザインへ変更する場合は、designmd.ai から新しい DESIGN.md を取得し、その値で `tokens.css` を更新する（DESIGN.md 冒頭の対応表を参照）。

## 10. DB セットアップ

1. データベース作成: `createdb quiz_app`（または `CREATE DATABASE quiz_app;`）。
2. `src/main/resources/application.properties` の接続情報（URL / ユーザー / パスワード）を環境に合わせる。
3. アプリ起動時、Flyway が `src/main/resources/db/migration` のマイグレーションを自動適用する。
   - `V1__init.sql` … `questions` テーブル作成
   - `V2__seed_questions.sql` … 動作確認用の架空○×問題を10問投入
4. 本番の問題データは後日、`V3__...sql` 等の追加マイグレーションで投入する運用とする。

## 11. ディレクトリ構成

```
Quiz_Claude/
├── pom.xml
├── mvnw / mvnw.cmd / .mvn/
├── CLAUDE.md / CLAUDE.local.md
├── SPEC.md / TASK.md / DESIGN.md / README.md
└── src/main/
    ├── java/com/example/quiz/
    │   ├── QuizApplication.java
    │   ├── entity/Question.java
    │   ├── repository/QuestionRepository.java
    │   ├── service/QuestionService.java
    │   ├── dto/QuestionForm.java
    │   └── controller/{QuestionController, GameController}.java
    └── resources/
        ├── application.properties
        ├── db/migration/{V1__init.sql, V2__seed_questions.sql}
        ├── templates/{index.html, fragments/layout.html,
        │              questions/{list,form}.html,
        │              game/{play,puzzle,timer}.html}
        └── static/
            ├── css/{tokens.css, style.css}
            └── img/mascot.svg
```
