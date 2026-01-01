# AGENTS.md — Digital Omikuji Canonical Guide

Digital Omikuji での開発ルールを一元管理する正本です。Copilot / Claude / Gemini / Codex など、すべてのエージェントと人間開発者はこのファイルを参照してください。

## 1. スコープと禁止事項
- 本ファイルの指示はリポジトリ全体に適用されます。
- 触らない: `node_modules/`, `**/*.lock`, `.env*`, `secrets/`（秘密情報の追加・コミットは禁止）。

## 2. 技術スタックの要点
- Expo SDK 52（Managed）, Expo Router v4。
- スタイル: NativeWind v4（React Native コンポーネントに `className` を使用）。
- アニメーション: Moti（Reanimated）。
- 言語: TypeScript（strict）。

## 3. セットアップ & 共通コマンド（pnpm 前提）
- 依存導入: `pnpm install`
- 開発サーバー: `pnpm start`
- テスト: `pnpm test`
- ビルド(Web): `pnpm build`
- Lint: `pnpm lint`（設定がある場合）

## 4. ワークフロー（AI-SDD / AI-TDD）
- **計画先行**: 着手前にタスク計画をまとめ、小さな変更単位で進める。
- **テストファースト**: 可能な限りテストを追加・更新してから実装する。
- **エビデンス**: PR には実行したテスト結果ログを必ず添付する。
- **例外処理**: 外部 API 呼び出しでは例外処理を入れる。インポートに try/catch は使わない。

## 5. コーディング規約
- 命名: 変数/関数は camelCase、コンポーネントは PascalCase。
- React: Functional Component + Hooks を基本とし、NativeWind の `className` を活用。
- TypeScript: `any` 回避、型を明示。バレル（`index.ts` 一括 export）は必要最小限のみ。

## 6. ブランチ / PR / レビュー
- 原則として `main`/`develop` への直接コミットは禁止。作業ブランチをベースブランチ（通常は `develop` か現在の作業ベース）から切って PR で統合する。
- PR タイトル: `[feat|fix|docs|refactor] summary`
- PR 本文（日本語）: 目的 / 変更点 / テスト結果ログ / 影響範囲 / スクリーンショットや動画（UI 変更時）
- テスト必須: `pnpm test` を Green にする。
- レビュー: 少なくとも Gemini と Codex にレビューを依頼する。

## 7. エージェント別エントリーポイント
- **Copilot**: `.github/copilot-instructions.md`（本ファイルを前提に、Copilot 向け要点のみ記載）。
- **Claude Code**: `CLAUDE.md`（共通ルール参照を前提にした薄いラッパー）。
- **Gemini**: `GEMINI.md`（共通ルール参照を前提にした薄いラッパー）。
- **Codex CLI**: `codex.md`（共通ルール参照。Skill は `.agent/skills/` を参照）。
- `.agent/` 配下はエージェント設定と Skill 用の補助ファイルを格納する。

## 8. 参考
- プロジェクト構成: `app/`（画面）, `components/`（UI コンポーネント）, `docs/`（ドキュメント）。
- スクリーンショットやビルド成果物は必要に応じて PR に添付する。
