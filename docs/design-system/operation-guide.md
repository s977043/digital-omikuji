# Design System Operation Guide

Digital Omikuji の UI を破壊的変更込みで進化させるための runbook です。一次情報は `design-system/tokens/*.json` と `docs/design-system/component-map.json` です。

## 変更単位ごとの手順

### Token を追加・変更する

1. `design-system/tokens/primitive.json` / `semantic.json` / `component.json` を更新する
2. 実装側の DS アダプタと利用コンポーネントを更新する
3. `docs/design-system/design-tokens.md` と必要なら `component-map.json` を追従する
4. `pnpm exec tsc --noEmit`
5. `pnpm lint`
6. `pnpm test`

### Variant を追加・変更する

1. 実装 component の variant union を更新する
2. `docs/design-system/component-map.json` の `variants` を更新する
3. 体験画面 / 文書画面のどちらに属するかを確認する
4. 回帰テストを更新する

### Template を更新する

1. token と primitive を優先して使う
2. 画面固有の見た目定数を増やす前に token 化を検討する
3. 体験画面では儀式フローを維持する
4. 文書画面では可読性を優先する

## レビュー観点

- token が SSOT として保たれているか
- raw HEX や場当たり的な className 追加に逃げていないか
- 外部語彙を内部語彙へ正規化できているか
- 体験画面と文書画面の semantic token を混在させていないか
- reduced motion と主要 accessibility label が維持されているか

## 今回あえて含めないもの

- Figma / Penpot 同期
- verify スクリプト自動化
- codegen

これらは次フェーズで追加する。
