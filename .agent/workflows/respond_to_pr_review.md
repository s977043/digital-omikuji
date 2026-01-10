---
description: PRレビューコメントを確認し、対応を行い、完了報告をするワークフロー
---

# PRレビュー対応フロー

PRについたレビューコメントを確認し、コードを修正して反映するまでの手順です。

## 1. チェックアウトと現状確認

作業対象のPRブランチにチェックアウトし、最新の状態にします。

```bash
# PRのブランチをチェックアウト
gh pr checkout <PR番号>

# 最新の変更を取得（リベース推奨）
git pull --rebase origin <ブランチ名>
```

## 2. レビューコメントの取得

PRについたレビューコメントを取得して、対応すべき項目をリストアップします。

```bash
# PRの情報を表示（ステータス、マージ可能性など）
gh pr view <PR番号> --json mergeable,mergeStateStatus,reviews

# レビューコメントの一覧を取得
gh api repos/:owner/:repo/pulls/<PR番号>/comments --jq '.[] | {path: .path, line: .line, body: .body}'
```

または、以下のコマンドでファイルの変更点とコメントを合わせて確認します。

```bash
gh pr diff <PR番号>
```

## 3. 対応計画の作成

`task.md` または `checklist` を作成し、各指摘事項への対応方針を決めます。

- [ ] 指摘事項1: ファイル名 - 対応方針
- [ ] 指摘事項2: ファイル名 - 対応方針

## 4. 修正の実装

各指摘事項に対してコードを修正します。
必要に応じて `task_boundary` を使用して進捗を管理してください。

- **Lint/Type Check**: 修正ごとに `pnpm lint`, `pnpm tsc --noEmit` を実行して回帰を防ぎます。
- **テスト**: 関連するテストを実行し、パスすることを確認します。 `pnpm test`

## 5. コミットとプッシュ

修正をコミットしてPRにプッシュします。

```bash
git add .
git commit -m "[fix] レビューコメント対応: <主な対応内容>"
git push
```

## 6. 対応報告

PRにコメントして、対応が完了したことをレビュワーに伝えます。

```bash
gh pr comment <PR番号> --body "レビューありがとうございます。以下の通り対応しました。

- 指摘事項1: 対応完了
- 指摘事項2: 対応完了

確認をお願いします。"
```

## Tips

- **CIエラー**: `gh run list` と `gh run view <ID> --log-failed` でCIの失敗を確認し、必ずローカルで再現・修正してからプッシュしてください。
- **コンフリクト**: コンフリクトが発生している場合は、`git rebase origin/develop` で解消してください。
