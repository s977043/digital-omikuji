# UI Review Findings & Accessibility Improvements

## 概要

`ui-review` スキルを活用した初回UI監査の結果と対応内容の記録。

## 監査結果 (2026-01-21)

### 🔴 Critical: アクセシビリティ (修正済み)

- **画像ラベル欠落**: `DrawingOverlay.tsx` (筒/棒), `HistoryList.tsx` (空履歴)
  - 対応: `accessibilityLabel` を追加し、読み上げに対応。
- **装飾エモジの読み上げ**: `ResultScrollCard.tsx` (🌸, 🌿)
  - 対応: `accessibilityElementsHidden={true}` を追加し、スクリーンリーダーが装飾を無視するように修正。

### 🟠 Serious: ユーザー体験 (修正済み)

- **タッチターゲットサイズ**: `ResultScrollCard.tsx` (閉じるボタン)
  - 対応: `py-3` → `py-4` および `min-h-[48px]` を追加し、指で押しやすいサイズ(44px以上)を確保。

### 🟡 Moderate: コード品質 (一部修正)

- **スタイル指定の現代化**: `ResultScrollCard.tsx`
  - 対応: `vh` 単位の指定を可能な限り NativeWind クラス (`h-[85vh]`) に移行。

## 今後の課題

- **z-index 管理**: プロジェクト全体で `z-index` スケール（`z-10, 20, 30, 50`）を徹底する。
- **縦書きテキストの読み上げ**: 「御神籤」などの一文字ごとの縦書きがスクリーンリーダーで正しく読まれるか実機確認が必要。
