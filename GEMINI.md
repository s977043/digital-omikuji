# GEMINI.md — Gemini Agent Guide

このファイルは Gemini（CLI/エディタ拡張）で作業するときの入口です。共通ルールはリポジトリ直下の `AGENTS.md` に集約されています。

## ✅ まず確認
1. `AGENTS.md` を読み、開発・テスト・PR のルールを把握する（特に**第1章の禁止事項**：secrets, lockfile 不変などを厳守）。
2. 変更前に計画を立て、小さな単位で実装し、`pnpm test` の結果を PR に添付する。

## 🧭 プロジェクトの要点
- Expo SDK 52 / Expo Router v4
- NativeWind（`className`）と Moti/Reanimated
- TypeScript (strict) で Functional Component + Hooks

> ルール変更や追加の運用メモは `AGENTS.md` に反映し、このファイルは薄いラッパーとして保守してください。
