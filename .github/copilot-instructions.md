# Copilot instructions (Digital Omikuji)

> **Single source:** 必ず [AGENTS.md](./AGENTS.md) を先に読み、そこで定義された手順・完了条件に従ってください。本ファイルは Copilot 向けの最小差分です。

## 必須チェック（着手前に確認）

- 目的と受入条件を読み、短い計画をコメントで共有してから作業開始。
- タスク単位でブランチを作成し、PR を用意する。
- PR 前に `pnpm test` を実行。レビュー依頼を PR 本文に記載。
- レビューコメントは日本語で記載する。

## 参照ポイント

- 指示ファイル: `.github/instructions/*.instructions.md`
- 共通ルール: `AGENTS.md`
- Docs: 日本語を正とする。

## Project Context

- **Framework**: Expo SDK 52 (Managed Workflow)
- **Routing**: Expo Router v4 (File-based routing in `app/`)
- **Styling**: NativeWind v4 (Tailwind CSS) - `className` props
- **Animation**: Moti (powered by Reanimated)
- **Language**: TypeScript (Strict Mode)
