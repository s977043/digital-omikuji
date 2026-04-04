# UI Pattern Grammar

外部語彙を Digital Omikuji の内部語彙へ正規化するための語彙集です。

## 原則

1. 見た目の流行語ではなく、構造と責務で命名する
2. 既存部品で吸収できる場合は新規 component を増やしすぎない
3. variant は意味で分ける
4. 体験画面と文書画面の語彙を混ぜない

## 正規化ルール

| Requested phrase | Normalized pattern | Matched parts | Matched components | Gap |
| --- | --- | --- | --- | --- |
| Modal / Dialog | Scene Overlay | scrim / focus surface | Ritual Progress Overlay, Paper Result | confirm dialog は未標準化 |
| Card | Glass Surface / Paper Surface | surface / border / content | HistoryItemCard, PaperResultCard | 用途に応じて選ぶ |
| Loader / Spinner | Ritual Progress Overlay | overlay / progress cue / label | RitualProgressOverlay | 一般ローディング用 variant は未追加 |
| Policy Page / Article Page | Document Template | page header / section stack | DocumentScreenTemplate, DocumentSection | 記事メタは未導入 |
| Header | Page Header | title / leading action / trailing action | PageHeader | sticky header は未導入 |

## 内部語彙

- `Scene Overlay`
- `Ritual Progress Overlay`
- `Paper Result`
- `Glass History Item`
- `Page Header`
- `Document Section`
- `Experience Screen Template`
- `History Screen Template`
- `Document Screen Template`

## 運用メモ

- 体験画面では「神聖さ」「没入感」「儀式性」を優先し、説明過多を避ける
- 文書画面では可読性を優先し、演出トークンを持ち込まない
- 「カード」という語はそのまま使わず、`Glass Surface` か `Paper Surface` に分解して判断する
