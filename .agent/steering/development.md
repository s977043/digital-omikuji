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
- **運用フロー**: `.agent/workflows/`, `docs/AI_AGENTS_ROLES.md`

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
- 役割分担の詳細は `docs/AI_AGENTS_ROLES.md` を参照
- 複数領域に跨る場合は `orchestrator` で調整する

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
