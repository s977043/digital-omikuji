# Agent Personas - AIエージェントペルソナ定義

このディレクトリには、特定の役割を持つAIエージェントのペルソナ定義が含まれています。

## 📁 ペルソナ一覧

### 計画・調整

- **[project-planner.md](./project-planner.md)** - 計画立案・タスク分解
- **[orchestrator.md](./orchestrator.md)** - 複数エージェントの調整
- **[explorer-agent.md](./explorer-agent.md)** - リポジトリ調査
- **[database-architect.md](./database-architect.md)** - DB設計・最適化

### 開発系

- **[frontend-specialist.md](./frontend-specialist.md)** - UI/フロントエンド実装
- **[backend-specialist.md](./backend-specialist.md)** - API/バックエンド実装
- **[mobile-developer.md](./mobile-developer.md)** - モバイル実装
- **[game-developer.md](./game-developer.md)** - ゲームロジック実装

### 品質・テスト・セキュリティ

- **[test-engineer.md](./test-engineer.md)** - テスト設計・実装
- **[debugger.md](./debugger.md)** - 不具合解析
- **[performance-optimizer.md](./performance-optimizer.md)** - 性能改善
- **[security-auditor.md](./security-auditor.md)** - セキュリティ監査
- **[penetration-tester.md](./penetration-tester.md)** - 攻撃観点の検証

### 運用・ドキュメント・SEO

- **[devops-engineer.md](./devops-engineer.md)** - CI/CD・運用
- **[documentation-writer.md](./documentation-writer.md)** - ドキュメント作成
- **[seo-specialist.md](./seo-specialist.md)** - SEO/可視性改善

---

## 🎯 使い方

### ペルソナの活用

各ペルソナは、特定のタスクに特化した指示・制約・知識を持っています。

**例**: 新機能開発時
```
project-plannerペルソナに従って、ログイン機能の計画を作成してください
```

**例**: 不具合調査時
```
debuggerペルソナの指針に基づいて、クラッシュ原因を調査してください
```

### ペルソナとエージェントの違い

| 概念 | 説明 | 例 |
|------|------|-----|
| **エージェント** | ツール・プラットフォーム | Claude, Copilot, Codex, Gemini, Antigravity |
| **ペルソナ** | 特定の役割・タスクに特化した振る舞い定義 | project-planner, test-engineer, security-auditor |

**ポイント**: 同じエージェント（例: Claude）でも、異なるペルソナを適用することで振る舞いを変えられます。

**例**:
- Claude + project-planner ペルソナ → 計画立案に特化
- Claude + test-engineer ペルソナ → テスト作成に特化
- Claude + security-auditor ペルソナ → セキュリティレビューに特化

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
- **[.agent/ARCHITECTURE.md](../ARCHITECTURE.md)** - エージェント/スキル構成の概要

---

## 💡 ペルソナ活用のヒント

### 1. タスクに応じてペルソナを切り替える
- 計画立案 → `project-planner`
- UI実装 → `frontend-specialist`
- バグ修正 → `debugger`
- テスト作成 → `test-engineer`
- セキュリティ確認 → `security-auditor`
- 性能改善 → `performance-optimizer`

### 2. ペルソナを組み合わせる
```
project-plannerペルソナで計画し、test-engineerペルソナでテストを作成してください
```

### 3. カスタムペルソナを作成
プロジェクト固有のタスクに特化したペルソナを定義することで、AIエージェントの効率が向上します。
