# codex.md — OpenAI Codex CLI Agent Guide

このファイルは **OpenAI Codex CLI** がプロジェクトのコンテキストとして認識するためのエントリーポイントです。共通ルールはリポジトリ直下の `AGENTS.md` を必ず参照してください。

## 必須アクション
1. **`AGENTS.md` を読み、開発・テスト・PR のルールを把握する。**
2. Skill 利用時は `.agent/docs/CodexAgentSkills.md` と `.agent/skills/index.json` を確認する。

## プロジェクト概要
- Expo SDK 52 (Managed) / Expo Router v4
- NativeWind v4 で `className` を使用
- TypeScript (Strict), Moti/Reanimated を利用

## 主要コマンド（pnpm）
```bash
pnpm install   # 依存導入
pnpm test      # テスト
pnpm start     # 開発サーバー
pnpm build     # Web ビルド
pnpm lint      # Lint（設定がある場合）
```

## Agent Skills
- Skill 一覧: `.agent/skills/index.json`
- 各 Skill の詳細: `.agent/skills/<skill>/SKILL.md`
- 実行スクリプト: `.agent/skills/<skill>/run.js`

> プロジェクト固有ルールの更新は `AGENTS.md` に集約してください。このファイルは Codex CLI の入口とリンク集に留めます。
