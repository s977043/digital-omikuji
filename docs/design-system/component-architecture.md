# Component Architecture

Digital Omikuji の UI は次の 5 層で管理します。

1. `Tokens`
   色、余白、タイポ、モーションなどの基礎変数
2. `Primitives`
   Button、Surface、Typography 相当の最小部品
3. `Components`
   PageHeader、HistoryItemCard、PaperResultCard、DocumentSection など
4. `Patterns`
   IdleRitualPattern、HistoryListPattern、DocumentArticlePattern、ResultPattern など
5. `Templates`
   ExperienceScreenTemplate、HistoryScreenTemplate、DocumentScreenTemplate

## 命名規則

- Category を明示するよりも、このリポジトリでは `役割 + UI名` を優先する
- variant は色名ではなく用途で分ける
- 画面固有 UI は pattern に留め、横断利用が見えたら component へ昇格する

## 初回の第一級 component

- `PageHeader`
- `Button`
- `SurfaceCard`
- `RitualProgressOverlay`
- `RevealStickStage`
- `PaperResultCard`
- `HistoryItemCard`
- `HistoryEmptyState`
- `DocumentSection`

## 初回の pattern

- `IdleRitualPattern`
- `ShakingPattern`
- `RevealPattern`
- `ResultPattern`
- `HistoryListPattern`
- `DocumentArticlePattern`

## 初回の template

- `ExperienceScreenTemplate`
- `HistoryScreenTemplate`
- `DocumentScreenTemplate`

## スロット方針

- `Text Slot`: タイトル、本文、補助文
- `Action Slot`: CTA、戻る、削除、ミュート
- `Status Slot`: ローディング、履歴空状態、抽選進行
- `Content Slot`: 紙面詳細、履歴アイテム、文書セクション
