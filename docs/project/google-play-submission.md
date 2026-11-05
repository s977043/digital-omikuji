# Google Play 申請情報（デジタルおみくじ）

> ステータス: draft / 最終更新: 2026-11-05
> 関連: [release_metadata.md](./release_metadata.md)（ストア掲載文）/ [../goals/android-release-readiness.md](../goals/android-release-readiness.md)（ゴール・DoD）/ `eas.json` / `app.json`
> 本書は Google Play Console 申請時に入力する情報の SSOT。ストア掲載文（タイトル/説明/キーワード）は `release_metadata.md` を参照。

## 0. 申請前提（構成と提出計画）

- アプリ名（本番）: デジタルおみくじ / Digital Omikuji
- package 名: `com.s977043.digitalomikuji`（**公開後変更不可**）
- カテゴリ: エンターテイメント（Entertainment）
- 課金 / 広告: なし
- Privacy Policy URL: `https://digital-omikuji.vercel.app/privacy-policy`
- AAB 生成: EAS（`eas build --profile production --platform android`、app-bundle）
- 提出 track（初期）: internal → closed testing → production

## 1. Data safety（データセーフティ）

**未確定・申告送信不可**。本番Sentry方針と実ビルド設定は未確認。以前の「有効化する」「収集あり/共有なし」の断定は採用しない。

### コードで確認できたこと

- `utils/sentry.ts` は `EXPO_PUBLIC_SENTRY_DSN` が空なら初期化を終了し、設定されていれば診断・tracing（productionのsample rate 0.2）を初期化する。
- `sendDefaultPii: false`、error eventのuser/request削除、console breadcrumb除外がある。ただし、全payload・transaction・サーバー側処理で個人情報が無いことの証明ではない。
- 履歴・設定の保存先はAsyncStorage。SDKを含むアプリ全体の外部送信有無は、保存先だけでは判断しない。
- `app/privacy-policy.tsx` / `privacy-policy.md` の分析情報非収集・外部送信の説明と、条件付き送信の実装に不一致がある。

### 提出前に確定すること

1. 運営者が本番でSentryを使うか決め、実ビルド設定と一致させる（秘密値を文書やPRへ記録しない）。
2. 有効ならSDKの実送信項目・識別子・目的・保持期間・削除窓口・委託条件を確認。無効でも他のSDK/経路を含む送信状況を確認する。
3. [GoogleのData safety定義](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en)に沿って収集/共有を判断し、運営者がフォーム回答を確定する。匿名性や保持90日、共有免除を推測しない。
4. アプリ内/公開Privacy Policy・ストア文・Data safetyを同じ確認済みデータ台帳に揃える。現行の「個人情報は収集しません」はそのまま提出しない。

## 2. Content rating（コンテンツレーティング / IARC 質問票）

IARC 質問票への回答方針:

- 暴力: なし
- 性的表現: なし
- 不適切な言葉: なし
- 規制対象物（酒/薬物等）: なし
- **ギャンブル / 賭博: なし** — **重要**: おみくじは娯楽。賭け金・報酬・課金ガチャ無し。simulated gambling にも非該当。
- ユーザー間交流: なし（SNS機能・チャット無し）
- 位置情報の共有: なし

想定レーティング: **全年齢**（IARC 3+ / ESRB Everyone / PEGI 3）。

注意: 「おみくじ＝占い/fortune」を *simulated gambling* と誤認されないよう、申請時の説明で**賭博・実課金要素が無いこと**を明確にする。

## 3. ストア掲載アセット

### テキスト（[release_metadata.md](./release_metadata.md) を参照・整備済み）

- アプリ名 / 短い説明（80字以内）/ 詳細説明（4000字以内）/ キーワード — 日英あり。

### 画像（**未準備・要作成**）

- アプリアイコン: 512×512 PNG（32bit, アルファ可）— `assets/icon.png` から書き出し。
- Feature Graphic: 1024×500 PNG/JPG — **未作成**。
- スマホ スクリーンショット: 2〜8枚、JPEG/24bit PNG、各辺 320〜3840px、縦推奨 — **未撮影**。
- タブレット（7インチ/10インチ）: 任意。
- スクリーンショット推奨カット: ①ホーム（振る前）②振る演出 ③結果表示 ④履歴画面（4枚程度で機能を網羅）。

## 4. アイコン / スプラッシュ（設定は確定済み）

- `app.json`: `icon: ./assets/icon.png` / `splash`（背景 `#dc2626`）/ `android.adaptiveIcon`（foreground `./assets/adaptive-icon.png`、背景 `#dc2626`）。
- アセット存在: `icon.png` / `adaptive-icon.png` / `splash.png` / `favicon.png`。
- **要対応（アダプティブアイコン）**: `adaptive-icon.png` は **背景を完全に透過（アルファチャンネルあり）** にし、ロゴ等の主要要素のみを中央 66% のセーフゾーンに収めた画像として `icon.png` とは**別に書き出す**こと。foreground に背景色が含まれると、ランチャー形状（丸/角丸）のマスク処理で背景が二重表示・端が不自然にカットされる。現状は両者が同一バイトサイズのため要差し替え。

## 5. 署名 / target API level

