# 開発者向けドキュメント

## 🏗 プロジェクト構造

```
digital-omikuji/
├── app/                    # Expo Router ページ
│   └── index.tsx          # メインアプリ画面
├── components/            # UIコンポーネント
│   └── FortuneDisplay.tsx # 結果表示コンポーネント
├── constants/             # 定数・設定
│   └── OmikujiData.ts    # おみくじデータと重み付け
├── hooks/                 # カスタムフック
│   ├── useOmikujiLogic.ts # 抽選ロジック
│   └── __tests__/         # テストファイル
├── utils/                 # ユーティリティ
│   └── SoundManager.ts   # サウンド管理
├── assets/               # 画像・音声ファイル
├── .gitignore
├── Dockerfile
├── compose.yaml          # Docker Compose設定
├── eas.json              # EAS Build設定
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 テストの実行

```bash
# ローカル環境でテスト実行
npm test

# Docker内でテスト実行
docker compose exec app npm test
```

## 📦 EAS Build

### 開発ビルド

```bash
eas build --profile development --platform android
```

### プレビュービルド

```bash
eas build --profile preview --platform ios
```

### 本番ビルド

```bash
eas build --profile production --platform all
```

## 🎨 カスタマイズガイド

### おみくじの種類を追加する

`constants/OmikujiData.ts` を編集して、新しい運勢を追加できます。

```typescript
{
  result: '末吉',
  message: 'あなた独自のメッセージ',
  weight: 15, // 出現確率（合計で自由に調整可能）
  color: '#YOUR_COLOR',
}
```

### アニメーションの調整

`app/index.tsx` の各状態（IDLE, SHAKING, REVEALING, RESULT）で MotiView の設定を変更できます。

## 🔊 サウンドファイルの追加

1. `assets/sounds/` ディレクトリに音声ファイルを配置
2. `utils/SoundManager.ts` でサウンドを登録
3. アプリ内で `soundManager.playSound('your-sound')` を呼び出す

## 🌐 環境変数

`app.config.ts` で `APP_VARIANT` 環境変数を使用してビルド設定を切り替えています。

- `development`: 開発版
- `preview`: プレビュー版（内部配布用）
- `production`: 本番リリース版

## 📱 実機テスト

1. Expo Go アプリをインストール
2. `npm start` または `docker compose up` でサーバー起動
3. QR コードをスキャン

### トラブルシューティング

**Q: 接続できない**
A: トンネルモードを試す

```bash
npx expo start --tunnel
```

**Q: シェイクが反応しない**
A: デバッグボタン (🐞) を使用するか、感度 `SHAKE_THRESHOLD` を調整

## 🤝 コントリビューション

プルリクエストを歓迎します！
バグ報告や機能提案は Issue でお知らせください。
