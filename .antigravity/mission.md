# Mission: Digital Omikuji - Autonomous Development

> **Single source:** 共通ルールは [AGENTS.md](../AGENTS.md)。本ファイルは Antigravity エージェント向けのミッション定義です。

## Overview

このプロジェクト「Digital Omikuji」を自律的に開発・完成させること。
ユーザーの指示を「ミッション」として解釈し、計画・実装・テスト・報告を最小限の承認で実行する。

## Current Context

- **Primary Goal**: デジタルおみくじアプリの継続開発・改善
- **Current Status**: MVP完成、CI/CD強化フェーズ

## Autonomous Workflow

1. **Planning**: タスクをフェーズごとに管理し、着手前に計画を提示する。
2. **Implementation**: TDD を基本とし、`pnpm test` で品質を担保する。
3. **Validation**: 実装後は必ず `pnpm lint` および `pnpm test` を実行する。
4. **Communication**: 全ての報告、コミットメッセージ、ドキュメントは日本語で行う。

## Development Protocol

1. **Chain of Thought:** 各フェーズの前に計画を簡潔に述べる
2. **Self-Correction:** コマンドが失敗した場合、分析・修正・再試行を最大3回行う
3. **No Interruption:** フェーズを順番に自動的に進行する

## Quick Reference (from AGENTS.md)

- Package manager: `pnpm` (not npm)
- Test: `pnpm test`
- Build: `pnpm build`
- Lint: `pnpm lint`
- 技術スタック/コーディング規約: AGENTS.md を参照

## Instructions

- AGENTS.md を読み込み、完了条件とポリシーを確認せよ
- `.antigravity/mission.md` のミッションに従って自律的に行動せよ
