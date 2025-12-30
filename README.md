# 2026 年 新春デジタルおみくじ

## 🚀 概要

Remix から **Expo (React Native)** へ移行・刷新されたプロジェクトです。
Docker を使用して、チーム全員が統一された環境で開発できるように構築されています。

## ✨ 機能

- � スマホを振っておみくじを引く（加速度センサー）
- 🎨 美しいアニメーション（Moti）
- 📳 触覚フィードバック（Haptics）
- 🔊 効果音（準備中）
- 📤 SNS シェア機能
- 🐞 開発用デバッグモード

## �🛠 技術スタック

- **フレームワーク:** Expo SDK 52
- **言語:** TypeScript
- **スタイリング:** NativeWind (Tailwind CSS v3)
- **アニメーション:** Moti / Reanimated
- **センサー:** Expo Sensors (加速度センサー)
- **演出:** Expo Haptics (触覚フィードバック)
- **テスト:** Jest + React Native Testing Library

## 🐳 開発環境の起動 (Docker 推奨)

### 1. 環境を立ち上げる

以下のコマンドでビルドと起動を行います。

```bash
docker compose up --build
```

（ポート 8081 が開放されます）

### 2. アプリを実機で確認する

**方法 A: Expo Go (QR コード)**

- ターミナルに表示される QR コードを、スマートフォンの「Expo Go」アプリで読み取ってください。
- 注意: PC とスマホは同じ Wi-Fi に接続している必要があります。

**方法 B: トンネリング (WSL2 などで繋がらない場合)**
同じ Wi-Fi でも接続できない場合（特に Windows/WSL2 環境）は、別のターミナルで以下を実行してトンネル接続を試してください。

```bash
# 実行中のコンテナ内でコマンドを実行
docker compose exec app npx expo start --tunnel
```

### 3. デバッグ機能

- **シェイク・シミュレーション:**
  開発モード（development）では、画面右下に「🐞 Debug Shake」ボタンが表示されます。実機を振らなくてもクリックでおみくじを引くテストが可能です。

## 🧪 テストの実行

```bash
# ローカル環境
npm test

# Docker環境
docker compose exec app npm test
```

## 📦 本番ビルド (EAS Build)

### 初回セットアップ

```bash
# EAS CLIでログイン
npx eas login

# プロジェクトIDを設定
npx eas build:configure
```

### ビルド実行

```bash
# Android開発ビルド
npx eas build --profile development --platform android

# iOS本番ビルド
npx eas build --profile production --platform ios
```

## 📂 プロジェクト構成

- `/app`: Expo Router ページ
- `/components`: UI コンポーネント (結果表示など)
- `/constants`: 定数・設定 (おみくじデータなど)
- `/hooks`: ロジック (おみくじ抽選ロジック)
- `/utils`: ユーティリティ (サウンド管理など)
- `/assets`: 画像・音声ファイル
- `/_legacy_remix_2025`: （旧）Remix 版のアーカイブ

## 📝 開発者向けドキュメント

より詳細な情報は [DEVELOPER.md](./DEVELOPER.md) をご覧ください。

## 🤝 コントリビューション

プルリクエストやバグ報告を歓迎します！

## 📄 ライセンス

MIT License

---

**🎍 良いお年を！ 2026 年も素晴らしい年になりますように 🎍**
