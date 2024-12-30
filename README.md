
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

1. Docker をインストールします。
2. `docker-compose.yml` を使用して、Docker コンテナを起動します。
    ```bash
    docker-compose up -d
    ```

#### 実行方法

```bash
docker-compose up -d
```

#### ビルド方法

```bash
docker-compose run build
```

#### 本番環境用イメージのビルド

```bash
docker-compose build web
```

#### テスト方法

```bash
npm run test
```

### ファイル構成

```
digital-omikuji/
├── app/
│   ├── routes/
│   │   ├── index.tsx       // おみくじアプリのメインコンポーネント
│   │   └── index.test.tsx  // おみくじアプリのテストコード
│   └── entry.client.tsx   // クライアントサイドのエントリーポイント
├── public/
│   └── build/              // ビルドされたファイル
├── Dockerfile              // Dockerfile
├── docker-compose.yml      // docker-compose 設定ファイル
├── remix.config.js         // Remixの設定ファイル
├── package.json            // 依存関係など
└── ...
```


### ライセンス

MIT License

### 作者情報

s977043
```
