# 🎍 2026 年 新春デジタルおみくじ

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Expo](https://img.shields.io/badge/Framework-Expo%20SDK%2052-black) ![TypeScript](https://img.shields.io/badge/Language-TypeScript-007ACC)

## 🚀 概要

2026 年の新春を祝う、スマートフォン特化型のデジタルおみくじアプリです。
**Expo (React Native)** をベースに、Docker を使用した統一開発環境と快適な DX（Developer Experience）を実現しています。

## ✨ 特徴 - Premium Experience

- 📱 **シェイク機能**: 加速度センサーを活用し、スマホを振る直感的な操作感を実現
- 🎨 **リッチなアニメーション**: `Moti` (Powered by Reanimated) による滑らかで美しい演出
- 📳 **触覚フィードバック**: `expo-haptics` による心地よい振動演出
- 📤 **SNS シェア**: おみくじ結果を**画像付き**で即座にシェア可能（`react-native-view-shot`使用）
- 🔊 **サウンド**: 効果音再生機能（※現在準備中・基盤実装済み）
- 🐞 **デバッグモード**: 実機がなくても検証可能なシミュレーション機能を搭載

## 🛠 技術スタック

| Category       | Technology                            |
| -------------- | ------------------------------------- |
| **Framework**  | Expo SDK 52 (Expo Router v4)          |
| **Language**   | TypeScript                            |
| **Styling**    | NativeWind v4 (Tailwind CSS)          |
| **Animation**  | Moti / React Native Reanimated        |
| **Device API** | Expo Sensors / Expo Haptics / Expo AV |
| **Testing**    | Jest / React Native Testing Library   |

## 🐳 開発環境の起動 (Docker 推奨)

チーム開発において最も推奨される方法です。環境差異を吸収し、ワンコマンドで起動・終了が可能です。

### 1. 起動

```bash
docker compose up --build
```

（ポート `8081` で Metro Bundler が起動します）

### 2. 実機確認

**方法 A: QR コード (推奨)**
ターミナルに表示される QR コードを「Expo Go」アプリ（iOS/Android）でスキャンしてください。
_※ PC とスマホは同一 Wi-Fi ネットワークに接続する必要があります。_

**方法 B: トンネル接続**
Wi-Fi 環境の制約や WSL2 で接続できない場合は、以下のコマンドを別ターミナルで実行してください。

```bash
docker compose exec app npx expo start --tunnel
```

---

## 💻 ローカル開発環境の起動 (Non-Docker)

Node.js 環境が整っている場合、ローカルで直接実行することも可能です。

### 前提条件

- **Node.js v20 以上** (必須)
- npm

### 手順

1. 依存関係のインストール

   ```bash
   npm install
   ```

2. 開発サーバーの起動

   ```bash
   npm start
   # または
   npx expo start
   ```

## 🧪 テスト

品質担保のため、主要ロジックとコンポーネントはテストされています。

```bash
# ローカル実行
npm test

# Docker実行
docker compose exec app npm test
```

## 📦 ビルド (EAS Build)

Expo Application Services (EAS) を利用してアプリをビルドします。

```bash
# EAS CLIログイン
npx eas login

# Android 開発用ビルド
npx eas build --profile development --platform android

# iOS 本番用ビルド
npx eas build --profile production --platform ios
```

## 📂 ディレクトリ構成

- `/app`: アプリのページルーティング (Expo Router)
- `/components`: 再利用可能な UI コンポーネント
- `/constants`: おみくじデータ定義などの定数
- `/hooks`: 抽選ロジックなどのカスタムフック
- `/utils`: サウンド管理などのユーティリティ
- `/assets`: 画像・静的リソース

## 📝 ドキュメント

より詳細なアーキテクチャや拡張方法については [DEVELOPER.md](./docs/DEVELOPER.md) を参照してください。

## 🤝 コントリビューション

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 ライセンス

[MIT License](./LICENSE)

---

**🎍 2026 年も素晴らしい一年になりますように！ Happy New Year! 🎍**
