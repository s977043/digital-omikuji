# Design Tokens Specification

`docs/design-system/tokens/*.json` を Digital Omikuji UI の唯一の設計 SSOT とし、React Native / NativeWind 実装はその投影先として扱います。

## レイヤ構造

1. `primitive.json`
   色、寸法、角丸、タイポグラフィ、モーション、影などの生値を定義する
2. `semantic.json`
   体験画面 / 文書画面 / フィードバック / 運勢色の意味論トークンを定義する
3. `component.json`
   Button、Surface、Overlay、Header、Result、History、Document の component-level token を定義する

## 命名規則

- token path は `category.segment.state` ベースで管理する
- variant は色名ではなく意味で分ける
- alias は `{primitive.*}` / `{semantic.*}` / `{component.*}` で参照する
- 運勢色は UI 共通アクセントではなく `semantic.fortune.level.*` として管理する

## 実装ルール

- 新しい見た目値は raw HEX を直接追加せず、まず token を追加または再利用する
- 画面での直接スタイル定義はレイアウト上必要な最小限に留める
- className はレイアウト、inline style は token 解決後の色や寸法に使う

## 更新手順

1. `docs/design-system/tokens/*.json` を更新する
2. `docs/design-system/component-map.json` と関連 docs を追従させる
3. 実装側の DS アダプタと UI を追従させる
4. `pnpm exec tsc --noEmit`
5. `pnpm lint`
6. `pnpm test`
