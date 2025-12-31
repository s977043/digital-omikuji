# codex.md — OpenAI Codex CLI Agent Guide

このファイルは **OpenAI Codex CLI** がプロジェクトのコンテキストとして認識するためのエントリーポイントです。
`.agent/AGENTS.md` に集約されたルールと手順に従ってください。

## 必須アクション

1. **`.agent/AGENTS.md` を読み込み、プロジェクト全体のルールを確認する。**
2. **`.agent/docs/CodexAgentSkills.md` で Agent Skills の運用ルールを確認する。**
3. 開発・テスト・PR 作成は `AGENTS.md` の記述に従う。

## プロジェクト概要

- **Framework**: Expo SDK 52 (Managed Workflow)
- **Routing**: Expo Router v4 (File-based routing in `app/`)
- **Styling**: NativeWind v4 (Tailwind CSS) - `className` props を使用
- **Animation**: Moti (powered by Reanimated)
- **Language**: TypeScript (Strict Mode)

## 主要コマンド

```bash
npm install   # 依存パッケージのインストール
npm test      # テスト実行
npm start     # 開発サーバー起動
npm run build # ビルド (Web)
```

## Agent Skills

Codex CLI では `.agent/skills/` 配下の Agent Skills を活用できます。

- Skill 一覧: `.agent/skills/index.json`
- 各 Skill の詳細: `.agent/skills/<skill>/SKILL.md`
- 実行スクリプト: `.agent/skills/<skill>/run.js`

詳細は `.agent/docs/CodexAgentSkills.md` を参照してください。

---

> Note: プロジェクト固有のルール（ビルド、テスト、ファイル構成など）はすべて `.agent/AGENTS.md` に一元化されています。このファイルを更新するのではなく、`AGENTS.md` に知見をフィードバックしてください。
