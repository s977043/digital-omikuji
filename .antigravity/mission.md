# Mission: Digital Omikuji - Autonomous Development

> **Single source:** 共通ルールは [AGENTS.md](../AGENTS.md)。本ファイルは Antigravity エージェント向けのミッション定義です。

## Overview

このプロジェクト「Digital Omikuji」を自律的に開発・完成させること。
ユーザーの指示を「ミッション」として解釈し、計画・実装・テスト・報告を最小限の承認で実行する。

> [!CAUTION]
> **SDD 強制**: 全ての開発作業は [SDD Core Skill](../.agent/skills/sdd-core/SKILL.md) の原則に従うこと。
> 仕様ドキュメントなしに実装を開始してはならない。

## Current Context

- **Primary Goal**: デジタルおみくじアプリの継続開発・改善
- **Current Status**: MVP完成、CI/CD強化フェーズ

## SDD ワークフロー（強制）

本プロジェクトでは「仕様駆動開発（SDD）」を最優先の開発原則とする。

### Gate（承認ポイント）

| Gate | タイミング | アクション |
|------|-----------|-----------|
| **Gate A** | Working Documents 作成後 | **基本は自律進行**。自信がない場合のみレビュー要求 |
| Gate B | テスト作成後 | テストなし実装は禁止だが、自律的に追加して進行可 |
| Gate C | 完了報告作成後 | 基本は事後報告。重大な懸念がある場合のみ停止 |

### Working Documents

新機能・変更時は `docs/working/{YYYYMMDD}_{feature}/` に以下を作成：

- `requirements.md` - 要件定義（受け入れ基準を含む）
- `design.md` - 設計ドキュメント
- `tasklist.md` - タスク分解
- `testing.md` - テスト計画
- `completion-report.md` - 完了報告（Phase 4 で作成）

## Autonomous Workflow

1. **Phase 0 - 理解**: リポジトリを読み、影響範囲を特定する
2. **Phase 1 - Working Documents 作成**: 仕様書を作成し、自信があれば次へ進む
3. **Phase 2 - テスト作成**: TDD を基本とし、テストを先に作成する
4. **Phase 3 - 実装**: 仕様に基づき最小限の変更を行う
5. **Phase 4 - 検証・完了**: テスト実行、completion-report.md 作成

## Development Protocol

1. **Chain of Thought:** 各フェーズの前に計画を簡潔に述べる
2. **Self-Correction:** コマンドが失敗した場合、分析・修正・再試行を最大3回行う
3. **No Interruption:** Gate 以外ではフェーズを順番に自動的に進行する
4. **Documentation First:** 実装前に必ず仕様を書く

## 禁止事項

- 仕様・設計ドキュメントを参照せずに実装すること
- 指示されていない機能追加・最適化
- 「たぶんこうだろう」という推測による実装
- Gate を無視して先に進むこと

## Quick Reference (from AGENTS.md)

- Package manager: `pnpm` (not npm)
- Test: `pnpm test`
- Build: `pnpm build`
- Lint: `pnpm lint`
- 技術スタック/コーディング規約: AGENTS.md を参照

## Instructions

1. `.agent/skills/sdd-core/SKILL.md` を読み込み、SDD 原則を理解せよ
2. AGENTS.md を読み込み、完了条件とポリシーを確認せよ
3. 本ミッションに従って自律的に行動せよ
4. **Gate では自律的に判断し、必要があれば人間の承認を待て（基本は自律進行）**
