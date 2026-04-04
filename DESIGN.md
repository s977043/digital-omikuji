# Design Overview

`DESIGN.md` は Digital Omikuji の UI 世界観と読む順番を案内する入口ドキュメントです。  
見た目の詳細契約は `docs/design-system/` 配下の token JSON と関連 docs を正本として扱います。

## 読む順番

以下は design docs 内での推奨読解順です。リポジトリ全体でどこから入るかは `docs/design-md-adoption.md` を参照してください。

1. `docs/design-system/design-tokens.md`
2. `docs/design-system/component-architecture.md`
3. `docs/design-system/ui-pattern-grammar.md`
4. `docs/design-system/component-map.json`
5. `docs/design-system/operation-guide.md`
6. `docs/design/design_guidelines.md` (ムードと参考表現の補助資料)

## 世界観

- 新春のおみくじを「儀式として引く」体験を守る
- 神聖さ、没入感、遊び心を保つ
- 体験画面は暗い神社空間、文書画面は可読性重視の明るい紙面で分ける

## 高レベル原則

- UI は `tokens -> primitives -> components -> patterns -> templates` の 5 層で管理する
- variant は色名ではなく意味で分ける
- raw HEX や場当たり的な className 追加より token 追加を優先する
- 外部語彙はそのまま実装名にせず、`ui-pattern-grammar.md` の内部語彙へ正規化する

## 体験画面の不変条件

- フローは `待機 -> シェイク/タップ -> 抽選演出 -> reveal -> 結果`
- reduced motion、haptics、sound の配慮を維持する
- 主役を 1 つに絞り、補助導線は一段引く

## 文書画面の不変条件

- 可読性を最優先する
- 体験画面の演出 surface を持ち込まない
- 文書系 semantic token を使って構成する
