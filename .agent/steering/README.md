# ステアリングルール

このディレクトリには、Digital Omikuji プロジェクトの開発方針とプロセス定義が含まれています。

## 📁 ファイル構成

- **[product.md](../.kiro/steering/product.md)** - プロダクト概要、主要機能、ターゲットユーザー
- **[tech.md](../.kiro/steering/tech.md)** - 技術スタック、ビルドシステム、共通コマンド
- **[development.md](./development.md)** - 開発フロー、AI 連携、コード品質基準
- **[structure.md](./structure.md)** - プロジェクト構造、命名規則、ファイル配置

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
  "steering": ".agent/steering/"
}
```

### フォーマット仕様

| フィールド | 説明 |
|-----------|------|
| `version` | 設定フォーマットのバージョン |
| `agents` | 各AIエージェントの設定 |
| `agents.<name>.configFile` | エージェント固有の設定ファイルパス |
| `agents.<name>.enabled` | エージェントの有効/無効フラグ |
| `sharedRules` | 全エージェント共通のルールファイル |
| `steering` | ステアリングルールのディレクトリパス |

### 対応AIエージェント

| エージェント | 設定ファイル | 説明 |
|-------------|-------------|------|
| Claude | `CLAUDE.md` | Claude Code CLI用の設定 |
| Copilot | `.github/copilot-instructions.md` | GitHub Copilot用の設定 |
| Codex | `codex.md` | Codex CLI用の設定 |
| Gemini | `GEMINI.md` | Gemini CLI用の設定 |

### 運用ルール

1. **共通ルールの一元化**: 全エージェント共通のルールは `.agent/AGENTS.md` に記載
2. **エージェント固有設定**: 各エージェント固有の設定は個別のファイルで管理
3. **有効/無効の切り替え**: `enabled` フラグで各エージェントの有効/無効を制御
4. **バージョン管理**: フォーマット変更時は `version` を更新

## 🔄 更新ルール

### 更新頻度

- **product.md**: 機能追加・変更時
- **tech.md**: 技術スタック変更時
- **development.md**: 開発プロセス改善時
- **structure.md**: ディレクトリ構造変更時

## 📖 関連ドキュメント

- **[AGENTS.md](../AGENTS.md)** - AI 統合開発ガイド
- **[docs/AI_AGENTS_ROLES.md](../docs/AI_AGENTS_ROLES.md)** - AI エージェント役割定義
- **[.kiro/specs/](../.kiro/specs/)** - 実案件の機能仕様書

## 🚀 使い方

### 新規開発者向け

1. まず `product.md` でプロダクト概要を理解
2. `tech.md` で技術スタックとコマンドを確認
3. `development.md` で開発フローを把握
4. `structure.md` でプロジェクト構造を理解

### AI エージェント向け

Kiro は自動的に `.kiro/steering/` を読み込みます。他の AI エージェントは `AGENTS.md` を通じてこのディレクトリを参照します。

## 📝 変更履歴

- **2025-12-10**: ドキュメント整理により `.kiro/steering/` から統合
- **2025-10-22**: 初版作成
