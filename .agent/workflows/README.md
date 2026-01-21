# Workflows

Digital Omikujiプロジェクトの標準ワークフロー定義

## 利用可能なワークフロー

### 開発フロー

- **[new-feature-development.md](./new-feature-development.md)** - SDD準拠の新機能開発
- **[fix_ci_errors.md](./fix_ci_errors.md)** - CIエラーの修正手順
- **[respond_to_pr_review.md](./respond_to_pr_review.md)** - PRレビューコメントへの対応

### リリース・デプロイ

- **[release.md](./release.md)** - develop → main へのリリース
- **[hotfix.md](./hotfix.md)** - main からの緊急修正

## ワークフロー選択ガイド

| 状況 | 推奨ワークフロー |
|------|----------------|
| 新機能を追加したい | new-feature-development.md |
| CIが失敗している | fix_ci_errors.md |
| PRにレビューコメントがついた | respond_to_pr_review.md |
| リリースしたい | release.md |
| 本番環境で緊急修正が必要 | hotfix.md |

## 関連ドキュメント

- [AGENTS.md](../../AGENTS.md) - プロジェクト共通ルール
- [.agent/skills/sdd-core/SKILL.md](../skills/sdd-core/SKILL.md) - SDD原則
- [.claude/commands/](../../.claude/commands/) - 利用可能なコマンド
