# Sentry初期導入の確認票

2026-11-05 / 基準develop `064e5d2`。ユーザーはSentry導入を希望。既存SDK7.11.0/core10.37.0とExpo plugin/Metro/RootLayout初期化を再利用し、依存更新・新規アカウント・トークン・DSN設定は行わない。

## 初期実装

DSNなしでは初期化しない。有効な配布版はエラー診断のみ。既存の性能サンプリング0.2を0にし、自動性能トレース・セッション追跡・画面添付・view hierarchy・ログ送信を明示的に無効化。Replay/Profilingを追加しない。

JSのbeforeSend/beforeSendTransactionでは直接のuser/requestを除去し、console breadcrumbを破棄する。これは任意の機微情報を完全に除去する仕組みではない。native crash・session等の全経路にJS hookが適用されるとは扱わない。

| 送信対象・候補 | コードの根拠 / 要確認 |
| --- | --- |
| エラー本文・スタック | errorReporter/useErrorHandler/RootLayout。例外本文に入力やURL、JSON断片が含まれる可能性が残る。 |
| 操作・診断context | appのsource/operation/category、音キー/stage、platform、additional context等。任意metadataが残るため実payload確認が必要。 |
| SDK端末情報・識別子 | SDKが付与するOS/device/release、native経路・通信情報・識別子の範囲を実ビルドで確認。匿名と断定しない。 |
| breadcrumb | console以外は維持。navigation/HTTP等にURLや情報が含まれ得るので実イベントとサーバー側scrubbingを確認。 |
| 履歴/設定/共有文 | データ自体を診断用に積極送信する機能は追加しない。ただし例外やcontextへの混入が無いとは保証しない。 |

根拠: [Sentry収集データ](https://docs.sentry.io/platforms/react-native/data-management/data-collected/)、[scrubbing](https://docs.sentry.io/platforms/react-native/data-management/sensitive-data/)、[options](https://docs.sentry.io/platforms/react-native/configuration/options/)。現行コードとの適合は導入済み型定義と型検査で確認。文書だけでnative送信範囲を保証しない。

## 実接続・申告前の手渡し

- [ ] 既存Sentry組織/プロジェクト・環境、プラン/無料枠、保持期間、担当者、非公開の問い合わせ/削除手段を運営者が確認。新規契約/課金が必要なら先に確認。
- [ ] DSNは承認されたEAS環境で管理。source map用auth tokenはbuild用秘密情報として分離し、EXPO_PUBLIC変数やチャット/PRへ貼らない。継続アクセス用トークンをこの作業では作成しない。
- [ ] 対象artifact/SHAと環境を特定し、実ユーザーデータを含まない診断イベントによる検証の送信先・内容を確認してから実施。今回は実送信なし。
- [ ] JS/nativeの例外、識別子、ネットワーク/端末情報、breadcrumb、context、添付と保持期間を確認し、必要なscrubbingを反映。端末内履歴削除とSentry側削除は別。
- [ ] 確認済みのデータ台帳からData safetyのデータ種別・目的・収集/共有・削除対応を運営者が確定。Crash logs/Diagnostics/Device or other IDs等は検討候補であり、自動的な回答ではない。
- [ ] アプリ内policy、公開policy、日英ストア文の最終確認。未確認の保持期間・匿名性・非収集を宣言しない。公開申告はこのPRで行わない。

## 役割と検証

主担当が実装、別担当がコード経路と不足を観測し、実装後にも独立レビューする（DATの役割分離として、同じファイルの並行編集はしない）。PlanGate/River Plugin実行機能は未提供、CLIで代用しない。

5観点: 要件=エラー診断導入と表示整合、境界=DSNなし/あり・除去hook・元event非変更、設計=既存SDKで送信を拡大しない、回帰=単体/型/Lint・DSNなしのWeb E2E、完了=最新HEAD/CI/レビューとnative・実送信未検証の分離。最終結果はPRに記録。

モックテストのDSNはダミーでSDK送信を実行しない。Web export/E2EはEXPO_PUBLIC_SENTRY_DSNを空にして行う。native crash・実機・Sentry受信・source map照合は未検証。重要な公開プライバシー判断と未承認送信を、テスト成功から推測しない。
