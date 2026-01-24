---
title: "開発OS導入ガイド"
description: "AIエージェント運用を開発OSとして導入するための設計と運用手順"
version: "1.0"
last_updated: "2026-01-20"
target_audience: ["developer", "ai_agent"]
---

# 開発OS導入ガイド

## 目的

設定の寄せ集めではなく、運用ルール + 自動化 + 安全装置をまとめて「開発OS」として運用する。
個人設定とプロジェクト設定を分離し、チームの再現性を確保する。

## 3レイヤ構成

- **個人レイヤ (Developer Machine)**: `~/.claude/` など。快適化のみ。チーム必須ルールは置かない。
- **プロジェクトレイヤ (Repository)**: `AGENTS.md`, `.agent/`, `.claude/`, `.codex/`。前提・禁止事項・標準フローを固定化。
- **ガバナンスレイヤ (CI / PR)**: `.github/workflows/`, `.github/PULL_REQUEST_TEMPLATE.md`。最終的な強制力を担保。

## 具体的な配置

- **共通ルール**: `AGENTS.md` (SSOT)
- **Claude**: `CLAUDE.md`, `.claude/settings.json`, `.claude/hooks/`, `.claude/commands/`
- **Codex**: `.codex/`, `.codex/config.toml`
- **エージェント定義/スキル**: `.agent/agents/`, `.agent/skills/`
- **運用フロー**: `.agent/workflows/`

## Hooks の扱い

### 自動化（快適性）

- `PostToolUse` で format/lint/test を補助
- 例: `.claude/hooks/format.sh`

### 安全装置（ブレーキ）

- `PreToolUse` で危険コマンドや権限要求をブロック
- 例: `.claude/hooks/safety.sh`
- Hook は補助。最終的な強制力は CI/PR に置く

## Subagent 運用

- **plan → implement → review → security** を基本フローに固定
- 役割分担は以下のマッピングに従う
- 複数領域に跨る場合は `orchestrator` で調整する

## AIエージェント運用フローと役割

本プロジェクトの AI 運用は「plan → implement → review → security」を基本とし、役割分担を固定化します。
同一エージェントで実装とレビューを兼任しないことを推奨します。

### 基本フロー

1. **plan**: 仕様整理とタスク分解
2. **implement**: 実装とテスト追加
3. **review**: 差分レビューと改善指摘
4. **security**: セキュリティ観点の監査

### 役割マッピング（現行エージェントに接続）

| フェーズ | 主担当エージェント | 期待成果物 | 定義ファイル |
| --- | --- | --- | --- |
| plan | project-planner | 計画 / タスク分解 | `.agent/agents/project-planner.md` |
| implement | frontend-specialist / backend-specialist / mobile-developer（必要に応じて orchestrator が調整） | 実装 + テスト追加 | `.agent/agents/frontend-specialist.md`, `.agent/agents/backend-specialist.md`, `.agent/agents/mobile-developer.md`, `.agent/agents/orchestrator.md` |
| review | test-engineer / debugger | テスト / 品質確認 | `.agent/agents/test-engineer.md`, `.agent/agents/debugger.md` |
| security | security-auditor | セキュリティ監査 | `.agent/agents/security-auditor.md` |

### 補助エージェント（必要時）

- **documentation-writer**: ドキュメント更新と整備 (`.agent/agents/documentation-writer.md`)
- **performance-optimizer**: 性能プロファイルと改善 (`.agent/agents/performance-optimizer.md`)
- **devops-engineer**: CI/CD と運用整備 (`.agent/agents/devops-engineer.md`)
- **database-architect**: DB 設計や最適化 (`.agent/agents/database-architect.md`)
- **seo-specialist**: Web の可視性改善 (`.agent/agents/seo-specialist.md`)
- **penetration-tester**: 攻撃観点の検証 (`.agent/agents/penetration-tester.md`)
- **explorer-agent**: 既存構成の調査 (`.agent/agents/explorer-agent.md`)

## MCP は最小構成

- 必須のものだけ有効化
- 追加は選択式でドキュメント化

## 導入ステップ（推奨順）

1. **快適化Hooks**: format/lint/test を自動化
2. **プロジェクトルール整備**: SSOT を明確化
3. **Subagent の工程化**: 役割分担の固定
4. **安全装置Hooks**: 破壊的操作のブロック
5. **MCP最小化**: 必要最小限で運用

## 導入済み判定

- PR で format/lint/型の指摘が減っている
- エージェントが毎回同じ前提で動く
- 破壊的操作や秘密情報アクセスが Hook/CI で止まる
- 役割分担が固定化されレビュー品質が安定する
