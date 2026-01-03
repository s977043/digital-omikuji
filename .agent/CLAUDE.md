# CLAUDE.md — Claude Code Agent Guide

このファイルは **Claude Code (CLI)** 用のエントリーポイントです。共通ルールはリポジトリ直下の `AGENTS.md` に集約されています。

## 🤖 必須アクション
1. **`AGENTS.md` を読み、開発・テスト・PR のルールを確認する。**
2. 以降の作業・レビューは `AGENTS.md` の方針に従う。

---

## ゴール / 非ゴール
- **ゴール**: バグ修正・リファクタ・テスト追加・ドキュメント改善
- **非ゴール**: DB設計変更・大規模UIリニューアル・Expo SDK のメジャーバージョン変更

## 技術スタック（要点）
- **Frontend**: Expo SDK 52 / Expo Router v4
- **Style**: NativeWind v4 + Moti (Reanimated)
- **Language**: TypeScript (strict)
- **Package Manager**: pnpm
- **Tests**: Jest (`pnpm test`)

## Definition of Done
- 変更は小さく、差分が説明できる単位で
- `pnpm test` が通ること
- 変更理由と影響範囲を PR 本文に書く
- public API / 既存仕様の互換性を壊さない

## 重要な制約
- **secrets は触らない**（`.env*`, `secrets/` は見ない）
- 既存の public API の互換性を壊さない
- 外部 API 呼び出しでは例外処理を入れる

## Claude が実行してよいコマンド
- `pnpm install`
- `pnpm test`
- `pnpm build`
- `pnpm start`
- `git status` / `git diff`

## 使うべきカスタムコマンド
- `/check` : 変更後の品質チェック
- `/pr`    : PR 本文をテンプレで生成
- `/review`: 差分レビュー（観点固定）

（コマンド定義は `.claude/commands/` を参照）

---

> ルールの更新・追加は `AGENTS.md` に反映してください。このファイルは Claude 固有の要約です。
