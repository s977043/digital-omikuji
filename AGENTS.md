# Agent Guide (Digital Omikuji)

目的: このリポジトリで作業するコーディングエージェントが、最小の差分で安全に前進できるようにする。

## WHAT（地図）
- Stack:
  - Expo SDK 52 (Managed) / TypeScript
  - Expo Router v4
  - NativeWind v4
  - Moti (Reanimated)
- Layout:
  - app/: 画面・ルーティング
  - components/: 再利用 UI
  - hooks/: 抽選ロジックなどのフック
  - utils/: サウンド管理などのユーティリティ
  - assets/: 静的リソース
  - docs/: 詳細ドキュメント（必要なときだけ参照）
- Entrypoints:
  - app/: 画面の起点
  - hooks/: くじ抽選・状態管理の起点

## WHY（意図）
- Goal: 「新春のデジタルおみくじ」をシェイク/触覚/アニメで体験として成立させる。
- Architecture intent:
  - 画面 (app) と部品 (components) とロジック (hooks/utils) を分離して影響範囲を小さくする。
  - 実機依存（センサー/触覚/音）は Expo API で吸収し、UI から直接呼び出さない。
- Non-goals:
  - 無関係なリファクタ・命名祭り・整形だけの変更
  - “便利そう” という理由だけで新規技術を追加

## HOW（正解の検証）
- Fast checks:
  - pnpm start
  - pnpm test
- Build / CI parity:
  - pnpm build（必要なときだけ）
  - CI: .github/workflows/ を参照
- When unsure:
  - README → docs/ の順で一次情報を読む
  - 既存の実装パターンを優先し、一般論で上書きしない

## Constraints（少数の絶対ルール）
1) 最小差分: タスクに必要な変更だけ。ついで作業禁止。
2) “リンター家事” 禁止: 整形だけ、警告潰しだけ、スタイル統一だけの変更をしない。
3) 自動生成の乱用禁止: 大量の雛形生成・無根拠なファイル追加をしない。
4) 仕様/挙動を変えるならテストも変える（追加 or 調整）。
5) `main`/`develop` への直接コミットは禁止。作業ブランチ→PR で統合する。
6) PR タイトル: `[feat|fix|docs|refactor] summary`。
7) PR 本文（日本語）: 目的 / 変更点 / テスト結果ログ / 影響範囲 / UI 変更時スクリーンショット。
8) 編集禁止: `node_modules/`, `**/*.lock`, `.env*`, `secrets/`。
