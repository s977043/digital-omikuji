# 🛠 開発者向けドキュメント (DEVELOPER GUIDE)

## 🏗 アーキテクチャ概要

本プロジェクトは **Expo Router (File-based routing)** を採用し、モダンでスケーラブルな構成になっています。

### ディレクトリ構造詳細

```text
digital-omikuji/
├── app/                    # アプリケーションのエントリーポイント & ルーティング
│   ├── _layout.tsx        # アプリ全体のレイアウト・プロバイダー設定
│   └── index.tsx          # メイン画面 (おみくじ体験のコア)
├── components/            # プレゼンテーションコンポーネント
│   └── FortuneDisplay.tsx # 結果表示 UI (Motiによるアニメーション含む・画像シェア機能付き)
├── data/                  # アプリ設定・固定データ
│   └── omikujiData.ts    # おみくじの運勢データ定義
├── docs/
│   ├── design/            # ムード・参考表現の補助資料
│   └── design-system/     # token / component 契約と運用ガイド
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

````bash
# 全テスト実行
pnpm test

# ウォッチモード
pnpm test -- --watch
```text

## 📦 ビルドとデプロイ (EAS)

Expo Application Services (EAS) を使用したクラウドビルドフローを採用しています。

### Build Profiles (`eas.json`)

- **development**: 開発用クライアント（デバッガー接続可）
- **preview**: 内部テスト用（APK/IPA）
- **production**: ストア公開用（AAB/IPA）

```bash
# ビルドコマンド例
eas build --profile development --platform android
````

## 🌐 Web ビルド & デプロイ (Vercel)

Web 版は Vercel へのデプロイをサポートしています。

### 設定の構成

- **Build Command**: `pnpm build` (または `pnpm expo export -p web`)
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### ローカルでのビルド確認

````bash
pnpm build
```text

生成された `dist` ディレクトリの内容を静的ホスティングとしてデプロイ可能です。`vercel.json` により、SPA（Single Page Application）としてのルーティングが適切に処理されます。

## 🧪 ローカル動作確認（最小）

- テスト: `pnpm test`
- Webビルド: `pnpm build`（`dist/` が生成される）
- Web起動: `pnpm web`（`http://localhost:19006` などで起動）
- バージョン表示（任意）: コンソール出力と画面右下のバージョン表示を確認

## 🎨 デザイン & スタイリングガイド

**NativeWind (Tailwind CSS)** を全面的に採用しています。

- 原則として `className` プロパティを使用する。
- 複雑なアニメーションには `components/design-system/MotionView` を使用する（ネイティブでは `MotiView` を包む）。
- フォントの Tailwind 拡張は `tailwind.config.js`、見た目契約は `docs/design-system/` を優先して管理する。
- UI 実装の入口は `DESIGN.md`、token / component 契約は `docs/design-system/` を参照する。

### 色のカスタマイズ

おみくじの結果に応じた色は `data/omikujiData.ts` で定義されています。

