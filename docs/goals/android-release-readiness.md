# Goal: Android版デジタルおみくじ Google Play 申請可能化

> ステータス: active / 最終更新: 2026-06-06
> 関連: [release_metadata.md](../project/release_metadata.md) / [privacy-policy.md](../project/privacy-policy.md) / `eas.json` / `app.json` / `app.config.ts`

## Goal

Android版デジタルおみくじを **Google Play に申請可能な状態** にする。アプリ本体の開発はほぼ完了しており、本マイルストーンの主目的は新機能追加ではなく **Android公開準備**。

## 運用体制

- **メイン実装**: Claude Code（要件整理・実装・テスト・docs更新・Androidビルド準備）
- **サブレビュー**: Codex（着手前の計画レビュー、PR前の差分レビュー）
- フロー: Issue → 計画(Claude) → 計画レビュー(Codex) → 実装(Claude) → テスト(Claude) → 差分レビュー(Codex) → 修正(Claude) → PR → preview build → production AAB

## Definition of Done

### 設定・ビルド

- [x] Expo設定が整理されている（app.config.ts / app.json の不整合解消、2026-06-06）
- [x] Android package名が確定（`com.s977043.digitalomikuji`）し、全設定で一致（2026-06-06）
- [ ] production AAB が生成できる
- [x] EAS Build / Submit 設定が確認されている（`eas.json`：production=AAB/autoIncrement、submit track=internal、2026-06-07）

### Google Play 申請情報

- [x] Google Play Console 申請に必要な情報が docs 化されている（[../project/google-play-submission.md](../project/google-play-submission.md)、2026-06-07）
- [x] Privacy Policy / Data safety / Content rating の方針が整理されている（Sentry 有効前提の Data safety 申告、全年齢レーティング方針、2026-06-07）
- [x] ストア掲載文・スクリーンショット・Feature Graphic の準備項目が整理されている（画像アセットは未作成だが要件・推奨カットを docs 化、2026-06-07）
- [x] Closed testing の進め方が整理されている（internal→closed(個人=12人×14日 / 組織=免除)→production、2026-06-07）
- [x] README に Android 公開準備手順が反映されている（2026-06-06）

### 品質ゲート（すべて成功）

- [x] `pnpm exec tsc --noEmit` — 通過（2026-06-06 実測）
- [x] `pnpm lint` — 通過（2026-06-06 実測）
- [x] `pnpm test` — 通過（45スイート / 312テスト、2026-06-06 実測）
- [x] `npx expo-doctor` — **18/18 passed / No issues detected**（2026-06-06。#1〜#3修正 + #4は `expo.install.exclude` で先行構成を明示）
- [ ] `npx eas build --profile production --platform android` — 未実行（EAS認証要）

## Out of Scope

- iOS公開 / 課金 / 広告 / 大規模な新機能追加 / AI鑑定文生成 / Web版の大幅改修

## 現状と次アクション（2026-06-06 調査）

### 確定事項

- production package名: **`com.s977043.digitalomikuji`**（ユーザー決定）

### ブロッカー1: app.config.ts と app.json の不整合 ✅ 解消済み（2026-06-06）

**解消方針を実装済み**: `app.config.ts` を variant 上書き専用に縮小し、静的設定（プラグイン・splash・権限・updates 等）は `app.json` を SSOT として継承する形に統合。`npx expo config` で検証した実効値:

- production: `com.s977043.digitalomikuji` / 「デジタルおみくじ」
- preview: `com.s977043.digitalomikuji.preview` / 「おみくじ (Preview)」
- development: `com.s977043.digitalomikuji.dev` / 「おみくじ (Dev)」
- plugins に Sentry / expo-splash-screen / withWorklets / expo-localization を保持、iOS 写真権限 infoPlist も復活。
- 検証: `tsc --noEmit` ✅ / `lint` ✅ / `test` 312件 ✅。

<details><summary>修正前の不整合（参考）</summary>

`app.config.ts` が存在するため Expo はこれを優先し、`app.json` を上書きしていた。結果、実効設定が `app.json`（新しい・本来の意図）と乖離していた。

| 項目                  | app.json（本来の意図・新しい）          | app.config.ts（現状の実効値・古い） |
| --------------------- | --------------------------------------- | ----------------------------------- |
| Android package(本番) | `com.s977043.digitalomikuji`            | `jp.co.digitalomikuji` ← 要修正     |
| プラグイン            | expo-router, Sentry, expo-splash-screen | Sentry・splash-screen が脱落        |
| iOS写真権限 infoPlist | あり                                    | 脱落                                |
| アプリ名(本番)        | デジタルおみくじ                        | 2026 おみくじ                       |

**方針: `app.config.ts` を Expo設定のSSOTに**

