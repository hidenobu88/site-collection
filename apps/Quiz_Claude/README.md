# 🍬 かわいい○×クイズアプリ

Java / Spring Boot / Thymeleaf / CSS / PostgreSQL で作った、○×（マル・バツ）2択のクイズアプリです。
問題の登録・更新・削除・一覧表示と、○×で回答して遊ぶゲーム機能を備えています。

- アプリの詳細仕様: [SPEC.md](SPEC.md)
- デザインシステム（差し替え可能）: [DESIGN.md](DESIGN.md)
- 作業進捗: [TASK.md](TASK.md)

## 必要環境

- Java 21 以上（JDK 26 で動作確認）
- PostgreSQL（起動していること）
- Maven（同梱の `./mvnw` を使うため個別インストールは任意）

## セットアップ

### 1. データベースを作成

```bash
createdb quiz_app
# もしくは: psql -c "CREATE DATABASE quiz_app;"
```

### 2. 接続情報を設定

`src/main/resources/application.properties` の以下を環境に合わせて変更します。
（環境変数 `DB_USER` / `DB_PASSWORD` / `DB_URL` で上書きも可能）

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/quiz_app
spring.datasource.username=postgres
spring.datasource.password=（あなたのパスワード）
```

### 3. 起動

```bash
./mvnw spring-boot:run
```

起動時に Flyway がテーブル作成とディズニー○×クイズ20問の投入を自動で行います（V3マイグレーション）。
出題のたびにクライアント側でシャッフルされ、20問すべて回答すると「もう一度あそぶ」で再びランダムな順で出題されます。

### 4. アクセス

ブラウザで <http://localhost:8080> を開きます。

- 「ゲームであそぶ」→ ○×クイズをプレイ（正解で「正解！」／不正解で「残念・・・。」）
- 「問題を管理する」→ 問題の一覧・登録・編集・削除

## ビルド（JAR 作成）

```bash
./mvnw clean package
java -jar target/quiz-0.0.1-SNAPSHOT.jar
```

## デザインの差し替え

見た目を変えたいときは [DESIGN.md](DESIGN.md) 冒頭の手順に従い、
`src/main/resources/static/css/tokens.css` の CSS 変数を書き換えてください。
