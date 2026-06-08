# Google Play 申請情報（デジタルおみくじ）

> ステータス: draft / 最終更新: 2026-06-07
> 関連: [release_metadata.md](./release_metadata.md)（ストア掲載文）/ [../goals/android-release-readiness.md](../goals/android-release-readiness.md)（ゴール・DoD）/ `eas.json` / `app.json`
> 本書は Google Play Console 申請時に入力する情報の SSOT。ストア掲載文（タイトル/説明/キーワード）は `release_metadata.md` を参照。

## 0. 申請前提（確定事項）

- アプリ名（本番）: デジタルおみくじ / Digital Omikuji
- package 名: `com.s977043.digitalomikuji`（**公開後変更不可**）
- カテゴリ: エンターテイメント（Entertainment）
- 課金 / 広告: なし
- Privacy Policy URL: `https://digital-omikuji.vercel.app/privacy-policy`
- AAB 生成: EAS（`eas build --profile production --platform android`、app-bundle）
- 提出 track（初期）: internal → closed testing → production

## 1. Data safety（データセーフティ）

> 本アプリは **本番で Sentry を有効化する**（`EXPO_PUBLIC_SENTRY_DSN` を本番に設定）方針。これに基づく申告。

### 収集・送信の実態

- **アプリ自体は個人情報を収集しない**: ログイン無し / 独自バックエンドへの送信無し。
- **おみくじ履歴・アプリ設定**: `AsyncStorage` で**端末内ローカル保存のみ**。外部送信なし → Data safety の「収集」非該当。
- **Sentry（エラートラッキング）**: クラッシュ/例外発生時に、診断データ（スタックトレース、OS/アプリバージョン、デバイス機種等）を Sentry に送信。
  - プライバシー保護実装: `sendDefaultPii: false`（IP/User-Agent/URL を送らない）、`beforeSend` で `user`/`request` を消去、console breadcrumb を抑制（履歴ID・運勢値の漏洩防止）。

### Data safety フォーム回答（推奨）

「アプリはユーザーデータを収集または共有しますか？」→ **はい**。収集するデータタイプは以下の3つ。

- **App activity > Crash logs**
  - 収集: はい / 共有: いいえ（後述）/ 目的: アプリの機能・分析（品質改善）
- **App info and performance > Diagnostics**
  - 収集: はい / 共有: いいえ（後述）/ 目的: アプリの機能・分析
- **Device or other IDs**
  - 収集: はい / 共有: いいえ（後述）/ 目的: アプリの機能・分析
  - Sentry SDK はクラッシュ影響ユーザー数を識別するためインストールID（デバイスID）を自動生成・送信するため、Google Play 基準では本カテゴリの収集に該当する。差し戻しリスク低減のため**最初から収集ありで申告**する。

補足事項:

- **「共有(sharing)」の扱い**: Google Play の定義では、サービスプロバイダ（処理委託先=processor）への転送は「共有」に該当しない。Sentry は処理委託先のため「収集: はい / 共有: いいえ」で申告する（自社管理下でのエラー解析に限定、第三者への販売・独立利用なし）。
- **転送時の暗号化**: はい（HTTPS）。
- **データ削除のリクエスト手段**: Privacy Policy に問い合わせ窓口を記載し、Sentry 側のデータ保持期間（既定 約90日で自動失効）を明記する。
- **Device or other IDs の確定**: 上記のとおり Sentry はインストールID を送信するため収集ありで申告する。`sendDefaultPii: false` で IP/UA 等の PII は送らない。本番 DSN 設定後に Sentry ダッシュボードの実送信データで最終確認すること。

### ストア文との整合（要対応）

`release_metadata.md` の「個人情報は収集しません」は **PII を収集しない**意味では正しい（Sentry も PII 排除）。ただし誤解回避のため、以下の補足を推奨。

> 個人を特定する情報は収集しません。アプリの品質向上のため、匿名のクラッシュ/診断データを利用する場合があります（個人の特定はできません）。

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
- **target API level**: Google Play は新規アプリに targetSdkVersion 35（Android 15）以上を要求（2025年要件）。Expo SDK56（RN 0.85）は targetSdk 35 以上 → 充足。AAB アップロード時に警告が無いことを確認。
- **versionCode / versionName**: `eas.json` の production は `autoIncrement: true`（versionCode 自動採番）、`appVersionSource: "remote"`（EAS 側で管理）。versionName は `app.json` の `version`。

## 6. Closed testing の進め方

> Google Play の Closed testing 要件はアカウント種別で異なる（2026 時点）。
>
> - **個人アカウント**（2023-11-13 以降作成）: **Production 申請前に Closed testing が必須**。テスター **12人以上**（2024-12-11 に 20→12 へ緩和）が **14日間連続**でオプトイン・**定期利用**する必要がある。条件未達では Production access に進めない。
> - **組織アカウント**（法人登記 + DUNS 番号で認証）: 本要件は**免除**（テスト不要で Production 申請可）。
> - **2026 の厳格化**: 単なるオプトインでは不十分で、各テスターが 14 日間「定期的にアプリを開く」必要がある（User Engagement Time を測定し、不活性テスターは除外）。

1. **Internal testing**: AAB を internal track にアップロード（`eas.json` の submit.production.android.track = `internal`）。自分・少人数で動作確認。
2. **Closed testing**（個人アカウントのみ必須／組織は免除）: テスター（**12人以上**）を招待し、**14日間連続**でオプトイン・**定期利用**してもらう。フィードバック収集。
3. **Production access 申請**: 上記を満たすと production 申請が可能になる。
4. 申請内容: Data safety / Content rating / ストア掲載 / 対象国・年齢 を入力し審査提出。

## 7. production AAB ビルド（最終ゲート / ユーザー作業）

EAS 認証が必要なため、以下のいずれかで実行（詳細は goal doc 参照）。

- **推奨**: GitHub Secrets に `EXPO_TOKEN` を登録 → Actions の「EAS Build (Android)」を `workflow_dispatch`（profile=production）で実行。
- 本番で Sentry を有効化するため、ビルド環境に `EXPO_PUBLIC_SENTRY_DSN`（本番 DSN）を設定すること。

## 8. 申請前 最終チェックリスト

- [ ] `EXPO_PUBLIC_SENTRY_DSN`（本番）をビルド環境に設定
- [ ] production AAB を生成（EAS）
- [ ] Data safety フォーム入力（本書 §1 に従う）
- [ ] Content rating 質問票（本書 §2 に従う）
- [ ] スクリーンショット2枚以上 + Feature Graphic を作成・アップロード
- [ ] アプリアイコン 512×512 をアップロード
- [ ] Privacy Policy URL を設定
- [ ] internal → closed testing（個人=12人×14日連続・定期利用 / 組織=免除）→ production access
- [ ] ストア文に Sentry 診断データの注記を反映（本書 §1）