- `app.config.ts` を Expo設定の単一情報源とし、variant（dev/preview/production）の name と package を一元管理する。
- `app.json` 側の Sentry / expo-splash-screen / withWorklets / expo-localization プラグイン、写真権限 infoPlist、updates / runtimeVersion / eas projectId を `app.config.ts` に取り込み、乖離を解消する。
- 本番 package = `com.s977043.digitalomikuji` / preview = `.preview` / dev = `.dev`。
- 本番アプリ名は `release_metadata.md` と一致させ **「デジタルおみくじ」** に統一する。

</details>

### ブロッカー2: expo-doctor（14/18 → **17/18**、残1）

当初の失敗4チェックのうち #1〜#3 を修正済み（2026-06-06）。残るは #4 のみ。

#### #1 ローカルに legacy global CLI ✅ 修正済み

- `eas-cli` を project dependencies から削除（`npx eas` で利用するためプロジェクト依存は不要）。

#### #2 直接インストールすべきでないパッケージ ✅ 修正済み

- `expo-modules-autolinking` を直接依存から削除（他のExpoパッケージが自動導入）。

#### #3 必須 peer 依存の欠落 ✅ 修正済み（本番クラッシュ要因の解消）

- `expo-linking`（`expo-router` の必須 peer）が未インストールだった。Expo Go 外（=本番Androidビルド）でクラッシュし得るため、`npx expo install expo-linking`（`~8.0.12`）で追加。
- 検証: `tsc` ✅ / `lint` ✅ / `test` 312件 ✅。

#### #4 Expo SDK 54 想定とのバージョン不一致 ✅ 解決済み（最終的に (c) SDK56 へ移行、#443・2026-06-08）

**最終対応**: 当初は方針 (b)（SDK54 上で RN0.85 を `package.json` の `expo.install.exclude` で運用）を採用したが、EAS 本番ビルドで RN0.85 の codegen 非互換が顕在化したため、**最終的に Expo SDK56（RN 0.85 を正式サポート）へアップグレード**（#443）して根本解決した。`expo.install.exclude`（20パッケージ）は不要になり削除済み、expo-doctor も整合し production AAB の生成に成功している。

> 当初方針 (b) の記録は以下の `<details>` に経緯参照用として残す。

<details><summary>当初の不一致（参考）</summary>

SDK54 想定に対し 20 パッケージが先行（一部抜粋）。

| package                   | SDK54想定 | 実際    |
| ------------------------- | --------- | ------- |
| `jest-expo`               | ~54.0.17  | 55.0.17 |
| `eslint-config-expo`      | ~10.0.0   | 55.0.1  |
| `react-native`            | 0.81.5    | 0.85.3  |
| `react` / `react-dom`     | 19.1.0    | 19.2.6  |
| `react-native-reanimated` | ~4.1.1    | 4.4.0   |

選択肢（要決定）:

- (a) SDK54基準へ揃える（ダウングレード）= 安定だが影響大
- (b) 現状の先行構成を維持し `package.json` の `expo.install.exclude` で doctor を抑制 = 低リスクだが、RN等コア依存の先行は EAS ビルド非互換リスクを内包するため**ユーザーが明示的に受容する必要がある**
- (c) Expo SDK 55 へ正式アップグレード = 整合するが範囲大

</details>

> 補足: `pnpm test` は初回 `node_modules` が古く失敗したが、`pnpm install --frozen-lockfile` 同期後に全通過。CI は `--frozen-lockfile` 実行のため影響なし。ローカル検証前は同期が必要。

### ブロッカー3: production ビルド未検証（要EAS認証）

Goal 最終ゲート（production AAB 生成）。EAS 認証が必須で、ローカルエージェント環境からは認証不可のため実行できない。次のいずれかで実行する。

- **A. ローカル端末**: `npx eas-cli login` → `npx eas-cli build --profile production --platform android`（`eas-cli` はプロジェクト依存から外したため `npx eas-cli` かグローバル導入を使う）。
- **B. CI（推奨・押すだけ運用）**: GitHub の Secrets に `EXPO_TOKEN`（expo.dev のアクセストークン）を登録し、ワークフロー `.github/workflows/eas-build-android.yml` を `workflow_dispatch` で実行（profile=production）。
  - 実行: GitHub → Actions → "EAS Build (Android)" → Run workflow → profile=production。
  - 成功すれば本ゲートが充足する。

## チェックリスト: Google Play 公開準備

### App identity

- [ ] アプリ名確定（デジタルおみくじ）
- [ ] package名 `com.s977043.digitalomikuji`
- [ ] アイコン / アダプティブアイコン / スプラッシュ確定

### ストア掲載（[release_metadata.md](../project/release_metadata.md) 参照）

- [ ] タイトル / 短い説明 / 詳細説明
- [ ] スクリーンショット / Feature Graphic
- [ ] Privacy Policy URL（`https://digital-omikuji.vercel.app/privacy-policy`）
- [ ] Data safety（個人情報非収集の申告）
- [ ] Content rating / 対象ユーザー・年齢層

### テスト・公開段階

- [ ] 内部テスト（internal track）
- [ ] Closed testing
- [ ] Production access