- **署名**: Google Play App Signing を利用（推奨）。EAS が upload key を管理し、`eas build` が署名済み AAB を生成。Play Console 側で App Signing を有効化。
- **target API level**: 2026-11-05確認の[公式要件](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en)では、2026-08-31以降の通常Androidアプリの新規・更新は **Android 16 / API 36以上**。SDKの版だけで充足としない。提出する実AABのmanifestのtargetSdkVersionを確認し、結果・artifact・対象SHAを記録する。**実AABは未検査**。
- **versionCode / versionName**: `eas.json` の production は `autoIncrement: true`（versionCode 自動採番）、`appVersionSource: "remote"`（EAS 側で管理）。versionName は `app.config.ts` が参照する `app.json` の `version`。Playの使用済み番号とEAS remote値は未確認のため、次の番号を推測して変更しない。

## 6. Closed testing の進め方

2026-11-05に[公式の個人アカウント要件](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)を確認。2023-11-13より後に作成した個人アカウントは、12人以上が少なくとも14日連続でオプトインしたclosed testを実施し、production accessを申請する。テスト内容・参加状況・フィードバック等も申請時に説明する。人数/日数達成だけで承認済みとはしない。

アカウント種別・作成日・production accessの状態は未確認。組織だからすべてのテスト不要とは扱わず、該当アカウントのConsoleに表示される要件を確認する。「2026年から毎日起動時間を測定し除外する」という旧記載は、今回の公式資料で根拠を確認できず削除した。

提出計画はinternalで実機確認→必要なclosed testing→production access/審査。テスター募集、アップロード、申請送信は未実行。

## 7. production AAB ビルド（最終ゲート / ユーザー作業）

EAS 認証が必要なため、以下のいずれかで実行（詳細は goal doc 参照）。

- **推奨**: GitHub Secrets に `EXPO_TOKEN` を登録 → Actions の「EAS Build (Android)」を `workflow_dispatch`（profile=production）で実行。
- Sentry方針を先に確定し、ビルド設定とプライバシー説明を一致させる。有効化を既定にしてDSNを設定しない。

## 8. 申請前 最終チェックリスト

- [ ] Sentry方針・実ビルド設定・実送信の確認を完了
- [ ] production AAB を生成（EAS）
- [ ] Data safety フォーム入力（本書 §1 に従う）
- [ ] Content rating 質問票（本書 §2 に従う）
- [ ] スクリーンショット2枚以上 + Feature Graphic を作成・アップロード
- [ ] アプリアイコン 512×512 をアップロード
- [ ] Privacy Policy URL を設定
- [ ] アカウント条件に応じinternal → closed testing → production access
- [ ] 確認済みのデータ取扱いをストア文・Privacy Policyへ反映（本書 §1）

## 9. リリース再開時点のゲート（2026-11-05）

確認基準: develop `0b6fe62a91f4683224521a635b0c9289708accea`、main `3b69cb1e2541fa48ef7311f45d04a69efdb8329c`。#470はdevelopへマージ済み。確認時点のopen PRはDependabotのみでrelease PRなし。

| ゲート | 現状 / 必要な証拠 |
| --- | --- |
| 掲載文 | 英語短い説明の旧92文字を80文字以内へ修正。掲載は未実行。[文字数の公式上限](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en)を参照。 |
| 実AAB | 未取得。承認されたビルドのSHA・署名済みartifact・package・target API・versionName/versionCodeを確認。JS export成功は署名済みnative build成功ではない。 |
| native互換性 | Gradle/実機未検証。起動・抽選・保存/再訪・日英共有・センサー・音/触覚・TalkBackを対象端末で確認。[16KB page size対応](https://developer.android.com/guide/practices/page-sizes)も実artifactと対応環境で検証する。 |
| 申告 | Sentry方針、実送信、公開policy整合、Consoleアカウント条件、レーティング・対象年齢/国・削除窓口等を運営者と確認。文書案を申告済みと扱わない。 |
| 署名/番号/費用 | Playの使用済みversionCode・EAS remote値・既存署名の管理状態・ビルド費用枠は未確認。番号変更・鍵生成/変更・新規課金は未実行。 |
| Web本番 | `deploy-vercel.yml` はmainへのpushでproduction、developはpreview。mainへの統合はSDK/設定等も含む差分全体の本番配信を起動するため、共有文だけの公開ではない。保護条件・本番設定・影響範囲を確認するまでmainへ統合しない。 |
| リリース手順 | `.agent/workflows/release.md` はdevelopからrelease branch→main PR、承認後Merge Commitを指定。例示バージョンを採用せず、実際の番号と保護ルールを確認して具体化する。タグ/Release/Play送信/配信は未実行。 |

今回の変更は文書のみ。観測者が旧API記載・92文字・Sentryの不一致・Web配信経路を独立確認し、改善者が確定可能な文書修正を行い、別のレビュアーが確認する。実ユーザー募集や実送信は行わない。

5観点の確認はPRに対象HEADと結果を記録する。要件はAPI/文字数/未決定の区別、境界は80文字制限と申告分岐、設計は実設定を変えない文書整理、回帰はMarkdown・リンク先/構成との照合、完了は最新HEAD/CIと残るゲートの確認。製品コード不変のためテストを回数合わせで再実行せず、既存E2E結果とnative未検証を明確に分ける。
