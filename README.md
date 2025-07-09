# digital-omikuji

### 概要

Remix で作成したデジタルおみくじアプリです。  
ボタンをクリックするだけで、いつでもどこでもおみくじを引くことができます。

### 使用技術

- **Remix** - React ベースの Web フレームワーク
- **TypeScript** - 型安全な JavaScript
- **Tailwind CSS** - ユーティリティファーストの CSS フレームワーク
- **Docker** - コンテナ化技術
- **VibeCoding** - AI 支援開発環境
- **Gemini CLI** - Google AI を活用したコード生成・レビューツール

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

このプロジェクトには、プルリクエストがマージされた際にテストを実行するための GitHub Actions ワークフローが含まれています。ワークフローは `.github/workflows/test-on-pr-merge.yml` に定義されています。

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
- **[API仕様書](documents/API仕様書.md)** - APIエンドポイントの仕様
- **[トラブルシューティングガイド](documents/トラブルシューティングガイド.md)** - よくある問題と解決方法
- **[デプロイメントマニュアル](documents/デプロイメントマニュアル.md)** - 本番環境へのデプロイ手順

### ライセンス

MIT License

### 作者情報

s977043
