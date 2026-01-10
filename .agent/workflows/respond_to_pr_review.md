---
description: PRレビューコメントを確認し、対応を行い、完了報告をするワークフロー
---

# PRレビュー対応フロー

PRに対するフィードバックやCIエラー、コンフリクトに対応するためのワークフローです。
以下の3つの観点で対応を行います：
1. **コンフリクトの解消**
2. **レビューコメント・行コメントの対応検討**
3. **CIエラーの対応**

## 1. 準備と現状確認

作業対象のPRブランチにチェックアウトし、最新の状態にします。

```bash
# PRのブランチをチェックアウト
gh pr checkout <PR番号>

# 最新の変更を取得（リベース推奨）
git pull --rebase origin <ブランチ名>

# PRのステータス確認（CI状況、マージ可能性など）
gh pr view <PR番号> --json mergeable,mergeStateStatus,statusCheckRollup
```

## 2. コンフリクトの解消

マージコンフリクトが発生している場合の対応手順です。

1.  **リベースの実行**:
    ```bash
    git fetch origin
    git rebase origin/develop
    ```
2.  **コンフリクトの修正**:
    コンフリクトしたファイルを修正し、`git add` します。
3.  **リベースの継続**:
    ```bash
    git rebase --continue
    ```
4.  **強制プッシュ**:
    ```bash
    git push --force-with-lease
    ```

## 3. レビューコメント・行コメントの対応検討

PRについたコメントを確認し、対応方針を決定します。

1.  **コメントの取得**:
    ```bash
    # レビューコメント一覧を取得
    gh api repos/:owner/:repo/pulls/<PR番号>/comments --jq '.[] | {path: .path, line: .line, body: .body}'
    ```
    または `gh pr view <PR番号> --comments` で確認します。

2.  **対応計画の作成**:
    `task.md` 等にリストアップし、各コメントに対して以下を検討します。
    *   **修正する**: 指摘通りにコードを修正する。
    *   **議論する**: 修正が難しい、または異論がある場合はコメントで返す。
    *   **チケット化**: 今回のPRスコープ外の場合は、別Issueとして切り出す。

## 4. CIエラーの対応

CI（テスト、Lint、型チェックなど）が失敗している場合の対応です。

1.  **失敗原因の特定**:
    ```bash
    # 失敗したRunのIDを確認
    gh run list --branch <ブランチ名> --limit 1

    # エラーログの確認
    gh run view <Run ID> --log-failed
    ```

2.  **ローカルでの再現と修正**:
    必ずローカル環境でエラーを再現・修正してからプッシュしてください。
    *   **Lint**: `pnpm lint`, `pnpm lint:fix`
    *   **Type Check**: `pnpm tsc --noEmit`
    *   **Test**: `pnpm test`

## 5. 修正の実装と報告

計画に基づき修正を行い、変更をプッシュして報告します。

1.  **実装**: コードを修正します。
2.  **検証**: ローカルでテストとLintを実行します。
3.  **プッシュ**:
    ```bash
    git add .
    git commit -m "[fix] レビュー対応: <主な変更点>"
    git push
    ```
4.  **完了報告**:
    PRにコメントして、レビュワーに対応完了を伝えます。
    ```bash
    gh pr comment <PR番号> --body "レビュー対応、CI修正、コンフリクト解消が完了しました。確認をお願いします。"
    ```
