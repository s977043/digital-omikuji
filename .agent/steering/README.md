# ステアリングルール

このディレクトリには、Digital Omikuji プロジェクトの開発方針とプロセス定義が含まれています。

## 📁 ファイル構成

- **[product.md](../.kiro/steering/product.md)** - プロダクト概要、主要機能、ターゲットユーザー
- **[tech.md](../.kiro/steering/tech.md)** - 技術スタック、ビルドシステム、共通コマンド
- **[development.md](./development.md)** - 開発フロー、AI 連携、コード品質基準
- **[structure.md](./structure.md)** - プロジェクト構造、命名規則、ファイル配置

## 🎯 目的

ステアリングルールは、全ての AI エージェント（Kiro、Codex、Gemini、GitHub Copilot）と開発者が共通認識を持つための基盤ドキュメントです。

### 対象読者

- 開発者（人間）
- AI エージェント（Kiro、Codex、Gemini、GitHub Copilot）
- プロダクトマネージャー

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
