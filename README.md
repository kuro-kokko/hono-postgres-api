# 🔥hono-postgres-api

PostgreSQL の構成と、REST API でのデータ取得・操作を学ぶための学習用プロジェクト

## 使用技術

- Hono (Node.js)
- TypeScript
- PostgreSQL 18
- pg(生SQL)
- zod(バリデーション)
- Vitest(統合テスト)
- Biome(lint・format)
- Docker / Docker Compose
- GitHub Actions

## 起動方法

### 起動

```bash
docker compose up -d --build
curl http://localhost:3001/health
```

### 停止

```bash
docker compose down
```

### DB初期化

```bash
docker compose down -v
```

## API

| Method | path           | note           | Status Code           |
| ------ | -------------- | -------------- | --------------------- |
| GET    | `/health`      | ヘルスチェック | 200                   |
| GET    | `/members`     | 一覧取得       | 200                   |
| GET    | `/members/:id` | 1件取得        | 200 / 400 / 404       |
| POST   | `/members`     | 新規作成       | 201 / 400 / 409       |
| PUT    | `/members/:id` | 更新           | 200 / 400 / 404 / 409 |
| DELETE | `/members/:id` | 削除           | 204 / 400 / 404       |

```bash
curl -X POST http://localhost:3001/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Foo","email":"foo@example.com"}'
```

## ローカル環境構築

```bash
docker compose up -d db
cd api
cp .env.example .env
npm ci
npm run dev                  # http://localhost:3001
npm test                     # 統合テスト(DBが必要)
npm run lint
```

## DB

- スキーマ: `app`
- テーブル: `members`
- `db/init/*.sql` は、データが空の初回起動時だけ実行される

## CI

GitHub Actions で、push と PR ごとに次を実行する。

1. Biome による lint
2. TypeScript の型チェック
3. PostgreSQL を立てた状態での統合テスト
4. Docker イメージのビルド確認

## 注意事項

`compose.yaml` や `.github/workflows/ci.yaml` 内の認証情報は、検証用のダミー値です。本番環境では絶対に使用しないでください。
