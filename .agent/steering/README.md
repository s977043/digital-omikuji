---
title: "ステアリングルール - 概要"
description: "Digital Omikujiプロジェクトの開発方針とプロセス定義の統合ドキュメント"
version: "2.1"
last_updated: "2026-01-19"
target_audience: ["developer", "ai_agent"]
status: "active"
---

# ステアリングルール

このディレクトリには、Digital Omikuji プロジェクトの開発方針とプロセス定義が含まれています。

## 📁 ファイル構成

- **[development.md](./development.md)** - 開発フロー、AI 連携、コード品質基準
- **[structure.md](./structure.md)** - プロジェクト構造、命名規則、ファイル配置
- **[sdd-workflow.md](./sdd-workflow.md)** - SDD（仕様駆動開発）のワークフロー定義

技術スタック、共通コマンド、プロダクト概要などの基本情報は [AGENTS.md](../../AGENTS.md) を参照してください。

## 🎯 目的

ステアリングルールは、全ての AI エージェント（Claude、Copilot、Codex、Gemini）と開発者が共通認識を持つための基盤ドキュメントです。

### 対象読者

- 開発者（人間）
- AI エージェント（Claude、Copilot、Codex、Gemini）
- プロダクトマネージャー

## 🔧 統一AIエージェント設定フォーマット

本プロジェクトでは、複数のAIエージェントの設定を統一フォーマットで管理しています。

### 設定ファイル

統一設定ファイル: `.agent/config/unified-agent-config.json`

```json
{
  "version": "1.0",
  "agents": {
    "claude": { "configFile": "CLAUDE.md", "enabled": true },
    "copilot": { "configFile": ".github/copilot-instructions.md", "enabled": true },
    "codex": { "configFile": "codex.md", "enabled": true },
    "gemini": { "configFile": "GEMINI.md", "enabled": true }
  },
  "sharedRules": ".agent/AGENTS.md",
  "steering": ".agent/steering"
}
```

### フォーマット仕様

| フィールド                 | 説明                                 |
| -------------------------- | ------------------------------------ |
| `version`                  | 設定フォーマットのバージョン         |
| `agents`                   | 各AIエージェントの設定               |
| `agents.<name>.configFile` | エージェント固有の設定ファイルパス   |
| `agents.<name>.enabled`    | エージェントの有効/無効フラグ        |
| `sharedRules`              | 全エージェント共通のルールファイル   |
| `steering`                 | ステアリングルールのディレクトリパス |

### 対応AIエージェント

| エージェント | 設定ファイル                      | 説明                    |
| ------------ | --------------------------------- | ----------------------- |
| Claude       | `CLAUDE.md`                       | Claude Code CLI用の設定 |
| Copilot      | `.github/copilot-instructions.md` | GitHub Copilot用の設定  |
| Codex        | `codex.md`                        | Codex CLI用の設定       |
| Gemini       | `GEMINI.md`                       | Gemini CLI用の設定      |

### 運用ルール

1. **共通ルールの一元化**: 全エージェント共通のルールは `.agent/AGENTS.md` に記載
2. **エージェント固有設定**: 各エージェント固有の設定は個別のファイルで管理
3. **有効/無効の切り替え**: `enabled` フラグで各エージェントの有効/無効を制御
4. **バージョン管理**: フォーマット変更時は `version` を更新

## 🔄 更新ルール

### 更新頻度

- **development.md**: 開発プロセス改善時
- **structure.md**: ディレクトリ構造変更時
- **sdd-workflow.md**: SDDワークフロー変更時

## 📖 関連ドキュメント

- **[AGENTS.md](../../AGENTS.md)** - AI 統合開発ガイド
- **[.agent/workflows/](../workflows/)** - 開発ワークフロー集
- **[.agent/skills/](../skills/)** - Agent Skills（再利用可能なスキル集）

## 🚀 使い方

### 新規開発者向け

1. まず [AGENTS.md](../../AGENTS.md) でプロジェクト全体像を理解
2. [structure.md](./structure.md) でプロジェクト構造を把握
3. [development.md](./development.md) で開発フローを確認
4. [sdd-workflow.md](./sdd-workflow.md) でSDDワークフローを理解

### AI エージェント向け

AI エージェントは `AGENTS.md` を通じてこのディレクトリを参照します。各エージェント固有の設定は `.agent/config/unified-agent-config.json` で管理されています。

## 📝 変更履歴

- **2026-01-19**: `.kiro/` 参照を削除し、AGENTS.mdへの参照を統一
- **2025-12-10**: ドキュメント整理により旧プロジェクト構造から統合
- **2025-10-22**: 初版作成
