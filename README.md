# digital-omikuji

### 概要

Remix で作成したデジタルおみくじアプリです。  
ボタンをクリックするだけで、いつでもどこでもおみくじを引くことができます。

### 使用技術

* Remix
* TypeScript
* Tailwind CSS
* Docker

### 機能

* おみくじを引く機能
    * 「大吉」「中吉」「小吉」「凶」の結果をランダムに表示します。
    * 各おみくじの出現割合は、重み付け乱数によって調整されています。

### 使い方

1. リポジトリをクローンします。
   ```bash
   git clone [https://github.com/s977043/digital-omikuji.git](https://github.com/s977043/digital-omikuji.git)
Docker Compose を使用して、アプリケーションを起動します。
Bash

cd digital-omikuji
docker-compose up -d
ブラウザで http://localhost:3000 にアクセスします。
「おみくじを引く」ボタンをクリックして、おみくじの結果を表示します。
開発方法
開発環境の構築
Docker をインストールします。
docker-compose.yml を使用して、Docker コンテナを起動します。
実行方法
Bash

docker-compose up -d
ビルド方法
Bash

docker-compose run build
本番環境用イメージのビルド
Bash

docker-compose build web
テスト方法
Bash

npm run test
ファイル構成
digital-omikuji/
├── app/
│   ├── routes/
│   │   └── index.tsx       // おみくじアプリのメインコンポーネント
│   │   └── index.test.tsx  // おみくじアプリのテストコード
│   └── entry.client.tsx   // クライアントサイドのエントリーポイント
├── public/
│   └── build/              // ビルドされたファイル
├── Dockerfile             // Dockerfile
├── docker-compose.yml      // docker-compose 設定ファイル
├── remix.config.js        // Remixの設定ファイル
├── package.json           // 依存関係など
└── ...
スクリーンショット

ライセンス
MIT License

作者情報
s977043
