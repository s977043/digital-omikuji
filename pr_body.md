# 概要

モバイルビルドのRNWorklets不足、履歴/アクション状態の不整合、Jest・Web E2Eの失敗を中心に修正しました。
Web E2Eの導線・言語初期化も安定化しています。

## 変更点

- **build**: `react-native-worklets` のリンク設定を修正し、RNWorklets Pod 解決を安定化。
- **fix**: 履歴削除時のアクション状態クリア、おみくじ再抽選時の状態リセット。
- **test**: Jest/Historyのテスト更新、Web E2Eの「結ぶ→閉じる→結果を見る」導線を修正。
- **i18n**: `localStorage` の `i18nextLng` を優先して初期言語を決定。

## 確認方法

- `pnpm test`
- `pnpm test:e2e:web`
- iOS/AndroidのE2E（CI）
