# Workflows - 開発ワークフロー集

Digital Omikujiプロジェクトの各種開発ワークフローをまとめたディレクトリです。

## 📁 ワークフロー一覧

### 通常開発

- **[new-feature-development.md](./new-feature-development.md)** - 新機能開発の標準手順（SDD準拠）
- **[plan.md](./plan.md)** - タスク分解
- **[create.md](./create.md)** - 新規作成
- **[enhance.md](./enhance.md)** - 既存改善
- **[test.md](./test.md)** - テスト実行

### トラブルシューティング

- **[debug.md](./debug.md)** - デバッグ手順
- **[status.md](./status.md)** - 状態確認

### リリース・デプロイ

- **[deploy.md](./deploy.md)** - デプロイ手順
- **[release.md](./release.md)** - develop → main リリース手順
- **[hotfix.md](./hotfix.md)** - 緊急バグ修正手順
- **[preview.md](./preview.md)** - プレビュー操作

### 企画・調整

- **[brainstorm.md](./brainstorm.md)** - 仕様の発見と整理
- **[orchestrate.md](./orchestrate.md)** - 複数エージェント調整
- **[ui-ux-pro-max.md](./ui-ux-pro-max.md)** - UI/UX 企画

---

## 🎯 使い方

### 開発者向け

**新機能を開発する場合:**
1. [new-feature-development.md](./new-feature-development.md) を参照
2. SDD（仕様駆動開発）に従って仕様書→実装→テスト

**仕様やタスクを整理する場合:**
1. [plan.md](./plan.md) または [brainstorm.md](./brainstorm.md) を参照

**リリースする場合:**
1. [release.md](./release.md) を参照
2. develop → main へマージしてタグ付け

**本番で緊急バグが発生した場合:**
1. [hotfix.md](./hotfix.md) を参照
2. main から hotfix ブランチを作成して即座に修正

### AIエージェント向け

ワークフローは [AGENTS.md](../../AGENTS.md) から参照され、各エージェントが自律的に適切なワークフローを選択します。

エージェントは以下の判断基準でワークフローを選択:
- 新機能実装タスク → `new-feature-development.md`
- 仕様整理 → `plan.md` / `brainstorm.md`
- リリース作業 → `release.md`
- 本番バグ修正 → `hotfix.md`
- デバッグ → `debug.md`
- プレビュー確認 → `preview.md`

---

## 📝 ワークフロー追加ガイドライン

新しいワークフローを追加する場合:

1. このディレクトリに `.md` ファイルを作成
2. Front Matter にメタデータを記載:
   ```yaml
   ---
   title: "ワークフロー名"
   description: "簡潔な説明"
   version: "1.0"
   last_updated: "YYYY-MM-DD"
   ---
   ```
3. 本 README に索引を追加
4. 必要に応じて [AGENTS.md](../../AGENTS.md) から参照

---

## 🔗 関連ドキュメント

- **[AGENTS.md](../../AGENTS.md)** - 開発ガイド（SSOT）
- **[.agent/steering/](../steering/)** - プロジェクト方針・プロセス定義
- **[.agent/skills/](../skills/)** - Agent Skills（再利用可能なスキル集）
