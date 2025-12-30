# 🛠 開発者向けドキュメント (DEVELOPER GUIDE)

## 🏗 アーキテクチャ概要

本プロジェクトは **Expo Router (File-based routing)** を採用し、モダンでスケーラブルな構成になっています。

### ディレクトリ構造詳細

```
digital-omikuji/
├── app/                    # アプリケーションのエントリーポイント & ルーティング
│   ├── _layout.tsx        # アプリ全体のレイアウト・プロバイダー設定
│   └── index.tsx          # メイン画面 (おみくじ体験のコア)
├── components/            # プレゼンテーションコンポーネント
│   └── FortuneDisplay.tsx # 結果表示 UI (Motiによるアニメーション含む・画像シェア機能付き)
├── constants/             # アプリ設定・固定データ
│   └── OmikujiData.ts    # おみくじの運勢データ定義
├── hooks/                 # ビジネスロジック (Custom Hooks)
│   └── useOmikujiLogic.ts # 抽選アルゴリズムの分離
├── utils/                 # 汎用ユーティリティ
│   └── SoundManager.ts   # 音声再生管理 (Singleton Pattern)
├── assets/               # アセット
│   ├── images/           # 画像リソース
│   └── sounds/           # 音声ファイル
├── docker/               # Docker関連設定 (もしあれば)
└── ...config files       # 各種設定ファイル
```

## 🧪 テスト戦略

**Jest** と **React Native Testing Library** を使用して、ロジックと UI の両面から品質を保証しています。

- **Unit Test**: `useOmikujiLogic` などのフック単体テスト
- **Component Test**: `FortuneDisplay` などの UI テスト

```bash
# 全テスト実行
npm test

# ウォッチモード
npm test -- --watch
```

## 📦 ビルドとデプロイ (EAS)

Expo Application Services (EAS) を使用したクラウドビルドフローを採用しています。

### Build Profiles (`eas.json`)

- **development**: 開発用クライアント（デバッガー接続可）
- **preview**: 内部テスト用（APK/IPA）
- **production**: ストア公開用（AAB/IPA）

```bash
# ビルドコマンド例
eas build --profile development --platform android
```

## 🌐 Web ビルド & デプロイ (Vercel)

Web 版は Vercel へのデプロイをサポートしています。

### 設定の構成

- **Build Command**: `npm run build` (または `npx expo export -p web`)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### ローカルでのビルド確認

```bash
npm run build
```

生成された `dist` ディレクトリの内容を静的ホスティングとしてデプロイ可能です。`vercel.json` により、SPA（Single Page Application）としてのルーティングが適切に処理されます。

## 🎨 デザイン & スタイリングガイド

**NativeWind (Tailwind CSS)** を全面的に採用しています。

- 原則として `className` プロパティを使用する。
- 複雑なアニメーションには `Moti` (`<MotiView />`) を使用する。
- カラーパレットは `tailwind.config.js` で管理する（必要であれば拡張）。

### 色のカスタマイズ

おみくじの結果に応じた色は `constants/OmikujiData.ts` で定義されています。

```typescript
export const FORTUNES = [
  {
    result: "大吉",
    color: "#ef4444", // red-500
    weight: 5,
  },
  // ...
];
```

## 🔊 サウンド実装ガイド

`SoundManager` クラス (`utils/SoundManager.ts`) が実装されています。
現在は基盤のみの実装ですが、以下の手順で効果音を追加可能です。

1. **ファイル追加**: `assets/sounds/` に音声ファイルを配置。
2. **ロード処理**: `app/_layout.tsx` または `index.tsx` で初期化時にロード。
3. **再生**: 任意のタイミングで `soundManager.playSound('key')` を呼び出す。

```typescript
// 実装例
await soundManager.loadSound("shake", require("../assets/sounds/shake.mp3"));
soundManager.playSound("shake");
```

## 🔍 トラブルシューティング

**Q: "Network response timed out" で接続できない (WSL2)**

- **A**: `npx expo start --tunnel` を使用するか、Windows のファイアウォール設定を確認してください。Docker 使用時は `docker compose exec app ...` 経由で行うのが確実です。

**Q: 実機でシェイクが反応しない**

- **A**: `expo-sensors` の権限許可を確認してください。また、開発中は画面右下の「🐞 デバッグモード」ボタンで動作確認が可能です。

## 🤝 開発フロー

1. **Issue 作成**: タスクやバグを定義
2. **Branch 作成**: `feat/` `fix/` プレフィックスを使用
3. **Coding**: `Prettier` / `ESLint` に従う
4. **PR & Review**: コードレビューを経てマージ

---

_Happy Coding!_ 🚀
