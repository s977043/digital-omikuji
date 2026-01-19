# Agent Personas - AIエージェントペルソナ定義

このディレクトリには、特定の役割を持つAIエージェントのペルソナ定義が含まれています。

## 📁 ペルソナ一覧

### 開発系

- **[digital-omikuji-dev.md](./digital-omikuji-dev.md)** - Digital Omikuji専門の開発エージェント
- **[feature-generator.md](./feature-generator.md)** - 新機能の自動生成エージェント
- **[ui-component-generator.md](./ui-component-generator.md)** - UIコンポーネント生成エージェント
- **[test.md](./test.md)** - テスト専門エージェント

### 保守・管理系

- **[repo-maintainer.md](./repo-maintainer.md)** - リポジトリ保守エージェント
- **[documentation-manager.md](./documentation-manager.md)** - ドキュメント管理エージェント
- **[pr-manager.md](./pr-manager.md)** - PR管理エージェント
- **[refactor.md](./refactor.md)** - リファクタリング専門エージェント
- **[security-manager.md](./security-manager.md)** - セキュリティ監視エージェント

---

## 🎯 使い方

### ペルソナの活用

各ペルソナは、特定のタスクに特化した指示・制約・知識を持っています。

**例**: 新機能開発時
```
feature-generatorペルソナに従って、ログイン機能を実装してください
```

**例**: リファクタリング時
```
refactorペルソナの指針に基づいて、components/ディレクトリを整理してください
```

### ペルソナとエージェントの違い

| 概念 | 説明 | 例 |
|------|------|-----|
| **エージェント** | ツール・プラットフォーム | Claude, Copilot, Codex, Gemini, Antigravity |
| **ペルソナ** | 特定の役割・タスクに特化した振る舞い定義 | feature-generator, test, security-manager |

**ポイント**: 同じエージェント（例: Claude）でも、異なるペルソナを適用することで振る舞いを変えられます。

**例**:
- Claude + feature-generator ペルソナ → 新機能開発に特化
- Claude + test ペルソナ → テスト作成に特化
- Claude + security-manager ペルソナ → セキュリティレビューに特化

---

## 📝 新しいペルソナの追加

1. このディレクトリに `<persona-name>.md` を作成
2. 以下の構造で記述:
   ```markdown
   # ペルソナ名

   ## 目的
   このペルソナの目的を明記

   ## 専門知識・スキル
   - スキル1
   - スキル2

   ## 制約事項
   - 制約1
   - 制約2

   ## 参照ドキュメント
   - [AGENTS.md](../../AGENTS.md)
   - 関連ドキュメントへのリンク
   ```
3. 本 README に索引を追加
4. 必要に応じて [AGENTS.md](../../AGENTS.md) から参照

---

## 🔗 関連ドキュメント

- **[AGENTS.md](../../AGENTS.md)** - 共通開発ガイド（SSOT）
- **[.agent/skills/](../skills/)** - 再利用可能なスキル集
- **[.agent/steering/](../steering/)** - プロジェクト方針・プロセス定義
- **[.agent/workflows/](../workflows/)** - 開発ワークフロー集
- **[.agent/config/unified-agent-config.json](../config/unified-agent-config.json)** - 統一エージェント設定

---

## 💡 ペルソナ活用のヒント

### 1. タスクに応じてペルソナを切り替える
- 新機能開発 → `feature-generator`
- バグ修正 → `digital-omikuji-dev`
- テスト作成 → `test`
- リファクタリング → `refactor`
- セキュリティ確認 → `security-manager`

### 2. ペルソナを組み合わせる
```
feature-generatorペルソナで実装し、testペルソナでテストを作成してください
```

### 3. カスタムペルソナを作成
プロジェクト固有のタスクに特化したペルソナを定義することで、AIエージェントの効率が向上します。
