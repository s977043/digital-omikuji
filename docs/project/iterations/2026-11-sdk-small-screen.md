# SDK整合と小画面の初回操作 — 2026-11-04

## 範囲と根拠

対象 develop `a937214`、lock修復 #466 `03cbb89`、初回案内 #467 `97192bd`、小画面 #468 `15487d1`。
既存ブランチを変更せず #468 から隔離した作業ブランチで検証する。課金・配信・署名設定・ストア申請は行わない。

初回利用者が短い時間・片手で引く場面を仮定した。実ユーザーの意見は未取得で、理解率・継続率の改善を実証したとは扱わない。
観測者は画面・DOM・操作、改善者は最小修正、別のレビュアーは依存・設定・回帰を担当する。

## 観測 → 改善 → 再評価

同じ Chromium / ja-JP / Asia/Tokyo の新規contextでローカルWeb exportを比較。

- #467 の既存exportでは320/390pxともdocument幅1024px、背景img幅1024px / naturalWidth1024を実測。
- #468＋SDK57ではdocument幅がviewportと一致。320×568のCTAはy544 / h67 / 下端611で、初期表示は約36%。内部スクロールで到達できる。
- 小さい高さの画面だけ、装飾円168→144、内側画像148→124、見出しを短い2行に変更。390×844の寸法・文言は維持。
- 既存E2EへCTA全体がviewport内に入るassertionを追加し、修正前には320pxで失敗することを確認した。
- 同じE2Eで持ち帰る→Tab→シェア→Shift+Tab→持ち帰るのフォーカス移動を追加。共有操作を送信しない。
- 観測者の再確認: 320pxのCTAはy486 / h67 / 下端553（58px上がり全体表示）、390pxはy662 / h67で不変。

[改善前320px](2026-11-sdk-small-screen/before-320.png) / [改善後320px](2026-11-sdk-small-screen/after-320.png) / [改善後390px](2026-11-sdk-small-screen/after-390.png)。

[初回の仮説と案内](2026-11-first-draw.md)、[横幅改善の経緯](2026-11-small-screen.md)の未検証事項は、この記録の追加証拠で更新する。
背景構図は#468から変更しない。主見出し短縮は儀式感を残し、初回CTAの到達性を優先した仮説であり、実ユーザー評価は次の段階。

## SDK判断

[Expo SDK57](https://expo.dev/changelog/sdk-57)の公式説明ではSDK56のHermes回帰はSDK57の修正版で解消する。
[Expo追跡Issue](https://github.com/expo/expo/issues/46519)にはSDK56へのbackportがない旨がある。
SDK56へRNを下げるだけでは回帰が残る。legacy Hermesへの切替はsource build等の検証範囲が増え、実験的Worklets bundle modeも採用しない。

- SDK57.0.31 / RN0.86.3 / Hermes compiler250829098.0.17へ揃えた。Reactは19.2.3のまま。
- Expo公式パッケージ内のbundledNativeModules対応表で関連モジュールを整合。SDK58への拡大や無関係なmajor更新はしない。
- dom-webview55.0.6がExpo/log-boxのpeer解決に残るため、公式期待範囲の`@expo/dom-webview ~57.0.1`を明示。チェックの抑制やlockfile手編集はしない。
- `expo install --fix`のAPI呼出しはProxy Forbidden。制限を迂回せず、ローカルの公式対応表を使うEXPO_OFFLINEで整合した。pnpmは既存9.15.2に固定。
- 動的configのため自動追記できないasset/audio/font/status-bar pluginをapp.jsonへ明示。audioは録音・背景再生/録音を無効化。通常権限MODIFY_AUDIO_SETTINGSは残る。
- RN用Jest presetも0.86.3へ整合。Reanimatedの既存Babel plugin aliasと既存withWorkletsを維持。
- runtimeVersionのappVersion方針に従いapp/package versionを1.3.1へ分離。旧1.3.0バイナリへSDK変更をOTA配信しない。新native buildが必要。配信は実施していない。

## 検証と境界

- frozen install、型検査、ESLint、Jest45 suites / 316 tests成功。
- Web production export6 routes、Android production JS export（no-bytecode）成功。Web exportの既存強制終了warningは継続。
- Android prebuild（no-install / no-clean）成功。生成物はgitignore対象でcommitしない。config introspectで録音・foreground-service権限が増えないことを確認。
- local doctor19/21。SDK/Hermesとdom-webviewの指摘は消えたが、schema APIとReact Native Directoryへの接続不可は未検証。CIで再確認する。
- Android SDK/adb/実機がないためGradle build、端末上のメモリ、TalkBack、大きな文字、ネイティブセンサー・共有は未検証。JS exportとprebuildはnative E2Eの代替ではない。
- 検証用python HTTP serverでは拡張子なし直URLが404となり2 E2E失敗。アプリの回帰と分け、既存serve -sへ揃えた再実行は8件成功（48.6s）。
- 既存pnpm overridesは維持。ESLint10に対する既存plugin peer警告は残るがlint実行は成功。無関係なlint依存変更はしない。

## 5観点とレトロ

| ループ | 検証・対応・再確認 |
| --- | --- |
| 要件 | 3役で初回・小画面を観測。実ユーザーと仮説を分離。CTA全体表示を受入条件に追加。 |
| 境界 | 320pxのviewport assertionをred確認後にcompact表示を修正。390px維持、保存・再訪、フォーカス循環を同じE2Eで確認。 |
| 設計 | 公式対応表・互換性・runtime分離・権限を独立レビュー。回避設定や新しい共通runnerは追加しない。 |
| 回帰 | 更新後のfrozen install/型/lint/Jest/exportを再実行。最終ローカルWeb E2E8件成功、独立レビューで変更必須指摘なし。CIはPRに記録。 |
| 完了 | 最新HEAD/base、CI、必須承認・保護を確認し未充足ならマージしない。保護APIの以前の403は無根拠に再試行しない。 |

AATのE2E証拠・レビュー手順を参照し、アプリ固有の既存Playwrightだけを拡張。AAT自体や他OSSは編集しない。
再利用する知見の候補は「toBeVisibleだけではCTA全体の到達性を保証しない」「横幅と内部縦スクロールを分ける」「SDK整合・native実機・公開承認を別の証拠にする」。
記事候補は、3役の仮説評価→失敗するE2E→最小修正→独立検証の記録。OSSへの外部投稿はしていない。
PlanGate/River Review Pluginは利用できずCLI代用なし。既存River CIはLLM skipのため独立レビューの代替にしない。

## CI環境の再修正

HEAD237dd3aのWeb E2Eはbrowser導入時に `Playwright does not support chromium on ubuntu26.04-x64` で停止。テスト本体未実行。ローカル固定Playwright1.60.0の配布対応表はUbuntu24.04を含むため、E2Eジョブをubuntu-24.04へ固定しcache keyにも版を含める。テスト削除やassertion緩和は行わず、CIで再確認する。最新Playwrightの対応OSと、lockされた版の対応OSを区別する。
