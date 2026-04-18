# ドメイン層ガイド

純粋ロジック（抽選・運勢判定・共有文生成・履歴マイグレーション）を `domain/` に集約し、UI・プラットフォーム依存から切り離すための設計方針と運用ルールを定義する。

## なぜ分離するのか

- **テスタビリティ**: RNG・Clock・ID 生成などの非決定性を注入可能にし、境界値・再現性テストを容易にする
- **プラットフォーム非依存**: Web / React Native / 将来のサーバー移植を見据え、純粋ロジックを再利用可能な形で保つ
- **境界の明示**: UI 層のリファクタで純粋ロジックが巻き添えになるリスクを削減

## レイヤ境界

### 依存方向

```text
app / hooks / components
        │
        ▼
      utils ──► domain
                  │
                  ▼
               data / types
```

- `domain` は以下への**実行時 import を禁止**する:
  - `react`
  - `react-native` / `@react-native-*`
  - `expo-*`
  - `@sentry/*`
  - `@react-native-async-storage/*`
- `import type` は compile 時のみに残るため許容
- この制約は `eslint.config.js` の `no-restricted-imports` ルールで強制されている
- `utils/` は AsyncStorage・サウンド・触覚など副作用を伴う境界を担当し、domain の関数を利用してよいが、逆方向の依存は禁止

### 不変条件

`domain/index.ts` の先頭コメントに記載されている 3 つの不変条件:

1. `react` ・ `react-native` ・ `expo` ・ `@react-native` 系への実行時依存なし
2. AsyncStorage・Sentry・Audio などの副作用を持つ API を直接呼ばない
3. 時刻・乱数・ID 生成など非決定性は引数で注入する

## 公開 API 一覧

`domain/index.ts` から export されているもののみが公開 API。それ以外は層の内部実装。

|関数 / 型|概要|実装ファイル|
|---|---|---|
|`drawOmikuji(options?)`|加重ロットで運勢を抽選。RNG・Clock・ID 生成・weights を注入可能|`domain/drawOmikuji.ts`|
|`DrawOmikujiOptions`|`drawOmikuji` の注入用オプション型|`domain/drawOmikuji.ts`|
|`getTodayString(now?)`|ローカル日付を `YYYY-MM-DD` 形式で返す。`now` を渡せば任意日時を再現可能|`domain/fortuneRules.ts`|
|`canDrawToday(lastDrawDate, today?)`|1 日 1 回制限の判定。`today` を注入すると純粋関数になる|`domain/fortuneRules.ts`|
|`migrateLegacyEntry(raw)`|旧形式の履歴エントリを型ガード検証しつつ現行形式へ変換（失敗時 `null`）|`domain/historyMigration.ts`|
|`getFortuneText(t, level, messageIndex)`|i18n 経由の運勢タイトル・メッセージを取得。`TFunction` を引数で注入|`domain/getFortuneText.ts`|
|`buildShareText({title, description})`|X 共有用テキストを組み立てる|`domain/buildShareText.ts`|

## 注入の原則

非決定性の注入ポイントと、production / test での使い分け:

|注入点|デフォルト|テストでの差し替え例|
|---|---|---|
|`drawOmikuji({ rng })`|`Math.random`|決定的な擬似乱数列を返す関数|
|`drawOmikuji({ clockNow })`|`Date.now`|固定値を返す関数|
|`drawOmikuji({ idGenerator })`|`crypto.randomUUID`（不在時は `rng` / `clockNow` でフォールバック）|固定 ID を返す関数|
|`drawOmikuji({ weights })`|`ACQUIRED_FORTUNES`（`data/omikujiData`）|特定レベルのみのテストデータ|
|`canDrawToday(lastDate, today)`|`today` 省略時は `getTodayString()`|任意の日付文字列|

**production path では可能な限り明示注入する**。例: `hooks/useOmikujiLogic.ts` は `canDrawToday(lastDate, getTodayString())` と呼び、default 解決を暗黙に使わない。

## エラーハンドリング方針

- `drawOmikuji`: `weights` が空配列の場合は `Error` を throw（fail-fast）。それ以外は常に有効な `OmikujiResult` を返す
- `migrateLegacyEntry`: 壊れた / 未知形式のペイロードは例外を投げず `null` を返す。呼び出し側でフィルタする想定
- `getFortuneText`: `messages` が空配列でも空文字を返し、`string` 型を保証する
- `getTodayString` / `canDrawToday` / `buildShareText`: 副作用なし・throw なし

## テスト戦略

- `domain/__tests__/` にユニットテストを配置（`jest.config.js` の `collectCoverageFrom` 対象）
- AsyncStorage や React のレンダリングをモックせずに、純粋関数として境界値・決定性・エラーハンドリングを検証する
- `drawOmikuji` は RNG を seed して再現性テスト、`canDrawToday` は `today` を直接渡して「昨日」「今日」「null」を網羅

## 拡張手順

### 新しい運勢種別を追加する場合

1. `data/omikujiData.ts` の `ACQUIRED_FORTUNES` に追加（weight / image / color）
2. `types/omikuji.ts` の `FortuneLevel` に追加
3. `i18n/locales/{ja,en}.json` に `fortune.levels.*` / `fortune.messages.*` を追加
4. `domain/drawOmikuji.ts` の変更は不要（データ駆動）

### 新しい占い種別（タロットなど）を追加する場合

1. `domain/` に `drawTarot.ts` 等を新設し、`OmikujiResult` と同族の判別共用体として型を設計
2. `domain/index.ts` から公開
3. UI 層は注入オプション経由で lottery 関数を差し替えられる設計にする

### A/B 実験で重み付けを動的に変える場合

1. サーバーまたは feature flag から `weights` 配列を取得
2. `drawOmikuji({ weights: fetched })` と呼ぶ
3. domain 側の変更は不要

## 関連ドキュメント

- [`TIMEZONE_POLICY.md`](./TIMEZONE_POLICY.md) — `getTodayString` / `canDrawToday` のタイムゾーン規約
- [`SELF_REVIEW_CHECKLIST.md`](./SELF_REVIEW_CHECKLIST.md) — 境界破壊を防ぐセルフレビュー手順
- [`DEVELOPER.md`](./DEVELOPER.md) — プロジェクト全体のアーキテクチャ
