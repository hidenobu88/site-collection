# TASK.md — 作業進捗

このファイルで作業の進捗と残タスクを管理します。完了したら `- [x]` に更新します。

## フェーズ1: 雛形・ドキュメント
- [x] pom.xml / .gitignore 作成
- [x] CLAUDE.md（SPEC.md 読込の指示）作成
- [x] CLAUDE.local.md（空）作成
- [x] SPEC.md（詳細仕様）作成
- [x] DESIGN.md（パステルキャンディ）作成
- [x] TASK.md 作成
- [x] README.md 作成
- [x] Maven ラッパー（mvnw）生成

## フェーズ2: バックエンド（Java / Spring Boot）
- [x] QuizApplication.java（起動クラス）
- [x] entity/Question.java（エンティティ）
- [x] repository/QuestionRepository.java
- [x] dto/QuestionForm.java（バリデーション付きフォーム）
- [x] service/QuestionService.java（トランザクション実装）
- [x] controller/QuestionController.java（登録/更新/削除/一覧）
- [x] controller/GameController.java（ゲーム画面 + 問題JSON）

## フェーズ3: DB
- [x] application.properties（接続・Flyway 設定）
- [x] db/migration/V1__init.sql（questions テーブル）
- [x] db/migration/V2__seed_questions.sql（架空○×問題 10問）
- [x] quiz_app データベース作成

## フェーズ4: フロントエンド（HTML / CSS）
- [x] static/css/tokens.css（デザイントークン）
- [x] static/css/style.css（コンポーネントCSS）
- [x] static/img/mascot.svg（マスコット）
- [x] templates/fragments/layout.html（共通レイアウト）
- [x] templates/index.html（トップ）
- [x] templates/questions/list.html（一覧）
- [x] templates/questions/form.html（登録・編集フォーム）
- [x] templates/game/play.html（ゲーム）

## フェーズ5: 動作確認
- [x] ビルド成功（./mvnw package）
- [x] 起動・Flyway 適用確認
- [x] 一覧表示の確認
- [x] 登録の確認
- [x] 更新の確認
- [x] 削除の確認
- [x] ゲーム（正解！/残念・・・。/スコア）の確認

## フェーズ6: ボリュームアップ（見た目強化 & ミニゲーム追加）
子ども向けに「楽しそう！」な見た目へ刷新し、あそびを増やす。※ミニゲームは見た目・動作のみ（DB非依存）。
- [x] tokens.css ににぎやかな差し色トークン追加（ぶどう/そら/みかん/クリーム）
- [x] style.css を強化（虹色タイトル・浮遊するおかし・弾むカード・紙吹雪・進捗バー・星評価）
- [x] layout.html に背景装飾（ふわふわ浮かぶおかし）を追加
- [x] index.html を4カード（○×クイズ/パズル/ぴったりストップ/問題管理）のワクワクトップに刷新
- [x] game/play.html に進捗バー・星評価・紙吹雪を追加
- [x] game/puzzle.html（ドラッグ&ドロップ・パズル、3絵・スナップ・効果音）作成
- [x] game/timer.html（ぴったりストップ・タイマー）作成
- [x] GameController に `/puzzle`・`/timer` ルート追加
- [x] SPEC.md / DESIGN.md / TASK.md を更新
- [x] h2 プロファイルでビルド・起動・全ルート(200)確認

## 今後（別指示で対応予定）
- [ ] 本番の問題データを投入（V3__ 以降のマイグレーション）
- [ ] パズルの絵・データを追加し、ミニゲームをデータ/DBと結合
- [ ] 好みに応じて DESIGN.md を別テーマへ差し替え
