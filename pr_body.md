# 概要

結果画面のフッター（シェアボタン等）が画面サイズによって見切れる問題を修正しました。
また、Vercelデプロイでビルドエラーとなっていた Sentry 初期化の重複宣言も併せて修正しています。

## 変更点

- **layout**: 結果カードの高さを `max-height` + `flex-shrink` に変更し、見切れを防止。
- **fix**: `app/_layout.tsx` での `initializeSentry` 重複呼び出しを削除。

## 確認方法

- `pnpm start` で起動し、結果画面でフッターが全て表示されていること。
- `pnpm build` が正常に通ること。
