# Agent Skills

AIエージェントの知識を拡張するスキルモジュール集。

## 使い方

- スキル定義: `<skill-name>/SKILL.md`
- インデックス: `index.json`（`pnpm validate:skills`で検証）
- 追加手順: `CHECKLIST.md`を参照

## カテゴリ別一覧

### 開発基盤

| スキル | 説明 |
| --- | --- |
| `clean-code` | 実用的コーディング標準（priority: highest） |
| `typescript-expert` | TypeScript開発原則 |
| `react-patterns` | モダンReactパターン |
| `nodejs-best-practices` | Node.js開発原則 |
| `python-patterns` | Python開発原則 |
| `tailwind-patterns` | Tailwind CSS v4原則 |
| `bash-linux` | Bash/Linuxターミナルパターン |
| `powershell-windows` | PowerShell/Windowsパターン |

### フレームワーク

| スキル | 説明 |
| --- | --- |
| `nextjs-best-practices` | Next.js App Router原則 |
| `nestjs-expert` | Nest.jsフレームワーク |
| `prisma-expert` | Prisma ORM |
| `docker-expert` | Dockerコンテナ化 |
| `mcp-builder` | MCP（Model Context Protocol）サーバー構築 |

### 設計・アーキテクチャ

| スキル | 説明 |
| --- | --- |
| `architecture` | アーキテクチャ意思決定フレームワーク |
| `api-patterns` | API設計原則（REST/GraphQL/tRPC） |
| `database-design` | データベース設計原則 |
| `frontend-design` | Web UI設計思考 |
| `mobile-design` | モバイルファーストデザイン |
| `ui-ux-pro-max` | UI/UXデザイン知識 |
| `i18n-localization` | 国際化・ローカライゼーション |

### テスト・品質

| スキル | 説明 |
| --- | --- |
| `testing-patterns` | テストパターン |
| `tdd-workflow` | テスト駆動開発 |
| `webapp-testing` | Webアプリテスト原則 |
| `code-review-checklist` | コードレビューガイドライン |
| `lint-and-validate` | 自動品質管理・リント |

### セキュリティ

| スキル | 説明 |
| --- | --- |
| `vulnerability-scanner` | 脆弱性分析（OWASP 2025） |
| `red-team-tactics` | レッドチーム戦術（MITRE ATT&CK） |

### 運用・デプロイ

| スキル | 説明 |
| --- | --- |
| `deployment-procedures` | 本番環境デプロイ原則 |
| `server-management` | サーバー管理原則 |
| `performance-profiling` | パフォーマンスプロファイリング |
| `systematic-debugging` | 4段階体系的デバッグ |

### エージェント・ワークフロー

| スキル | 説明 |
| --- | --- |
| `parallel-agents` | マルチエージェント協調 |
| `behavioral-modes` | AI動作モード切替 |
| `brainstorming` | ソクラティックメソッド |
| `plan-writing` | 構造化タスク計画 |
| `app-builder` | フルスタックアプリビルダー |
| `agent-browser` | ブラウザ操作自動化 |

### ドメイン特化

| スキル | 説明 |
| --- | --- |
| `game-development` | ゲーム開発 |
| `seo-fundamentals` | SEO基礎・Core Web Vitals |
| `geo-fundamentals` | Generative Engine Optimization |
| `solo-product-planning` | 個人開発企画 |
| `documentation-templates` | ドキュメンテーションテンプレート |

## 専門レビュー用（overlay）

`../ai-design-agents/skills/`配下に25個のUI/UX/品質レビュー用スキルを配置。
詳細: `../ai-design-agents/skills/README.md`

## 検証

```bash
pnpm validate:skills
```
