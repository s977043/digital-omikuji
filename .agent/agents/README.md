# Agents

Digital Omikujiプロジェクトの開発支援エージェント定義

## エージェント階層

```
orchestrator（マスターコーディネーター）
├── digital-omikuji-dev（開発統括）
├── feature-generator（機能生成）
├── ui-component-generator（UI生成）
├── test（テスト）
├── security-manager（セキュリティ）
├── pr-manager（PR管理）
├── documentation-manager（ドキュメント）
├── repo-maintainer（リポジトリ管理）
└── refactor（リファクタリング）
```

## エージェント一覧

### コーディネーション層

- **[orchestrator.md](./orchestrator.md)** - マスターコーディネーター（タスク振り分け）

### 開発層

- **[digital-omikuji-dev.md](./digital-omikuji-dev.md)** - プロジェクト固有開発支援
- **[feature-generator.md](./feature-generator.md)** - 新機能生成
- **[ui-component-generator.md](./ui-component-generator.md)** - UIコンポーネント生成
- **[refactor.md](./refactor.md)** - リファクタリング

### 品質層

- **[test.md](./test.md)** - テスト作成と実行
- **[security-manager.md](./security-manager.md)** - セキュリティ監査

### 運用層

- **[pr-manager.md](./pr-manager.md)** - PR作成と管理
- **[repo-maintainer.md](./repo-maintainer.md)** - リポジトリ管理
- **[documentation-manager.md](./documentation-manager.md)** - ドキュメント管理

## 使い方

エージェントは自動的に適切なものが選択されますが、明示的に指定することも可能です:

```bash
# 例: orchestratorに複雑なタスクを依頼
@orchestrator 新機能「ユーザープロフィール」を実装してください

# 例: digital-omikuji-devに直接依頼
@digital-omikuji-dev バグを修正してください
```

## 関連ドキュメント

- [AGENTS.md](../../AGENTS.md) - プロジェクト共通ルール
- [.agent/skills/](../skills/) - 利用可能なスキル
- [.agent/workflows/](../workflows/) - 標準ワークフロー
