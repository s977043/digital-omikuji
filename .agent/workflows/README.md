# Workflows - 開発ワークフロー集

Digital Omikujiプロジェクトの各種開発ワークフローをまとめたディレクトリです。

## 📁 ワークフロー一覧

### 通常開発

- **[new-feature-development.md](./new-feature-development.md)** - 新機能開発の標準手順（SDD準拠）
- **[respond_to_pr_review.md](./respond_to_pr_review.md)** - PRレビューコメントへの対応手順

### トラブルシューティング

- **[fix_ci_errors.md](./fix_ci_errors.md)** - CI/CDエラーの解決手順

### リリース・デプロイ

- **[release.md](./release.md)** - develop → main リリース手順
- **[hotfix.md](./hotfix.md)** - 緊急バグ修正手順

---

## 🎯 使い方

### 開発者向け

**新機能を開発する場合:**
1. [new-feature-development.md](./new-feature-development.md) を参照
2. SDD（仕様駆動開発）に従って仕様書→実装→テスト

**CIが失敗した場合:**
1. [fix_ci_errors.md](./fix_ci_errors.md) を参照
2. エラーメッセージを確認して修正

**PRにレビューコメントがついた場合:**
1. [respond_to_pr_review.md](./respond_to_pr_review.md) を参照
2. コメントに対応してコミット

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
- CIエラー発生 → `fix_ci_errors.md`
- PRレビュー対応 → `respond_to_pr_review.md`
- リリース作業 → `release.md`
- 本番バグ修正 → `hotfix.md`

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
