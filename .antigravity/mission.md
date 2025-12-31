# Mission: Digital Omikuji - Autonomous Development

## Overview

このプロジェクト「Digital Omikuji」を自律的に開発・完成させること。
ユーザーの指示を「ミッション」として解釈し、計画・実装・テスト・報告を最小限の承認で実行する。

## Current Context

- **Framework**: Expo SDK 52 (React Native)
- **Primary Goal**: 2026年新春デジタルおみくじアプリの完成
- **Current Status**: MVP完成、River Reviewer統合およびCI/CD強化フェーズ

## Autonomous Workflow

1. **Planning**: `implementation_plan.md` を更新し、タスクをフェーズごとに管理する。
2. **Implementation**: TDD（Test Driven Development）を基本とし、`npm test` で品質を担保する。
3. **Validation**: 実装後は必ず `npm run lint` および `npm test` を実行する。
4. **Communication**: 全ての報告、コミットメッセージ、ドキュメントは日本語で行う。

## Technical Stack

- **Stack:** Expo SDK (Latest), TypeScript, NativeWind, Moti
- **Style:** Clean Architecture
- **Security:** No hardcoded secrets

## Development Protocol

1. **Chain of Thought:** 各フェーズの前に計画を簡潔に述べる
2. **Self-Correction:** コマンドが失敗した場合、分析・修正・再試行を最大3回行う
3. **No Interruption:** フェーズを順番に自動的に進行する

## Instructions

- `.antigravity/mission.md` を読み込み、ミッションに従って行動せよ
- 次回起動時、"Read .antigravity/mission.md and execute Phase X" の指示により該当フェーズを開始せよ
