# Android 再始動監査・ストア公開計画

調査日: 2026-11-03。状態: **コード調査完了、実画面監査と実機検証はブロック中。公開可能とは判定しない。**

## 目的・今回の範囲

初期コストを抑えて Android / Google Play を第一候補にする。iOS は開発容易性と総費用を比較する代案であり、自動的に切り替えない。
既存設計と UI/UX を見直してから再始動するため、この変更は調査・計画文書のみ。アーキテクチャ移行、UI 全面変更、依存更新、署名、ビルドサービスへのアップロード、ストア操作は含めない。

受入条件: 現行 SHA と調査根拠、構成比較、優先順位、段階別 AC、未検証事項、記事・OSS 還元候補を記録する。実画面監査の完了条件は有効な画面証拠と実操作記録であり、コード読解で代替しない。

既存の公開タスクは [Issue #454](https://github.com/s977043/digital-omikuji/issues/454)。新規に重複 Issue を作らない。[従来の公開準備記録](android-release-readiness.md)と[申請手順](../project/google-play-submission.md)の過去成功は、その時点の記録として扱う。

## 調査基準とリポジトリ状態

- develop: `a93721414c12643280e65359b101b7fa1e750c85`。remote fetch / ls-remote で一致を確認。
- main: `3b69cb1e2541fa48ef7311f45d04a69efdb8329c`。develop と 31 ファイル差分。公開サイトの配信 SHA は未確認。
- 元の work ブランチは clean。専用 worktree / `docs/store-restart-audit-20261103` を develop から作成。
- open PR: #455 testing、#458 Expo、#459 minor/patch、#460 AsyncStorage major、#461 Sentry major、#464 Actions。今回それらの変更を取り込んでいない。
- open Issue: #454 公開、#182 計測、#174–178 占い拡張など。追加機能は今回の公開ゲートから分離。
- GitHub connector の当該 SHA workflow runs / combined statuses は空配列。CI 成功の証拠にはならない。CLI の GitHub API は Forbidden。develop protection API は `403 Resource not accessible by integration`。必須承認・保護の確認未完了につき merge 判定を保留。
- `vercel.json` は Git 自動デプロイ無効。一方 `.github/workflows/deploy-vercel.yml` は main push → production、develop push → preview。docs の merge でも deploy workflow が起動し得る。
- 公開 URL 候補 `https://digital-omikuji.vercel.app` は `app.config.ts` の privacy URL と #454 が根拠。入力された `.vercel` を推測だけで補ったものではない。稼働・正規ドメイン・配信版は未確認。

## 現行アーキテクチャ

`app/` (Expo Router) → templates / patterns / design-system UI → hooks (状態機械・抽選・設定) → `domain/` (純粋な抽選・日付規則・共有文) / `utils/` (AsyncStorage・音・触覚・共有・診断)。アカウントや業務 API サーバーはこの構成に不要。

`package.json` は Expo `~56.0.9`、RN `0.86.0`、React `19.2.3`、NativeWind 4、Reanimated 4、expo-audio。README/AGENTS の SDK54・Moti・Expo AV・Jest30 等は現行依存と不一致。パッケージ宣言は対応性の証明ではなく、SDK 整合性を doctor / native bundle / 実機で再確認する。

`app.json` が静的設定、`app.config.ts` は variant 名・package・bundle ID を上書き。production package は既定の `com.s977043.digitalomikuji` を維持する。EAS preview=APK、production=AAB、submit=internal が存在するが、本調査では生成・送信しない。

| 選択肢 | 再利用と作業量 | リスク・判断 |
| --- | --- | --- |
| **既存 Expo / RN を維持** | domain、UI tokens、履歴、センサー、EAS 設定を再利用。依存整合と境界挙動に集中 | 推奨。native 実機検証は必要だが移行費用を避けられる |
| Web + Capacitor 等へ移行 | Web 表示は再利用可能でも、native 共有・センサー・保存・ビルドを置換 | 既に native アプリなので追加移行の便益が小さい。単純ラッパー化による体験低下も懸念 |
| Kotlin / Swift で再構築 | platform API の制御は増すが、UI・状態・テストを再実装 | 現時点で固有要件なし。初期費用・保守負担に不利 |
| Web / PWA のみ継続 | ストア登録費を避けられる | 補助配信には使えるが、ストア登録の目的を満たさない |

## 優先所見（コード・設定根拠。実画面評価とは別）

| 優先 | 所見と根拠 | 次の検証・AC |
| --- | --- | --- |
| P0 | frozen install が失敗。`pnpm-lock.yaml:2104,2109` の `acorn@8.17.0` が重複、snapshot 側 `8817,8819` にも重複 | 専用修復 PR で依存意図と既存更新 PR を照合。pnpm 9.15.2 frozen install → doctor → 型/lint/test → native/web export が通る。無検討の lock 再生成を避ける |
| P0 | `utils/sentry.ts` は DSN 設定時に診断と tracing (production 0.2) を初期化。一方 `app/privacy-policy.tsx` と policy 文書は分析情報非収集・外部送信ほぼ無しと説明 | 本番設定と SDK 実送信を確認し、画面・公開 policy・ストア文・Data safety を同じデータ台帳から更新。DSN 実値や利用者データを記事に出さない |
| P1 | Android 画像共有: `utils/shareUtils.ts` は画像を capture しても `url` を iOS にしか渡さず Android は message + dialogTitle のみ | Android share target に画像が届くか実機で確認。画像共有要件を維持するなら SDK 対応 adapter を選定し cancel/失敗もテスト。README の画像共有表記と一致させる |
| P1 | `useOmikujiLogic` は初回保存読込中も `hasDrawnToday=false`。hydration 前の抽選、保存失敗時の成功表示を防ぐ契約がない | 遅延 storage で連打/シェイクを試験。hydration まで CTA を待機にし、保存失敗を成功と偽らない。履歴と日付の部分書込に回復方針を設ける |
| P1 | 日付判定は mount 時のみ。復帰・日付変更で更新する処理なし。`TIMEZONE_POLICY.md` の「前日へ戻すと不可」も `lastDate !== today` と不一致 | ローカル日付基準を維持して 23:59→00:00、復帰、timezone 変更を検証。時計変更を不正対策の対象にするかは別の製品判断 |
| P1 | `useShakeDetection` は非同期 available 待ちの後に listener 作成。先に cleanup すると後から購読が残り得る | deferred promise で unmount/disable を再現し、その後に listener が残らないことを確認 |
| P2 | Web は shake hook を常に無効化するが初回案内は「シェイクでもタップでも」。シェイク無効設定も文言に反映されない | platform/設定に応じた案内、初回の「1日1回」と再訪条件を実画面で確認 |
| P2 | 固定「新春」「令和八年 丙午」と日本語直書きが混在。アプリ設定には i18n あり | 通年利用・日本語のみ初版の範囲を決定。未対応言語をストアで宣伝しない |

既存の長所は domain 分離、token ベース UI、tap 代替、同時発火ガード、reduced motion 設定、履歴最大50件とローカル保存。これらを維持して小さく検証する。履歴削除のエラーを握りつぶして空表示する経路もあるため、保存系の AC に削除失敗を含める。

### データ・権限の棚卸し

- 確認範囲の app/hooks/utils/domain/package にログイン、課金、広告 SDK、push 通知実装は見つからない。新規導入しない。
- 履歴・抽選日・設定は AsyncStorage。センサーは端末内の検知。音は再生。OS 共有はユーザー操作を起点とする。
- Sentry は条件付き外部送信。`sendDefaultPii:false` / error event の user/request 除去だけで、全 SDK payload・transaction・サーバー側処理の非収集を保証しない。第三者 SDK も申告対象である。[Google Data safety](https://support.google.com/googleplay/android-developer/answer/10787469)
- Android `permissions:[]` は依存由来の merged manifest 権限がゼロという意味ではない。production AAB の manifest / SDK 一覧で確認する。iOS 写真権限の文言も、iOS を選ぶ場合のみ実装との一致を再評価。
- 外部利用規約への同意・独自利用規約の必要性、問い合わせ窓口、データ保持期間と削除運用はオーナー確認待ち。保持期間を SDK の推測値で確定しない。

## UI/UX 監査の状態と捕捉計画

Product Design audit とローカル browser/testing 手順を参照。保存済み Product Design context はなし。cloud critical-overrides リソースは取得できず、Plugin 全手順完了とは扱わない。
Chromium 390×844 / ja-JP で公開 URL を開いたが `ERR_TUNNEL_CONNECTION_FAILED`。curl も CONNECT 403、web fetch も取得不可。取得画像はブラウザーの接続エラーであり、アプリ画面証拠として不採用。サイト障害とは断定しない。
ローカル再現も frozen install で停止。以前のスクリーンショットや main の別版で代替していない。

| Step | 利用者の行動 | 現在の健全性評価 | 再開時の証拠・合格条件 |
| --- | --- | --- | --- |
| 1 | 初回起動・引き方を理解 | 未評価（接続/起動 blocker） | 01-start: 小型画面と大きな文字で CTA/回数制限が読める。tap のみで開始可能 |
| 2 | シェイク/タップ→抽選演出 | 未評価 | 02-drawing: 連打で二重保存なし。中断/戻る/復帰、motion 通常/抑制を比較 |
| 3 | 結果を読む・保存状態を理解 | 未評価 | 03-result: TalkBack 読上げ順、文字拡大、スクロール、フォーカス復帰、保存失敗を確認 |
| 4 | 共有・キャンセル・再試行 | 未評価 | 04-share: private fixture のみ、Android target で画像を確認。外部宛送信はしない |
| 5 | 履歴・設定・policy・戻る | 未評価 | 05-history / 06-settings: 削除確認と失敗、直リンク戻る、motion/音/センサー設定を確認 |
| 6 | 同日再訪・翌日・offline | 未評価 | 07-return: 再起動と復帰で同日結果を維持、日付変更で再抽選可能。offline 起動 |

スクリーンショットだけでアクセシビリティ適合とはしない。TalkBack、Android Back、sensor/haptics/audio/共有は実機必須。初回操作可能までの時間・結果までの時間・JS/画像転送量・フレーム落ちを同じ端末で前後測定し、未測定の改善率を書かない。

## Android 第一候補の費用・Codex 開発比較

2026-11-03 に一次資料を確認。税・換算・利用枠・手元機材は別途確認し、登録費だけを総費用としない。

| 項目 | Android / Google Play | iOS / App Store |
| --- | --- | --- |
| 登録 | [公式](https://support.google.com/googleplay/android-developer/answer/6112435): US$25 一回。本人確認と個人/組織種別確認 | [公式](https://developer.apple.com/programs/enroll/): US$99/年、地域価格・免除条件あり |
| 実装・自動テスト | 現行 TypeScript / Expo 資産を Codex で維持。型/Jest/Web E2E を自動化。Android SDK/JDK があれば local build 可能 | 共通コードは再利用可。ローカル native build / simulator は macOS/Xcode が必要。cloud build 利用可でも実機 QA は残る |
| build 費 | [Expo Free](https://expo.dev/pricing): Android/iOS 各15 build、低優先 queue の掲載。既存アカウントの残枠は未確認 | 同じ無料枠を使えるが Apple 登録と署名・provisioning は別。無料枠超過時は追加費用/待ち時間を評価 |
| ホスト・端末 | [local EAS build](https://docs.expo.dev/build-reference/local-builds/) は Linux/macOS、WSL は公式テスト対象外。現在の環境に native toolchain/実機接続があるとは未確認 | 同資料では iOS local build は macOS。Mac/iPhone 所有は未確認。Codex があるだけで代替できない |
| テスト・審査 | [2023-11-13以降作成の個人アカウント](https://support.google.com/googleplay/android-developer/answer/14151465): closed test 12人が連続14日 opt-in、その後 production access 申請。自動承認ではない | TestFlight/審査準備に加え [4.2 最低機能](https://developer.apple.com/app-store/review/guidelines/#minimum-functionality) の継続的な娯楽価値を説明。単純 Web 包装に変える理由はない |

推奨: Android + 現行 Expo を維持し、既存端末・local build または EAS 無料枠の利用可否を確認。Google Play テスター確保の時間も費用として扱う。Codex はコード・自動検証・申請文書を支援できるが、本人確認、契約、実機の体感評価、審査判断を代替しない。iOS が合理的になるのは既存 Apple 会員・Mac/iPhone・配布先などを確認し総費用が逆転した場合。

## 公開までのゲート

| 段階 | 作業 | AC / 証拠 |
| --- | --- | --- |
| G0 再現性 | **最初の小さな実装: lockfile 修復だけの PR**。pnpm 9.15.2 / Node22 系で current base を再検証 | frozen install 成功。lock 変更理由を説明。doctor/type/lint/Jest/web export/Android JS bundle ログ。既存依存 PR と重複しない |
| G1 契約整理 | SDK 台帳とプライバシー説明、README/AGENTS の stack、過去 build 記録と現在状態を整理 | 実送信と申告が一致。過去 AAB の SHA/target/versionCode/署名所有者を確認し、無条件に再利用しない |
| G2 体験の小修正 | 上の P1 を一件ずつ再現→fixture→修正。実画面で P2 を選別 | 保存失敗/日付復帰/Android画像共有/購読解除を確認。UI 変更は前後画像。同一端末測定 |
| G3 release candidate | preview APK と production AAB、offline/Back/TalkBack/大文字/中断復帰/共有を実機検証 | production package、署名、versionCode、merged manifest、native library 対応、現行 target API を検査。debug UI 無し |
| G4 申請準備 | 既存 #454 を更新するための根拠を揃える。掲載文・実機画像・問い合わせ・policy URL・Data safety・年齢/対象国 | 記載と binary の一致。画像の権利と最新版を確認。オーナーによるアカウント・申告内容確認 |
| G5 テスト配布→申請 | 許可後 internal→該当する closed→production access→審査提出→公開 | track ごとのテスト結果・不具合対応・提出内容を保存。審査通過を約束しない。公開後の診断と rollback/次 version 方針を準備 |

Google の[現行 target API 要件](https://support.google.com/googleplay/android-developer/answer/11926878)は 2026-08-31 以降、新規通常 Android アプリ/更新に API36 以上。#454 の API35 記載をそのまま採用しない。実バイナリは未検査。16KB page size 等を含む native 要件も RC 時に公式資料と artifact で確認する。

未許可操作: アカウント新規作成・本人情報送信、契約同意、支払い、有料 build、署名鍵/credential の作成設定、ストア upload/申請/公開。実行直前に具体的対象・費用・track・binary を提示して確認する。現段階で秘密値を尋ねない。
必要な情報: 開発者アカウントの有無/種別/作成時期、テスター確保、利用可能な Android 端末とホスト OS、既存 EAS 枠、対象年齢/国、診断送信の運用と問い合わせ先。Pixel 8/Mac の所有は仮定しない。

## 依存と OSS フィードバック

`shell-quote` は lockfile 上 1.8.4、参照元は `launch-editor@2.13.2` / `react-devtools-core@6.1.5`。アプリソースに直接 import は見つからない。
[GHSA-g4rg-993r-mgx7](https://github.com/advisories/GHSA-g4rg-993r-mgx7) の対象は 1.6.3–1.7.2、修正1.7.3 なので、この advisory の対象とは一致しない。ただし元の digest の advisory ID、最新 alert 状態、全推移依存・native 到達性は未確認。安全宣言や侵害断定はしない。lock 修復後に audit と依存経路を再取得する。

- 現状の lock 重複・保存/日付・共有 adapter はまずアプリ側の問題候補。upstream の不具合として投稿しない。
- OSS 候補A: Expo/RN 更新時の frozen lock と native build の契約を小さな fixture で再現。再現に必要な最小 package/lock/command/期待/実際だけを用意する。pnpm/Expo の問題なら upstream Issue 検索→重複へ情報追記案、新規なら Issue 下書き。
- OSS 候補B: async sensor setup と cleanup race の最小 hook fixture。Expo 自体の責任かアプリ lifecycle の責任かを切り分ける。
- OSS 候補C: River Review / PlanGate の利用者 Plugin で、privacy文書と SDK設定の不一致や「過去green≠現HEAD」をレビューできる独立fixture。CLI は OSS 本体開発用であり、本アプリの利用者手順に導入しない。
- 現在のツール一覧に River Review / PlanGate Plugin 実行口なし。repo の旧 River GitHub Action は存在するが、Plugin 登録・runtime 実行・効果検証済みとは扱わない。製品 repo は編集していない。
- 本 repo の open Issue/PR は照合済み。pnpm の重複検索では [#3991](https://github.com/pnpm/pnpm/issues/3991)（duplicate key と fix-lockfile、closed）を確認。今回は frozen install の停止であり、その Issue と同一不具合・再発とは未判定。修復不能を再現した場合のみ既存履歴と照合する。他の upstream の網羅的重複調査は未実施。外部投稿・公開記事は未実施。

## 記事候補（アウトライン、改善実績ではない）

仮題: 「Webで動くおみくじを、Android公開に向けて再点検した記録」。読者は既存 Expo アプリを個人で再始動する開発者。

1. 課題: ストア公開手順はあったが、旧成功記録・現行依存・説明が一致していなかった。
2. 仮説: 作り直しより既存 Expo の再現性と利用者への説明を修復する方が総費用を抑えられる。
3. 選択肢: Expo維持 / Web包装 / native再構築、登録費と端末・テスター・build待ちを分けた比較。
4. 検証: current SHA、frozen install の失敗、コード所見、実画面取得 blocker。続編で前後画像と実機・境界試験を追加。
5. 判断: Android-first、最初は lock 修復、その後 privacy と保存/共有の契約を確認。
6. 限界: 今回は性能改善・UX改善・申請成功を実証していない。Plugin の有効性も未検証。

公開時は未実装を成果にせず、再現用データ・画像は synthetic に限定し、credential・利用者データ・他repo内部情報を除く。依存問題を誰かの責任と決めつけない。

## 検証記録（5観点）

| Loop | 実施と結果 | 未完了・次のゲート |
| --- | --- | --- |
| 1 要件 | Android-first/低費用/検討先行を反映。#454 との重複を回避 | アカウント/機材/テスターは未確認 |
| 2 境界挙動 | 連打/保存失敗/日付変更/削除/共有/async cleanup をコードで確認し fixture AC 化 | 実操作・TalkBack・実機未実施 |
| 3 設計安全 | 構成とデータ境界、SDK/文書差分、deploy trigger、移行選択を比較 | 実通信・production manifest・SDK整合未検証 |
| 4 回帰統合 | Node24.19.0 + 指定 pnpm9.15.2 の frozen install 実行、duplicate mapping で停止。`pnpm run test --runInBand` も `jest: not found` で停止 | Jest テスト本体/tsc/lint/doctor/build/E2E は依存未導入のため未実行。古い312件成功を流用しない |
| 5 最終条件 | 文書のみ、対象/非対象/根拠/未検証を照合。対象文書 markdownlint-cli 0.48.0、`git diff --check`、相対リンク存在確認が成功。公開サイト画像は不採用 | 独立レビュー・必須CI/承認/保護確認を経て統合。今回は merge-ready ではない |

最小チーム選択: このフェーズは一人で調査・文書化し、実装を行わない。独立レビューは統合前の別工程として残し、セルフレビューを独立レビューと呼ばない。回数を満たすだけの同一テスト反復はしない。
