# DESIGN.md 導入ガイド

## Why

`DESIGN.md` を導入した理由は、UI の判断材料がコード、既存デザインガイド、実装者の認識に分散していたためです。

- デザイン判断の一貫性を上げる
- AI エージェントと開発者が同じ前提で UI を実装できるようにする
- Figma や口頭説明がなくても、最低限の判断基準に辿り着けるようにする
- 将来の UI 改修時に、どの方針で変えるべきかを追跡しやすくする

## What

現在の [`DESIGN.md`](../DESIGN.md) は、詳細仕様そのものではなく、次の内容を案内する入口として使います。

- UI 世界観の要約
- 体験画面 / 文書画面の区別
- デザインシステム docs の読む順番
- 高レベル原則と不変条件

設計 SSOT は `docs/design-system/` 配下に移し、補助資料としてムードボードや参考画像は [`docs/design/design_guidelines.md`](./design/design_guidelines.md) を参照します。

## How to Use

推奨する読む順番:

1. `AGENTS.md`
2. `DESIGN.md`
3. `docs/design-system/`
4. 必要に応じて `docs/design/design_guidelines.md`

### 開発者向け

- UI を新規実装するときは、まず `DESIGN.md` で「体験画面」か「文書画面」かを判断する
- 詳細な token や component 契約は `docs/design-system/` を見る
- PR レビューでは、見た目の好みではなく token 契約と既存 UX への整合性で確認する

### AI エージェント向け

- UI タスクでは `AGENTS.md` とあわせて `DESIGN.md` を読む
- 新規画面の提案時は、まず `DESIGN.md` で方向性を合わせ、その後 `docs/design-system/` の契約に従う
- UI 名称は `docs/design-system/ui-pattern-grammar.md` の内部語彙に正規化する

## Maintenance

- 更新責任は、UI を変更する PR の作成者が一次責任を持ちます。
- token、variant、component 契約が変わるときは `docs/design-system/` を更新します。
- 世界観や読む順番、高レベル原則が変わるときだけ `DESIGN.md` を更新します。