```typescript
export const ACQUIRED_FORTUNES = [
  {
    level: "daikichi",
    weight: 5,
    image: require("../assets/omikuji_cylinder.webp"),
    color: "#FFD700",
  },
  {
    level: "kyo",
    weight: 10,
    image: require("../assets/omikuji_cylinder.webp"),
    color: "#808080",
  },
];
````

## 🔊 サウンド実装ガイド

### 現在の構成

効果音は `SoundManager` クラス (`utils/SoundManager.ts`) + `useSoundEffects` フック (`hooks/useSoundEffects.ts`) で管理されています。

**使用中の効果音:**

| キー     | ファイル                   | 再生タイミング |
| -------- | -------------------------- | -------------- |
| `shake`  | `assets/sounds/shake.wav`  | シェイク開始時 |
| `result` | `assets/sounds/result.wav` | 結果表示時     |

**ミュート制御:** ヘッダーの `MuteToggle` (`components/design-system/MuteToggle.tsx`) でユーザーが ON/OFF を切り替え可能。

### 新しい効果音の追加手順

1. **ファイル追加**: `assets/sounds/` に `.wav` ファイルを配置。
2. **フックに登録**: `hooks/useSoundEffects.ts` の `SOUNDS_TO_LOAD` 配列にエントリーを追加。
3. **再生**: `playSound('key')` を任意のタイミングで呼び出す。

```typescript
// hooks/useSoundEffects.ts に追加
const SOUNDS_TO_LOAD = [
  { key: "shake", loader: () => require("../assets/sounds/shake.wav") },
  { key: "result", loader: () => require("../assets/sounds/result.wav") },
  { key: "new_sound", loader: () => require("../assets/sounds/new_sound.wav") }, // 追加
];
```

## 📳 触覚フィードバック実装ガイド

### 現在の構成

触覚フィードバック（ハプティクス）は `triggerHaptic()` ユーティリティ (`utils/haptics.ts`) で統一管理されています。直接 `Haptics.impactAsync` / `Haptics.notificationAsync` を呼ぶのではなく、必ず `triggerHaptic()` 経由で使用してください。

**Platform 対応:**

- **iOS / Android**: `expo-haptics` のネイティブ実装を呼び出します。
- **Web**: 無条件でスキップされます（ハプティクス API が存在しないため）。
- **`reducedMotion`**: ユーザーがモーション軽減設定を有効にしている場合、通常のフィードバックはスキップされます。`force: true` を指定した場合のみ実行されます。

### 使用例

```typescript
import * as Haptics from "expo-haptics";
import { triggerHaptic } from "../utils/haptics";

// Impact feedback（衝撃）
triggerHaptic(
  { type: "impact", style: Haptics.ImpactFeedbackStyle.Medium },
  false, // force: reducedMotion 時はスキップ
  reducedMotion
);

// Notification feedback（通知）
triggerHaptic(
  { type: "notification", style: Haptics.NotificationFeedbackType.Success },
  false,
  reducedMotion
);

// 重要なフィードバックを reducedMotion でも強制実行
triggerHaptic(
  { type: "impact", style: Haptics.ImpactFeedbackStyle.Heavy },
  true, // force: true で reducedMotion を上書き
  reducedMotion
);
```

### `impact` vs `notification` の使い分け

| 種類           | 用途                             | 例                                     |
| -------------- | -------------------------------- | -------------------------------------- |
| `impact`       | ボタンタップ・動作開始・アニメ中 | シェイク中の連続フィードバック         |
| `notification` | 成功・警告・エラーの明確な通知   | おみくじ結果表示時の確定フィードバック |

### 新しいフィードバックの追加手順

1. **直接呼び出しは禁止**: `Haptics.*Async()` を直接呼ばず、必ず `triggerHaptic()` を使用する。
2. **reducedMotion の伝播**: `useReducedMotion()` フックで取得した値を引数に渡す。
3. **force の使用は限定的に**: アクセシビリティ設定を尊重するため、`force: true` は結果表示等の重要なイベントのみに使用する。

## 🔍 トラブルシューティング

### Q: "Network response timed out" で接続できない (WSL2)

- **A**: `npx expo start --tunnel` を使用するか、Windows のファイアウォール設定を確認してください。Docker 使用時は `docker compose exec app ...` 経由で行うのが確実です。

### Q: 実機でシェイクが反応しない

- **A**: `expo-sensors` の権限許可を確認してください。また、開発中は画面右下の「🐞 デバッグモード」ボタンで動作確認が可能です。

### ローカル検証で詰まる場合

- `pnpm test -- --clearCache`
- `pnpm exec expo cache clean` → `pnpm build`
- `lsof -i :19006` でプロセス確認 → `kill -9 <PID>`

## 🤝 開発フロー

1. **Issue 作成**: タスクやバグを定義
2. **Branch 作成**: `feat/` `fix/` プレフィックスを使用
3. **Coding**: `Prettier` / `ESLint` に従う
4. **PR & Review**: コードレビューを経てマージ

---

_Happy Coding!_ 🚀
