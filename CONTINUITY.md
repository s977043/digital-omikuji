Goal (成功条件を含む):
- Vercel ビルドで発生する `ERR_INVALID_THIS`（fetch/URLSearchParams 互換性問題）を解消し、推奨設定（pnpm/Node 指定、必要ならロック再生成・npmrc 調整）を反映してビルドが通る状態にする。

Constraints / Assumptions:
- 共通ルールはリポジトリ直下の `AGENTS.md`（pnpm 前提、ロックファイル/`.env*` 不触等）を正とする。
- 開発者指示：現在のブランチでコミットし、コミット後に `make_pr` で PR を作成する。
- 触らない: `node_modules/`, `**/*.lock`, `.env*`, `secrets/`。
- ビルド環境は Vercel（Node 18/20 系）。pnpm バージョン差分がエラー要因の可能性。

Key decisions:
- Vercel 環境向けに `packageManager` で pnpm v9 を明示し、`engines.node` で Node 20.x を指定して整合性を図る。
- ロックファイル再生成の要否は状況を見て判断し、実施する場合は理由と手順を明示する。
- レポジトリ方針に従いロックファイルは変更せず現状を維持する。

State:
  - Done: ビルドエラーレポートと対処方針の確認。`package.json` に Node/pnpm の指定を追加。`.npmrc` を追加。`pnpm test` を実行（Jest は React Native polyfill の型注釈で失敗）。変更をコミットし PR を作成。
  - Now: レビュー待ち。
  - Next: フィードバック対応（必要に応じて）。

Open questions（必要なら UNCONFIRMED）:
- UNCONFIRMED: 現行 `pnpm-lock.yaml` を保持したまま修正で解消するか、再生成が必須か未確認。

Working set（files / ids / commands）:
- ファイル: `package.json`, `.npmrc`, `CONTINUITY.md`
- コマンド: `cat AGENTS.md`, `cat CONTINUITY.md`, `pnpm test`, `git status --short`, `git commit`
