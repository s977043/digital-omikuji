# Gemini instructions (Digital Omikuji)

> **Single source:** 必ず [.agent/AGENTS.md](./.agent/AGENTS.md) を読み、共通ルールと完了条件に従ってください。本ファイルは Gemini 向けの薄いラッパーです。

## 必須チェック（着手前に確認）

- 「完了条件」とリポジトリポリシー（AGENTS.md）を確認し、計画を提示してから作業開始。
- ブランチはタスク単位。PR前に`pnpm test`を実行し、レビュー依頼を明記。
- 出力は日本語が基準。

## Gemini-specific Tips

### Prompt assembly

- 最初のコンテキストに`AGENTS.md`の全文（または要約）を含める。
- 本ファイル（GEMINI.md）は、Gemini固有の振る舞い調整が必要な場合のみ参照する。
- タスク概要、受入条件、編集対象ファイルを明確にする。

## Project Context

- **Framework**: Expo SDK 52 (Managed Workflow)
- **Routing**: Expo Router v4 (File-based routing in `app/`)
- **Styling**: NativeWind v4 (Tailwind CSS) - `className` props
- **Animation**: Moti (powered by Reanimated)
- **Language**: TypeScript (Strict Mode)

> ルール変更や運用メモは`AGENTS.md`に集約し、このファイルは最小限に保ってください。
