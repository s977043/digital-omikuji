# AGENTS.md — Digital Omikuji AI Agent Guide

**Digital Omikuji 専用の AI 統合開発ガイド**

本リポジトリは **AI エージェント ×SDD【仕様書駆動】×AI-TDD** を前提に、複数エージェント（GitHub Copilot / Codex CLI / Gemini CLI / Kiro CLI）が迷わず作業できる標準手順を定義します。人間向け README と分離し、AI 向けの実行ルール・検証・PR 要件をここに集約します。

## 0. 原則（短く、正しく、検証可能に）

- 小さく変更 → テストで実装を裏付け → PR → CI で Green 確認 → レビュー
- 曖昧言を避け、**具体コマンド／期待出力**を書く
- 秘密情報を持ち込まない（.env は編集・コミット禁止）

## 1. スコープと構成

- **ルートディレクトリ**: プロジェクト全体がスコープ
- **ターゲット**:
  - `app/`: Expo Router 画面実装
  - `components/`: UI コンポーネント
  - `docs/`: ドキュメント
  - `.agent/`: エージェント設定
- **触ってはダメ**: `node_modules`, `**/*.lock`, `.env*`, `secrets/*`

## 2. セットアップ & 共通コマンド（npm 前提）

- 依存導入: `npm install`
- 開発サーバー: `npm start`
- ビルド(Web): `npm run build`
- テスト: `npm test`
- Lint: (設定されていれば) `npm run lint`

## 3. コーディング規約

- **TypeScript**: strict mode
- **Style**: NativeWind (Tailwind CSS) を使用 (`className` props)
- **命名**: 変数/関数=camelCase, コンポーネント=PascalCase
- **Expo**: Expo Router v4 の規約に従う

## 4. AI-SDD / AI-TDD 基本線

1. **AI-SDD**: 実装前にプラン（`implementation_plan.md`）を作成し、承認を得る
2. **テストファースト**: 可能な限りテストコードを追加・修正してから実装する
3. **AI-TDD**: AI 支援を活用しつつ最小実装で Green にする
4. **エビデンス提示**: PR にはテスト結果のログを含める

## 5. PR ルール

- タイトル: `[feat|fix|docs|refactor] summary`
- 本文: 目的 / 変更点 / テスト結果ログ / 影響範囲 / スクショ or 動画
- PR 本文とコメントは日本語で記載
- 必須条件: `npm test` が **Green**

## 6. セキュリティ

- `.env*` はコミット禁止
- 外部 API 呼び出しは **例外処理** を必須化

## 7. ツール連携

- **エージェント定義**: `.agent/` ディレクトリ配下を参照のこと
  - プロンプト定義: `.agent/agents/`
  - スキル定義: `.agent/skills/`
  - 方針管理: `.agent/steering/`

## 8. Codex Agent Skills

- Codex CLI を使うときは、`.agent/docs/CodexAgentSkills.md` で Agent Skills の運用ルールを確認する。
- 利用可能な Skill は `.agent/skills/index.json` に一覧化されている。
- 対応する `SKILL.md`（L2）と `run.js`（L3）を参照して実行する。
