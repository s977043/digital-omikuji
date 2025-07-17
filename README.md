# digital-omikuji

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D14-brightgreen.svg)
![GitHub Issues](https://img.shields.io/github/issues/s977043/digital-omikuji)
![GitHub Stars](https://img.shields.io/github/stars/s977043/digital-omikuji?style=social)
![GitHub Actions](https://img.shields.io/github/actions/workflow/status/s977043/digital-omikuji/documentation-check.yml)

### 概要

Remix で作成したデジタルおみくじアプリです。  
ボタンをクリックするだけで、いつでもどこでもおみくじを引くことができます。

### 🌟 特徴

- **シンプルな操作**: ワンクリックでおみくじを引けます
- **レスポンシブデザイン**: PC・スマートフォン両対応
- **軽量**: 高速で動作します
- **オープンソース**: MIT ライセンスで自由に利用可能

### 使用技術

- **Remix** - React ベースの Web フレームワーク
- **TypeScript** - 型安全な JavaScript
- **Tailwind CSS** - ユーティリティファーストの CSS フレームワーク
- **Docker** - コンテナ化技術
- **VibeCoding** - AI 支援開発環境
- **Gemini CLI** - Google AI を活用したコード生成・レビューツール
- **Gemini CLI ファイル指示システム** - ファイルベースの自動実行機能

### 機能

* おみくじを引く機能
    * 「大吉」「中吉」「小吉」「凶」の結果をランダムに表示します。
    * 各おみくじの出現割合は、重み付け乱数によって調整されています。

### 使い方

1. リポジトリをクローンします。
   ```bash
   git clone https://github.com/s977043/digital-omikuji.git
   ```
2. Docker Compose を使用して、アプリケーションを起動します。
   ```bash
   cd digital-omikuji
   docker-compose up -d
   ```
3. ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスします。
4. 「おみくじを引く」ボタンをクリックして、おみくじの結果を表示します。

### 開発方法

#### 開発環境の構築

VibeCoding と Gemini CLI を使用した効率的な開発環境の構築については、以下のドキュメントを参照してください：

- [開発環境構築ガイド](documents/開発環境構築ガイド.md)
- [VibeCoding設定ガイド](documents/VibeCoding設定ガイド.md)
- [Gemini CLI使用方法](documents/Gemini_CLI使用方法.md)

#### 基本的な実行方法

```bash
# 開発サーバーの起動
npm run dev

# ドキュメント状態のチェック
npm run check-docs

# Gemini CLI ファイル指示システムの使用
npm run gemini:run <指示ファイル> # カスタム指示ファイルの実行
npm run gemini:component     # コンポーネント生成
npm run gemini:review        # プロジェクトレビュー  
npm run gemini:enhance       # おみくじ機能拡張
npm run gemini:check-docs    # ドキュメント更新チェック
npm run gemini:check-readme  # README更新確認
npm run gemini:pr-docs-review # PRドキュメントレビュー

# Docker を使用した実行
docker-compose up -d
```

#### ビルド方法

```bash
# 本番用ビルド
npm run build

# Docker を使用したビルド
docker-compose run build
```

#### 本番環境用イメージのビルド

```bash
docker-compose build web
```

### テスト方法

```bash
npm run test
```

### GitHub Actions

このプロジェクトには、以下のGitHub Actionsワークフローが含まれています：

- **test-on-pr-merge.yml** - プルリクエストがマージされた際にテストを実行
- **documentation-check.yml** - プルリクエスト作成時にドキュメントの更新状況をチェック

### ドキュメント更新システム

プロジェクトには、ドキュメントを最新に保つための自動化システムが組み込まれています：

#### 機能
- **自動ドキュメントチェック** - コード変更時にドキュメント更新の必要性を自動判定
- **README同期確認** - README.mdとコードの同期状態をチェック
- **PRレビュー時のドキュメント確認** - プルリクエスト作成時に自動でドキュメント状況をレビュー

#### 使用方法
```bash
# ドキュメント状態の手動チェック
npm run check-docs

# Gemini CLIを使用したドキュメント確認
npm run gemini:check-docs    # コード変更に基づくドキュメント更新チェック
npm run gemini:check-readme  # README更新確認
npm run gemini:pr-docs-review # PRレビュー用ドキュメントチェック
```

### ファイル構成

```
digital-omikuji/
├── app/
│   ├── routes/
│   │   ├── index.tsx       // おみくじアプリのメインコンポーネント
│   │   └── index.test.tsx  // おみくじアプリのテストコード
│   └── entry.client.tsx   // クライアントサイドのエントリーポイント
├── documents/             // プロジェクトドキュメント
│   ├── プロジェクト構成.md
│   ├── VibeCoding設定ガイド.md
│   ├── Gemini_CLI使用方法.md
│   ├── 開発環境構築ガイド.md
│   ├── API仕様書.md
│   ├── トラブルシューティングガイド.md
│   └── デプロイメントマニュアル.md
├── public/
├── Dockerfile              // Dockerfile
├── docker-compose.yml      // docker-compose 設定ファイル
├── remix.config.js         // Remixの設定ファイル
├── LICENSE                 // ライセンスファイル
├── package.json            // 依存関係など
└── ...
```

### ドキュメント

プロジェクトに関する詳細なドキュメントは、`documents/` フォルダ内に整理されています：

- **[プロジェクト構成](documents/プロジェクト構成.md)** - プロジェクトの全体構成と技術スタック
- **[開発環境構築ガイド](documents/開発環境構築ガイド.md)** - 開発環境のセットアップ手順
- **[VibeCoding設定ガイド](documents/VibeCoding設定ガイド.md)** - VibeCoding の設定と使用方法
- **[Gemini CLI使用方法](documents/Gemini_CLI使用方法.md)** - Gemini CLI を使用したAI支援開発
- **[Gemini CLI ファイル指示システム](documents/Gemini_CLI_ファイル指示システム.md)** - ファイルベースの自動実行システム
- **[ドキュメント更新システム](documents/ドキュメント更新システム.md)** - 自動ドキュメント更新・検証システム
- **[API仕様書](documents/API仕様書.md)** - APIエンドポイントの仕様
- **[トラブルシューティングガイド](documents/トラブルシューティングガイド.md)** - よくある問題と解決方法
- **[デプロイメントマニュアル](documents/デプロイメントマニュアル.md)** - 本番環境へのデプロイ手順

### ライセンス

MIT License

### 🤝 貢献

プロジェクトへの貢献を歓迎します！詳細は [CONTRIBUTING.md](CONTRIBUTING.md) をご覧ください。

- バグ報告や機能要求は [Issues](https://github.com/s977043/digital-omikuji/issues) で受け付けています
- プルリクエストをお待ちしています
- ドキュメントの改善も大歓迎です

### 🔒 セキュリティ

セキュリティ上の問題を発見した場合は、[SECURITY.md](SECURITY.md) に従って報告してください。

### 作者情報

s977043
