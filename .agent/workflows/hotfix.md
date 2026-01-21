# Hotfixワークフロー

## 概要

本番環境の緊急修正フロー

## 前提条件

- 本番環境で重大なバグが発生
- [AGENTS.md](../../AGENTS.md) セクション6を確認

## フロー

### 1. hotfixブランチ作成

```bash
git checkout main
git pull origin main
git checkout -b hotfix/{summary}
```

### 2. 修正とテスト

```bash
# 最小限の修正を実施
# テストを追加
pnpm test
```

### 3. main へPR

```bash
gh pr create --base main --title "Hotfix: {summary}" --body "$(cat <<'EOF'
## 問題

{本番環境で発生した問題}

## 修正内容

{修正の詳細}

## テスト結果

[テスト結果を貼付]
EOF
)"
```

### 4. マージ後の develop への反映

```bash
# cherry-pick または follow-up PR で develop に反映
git checkout develop
git cherry-pick {commit-hash}
git push origin develop
```

## 注意事項

- hotfixは最小限の変更に留める
- 必ずテストを追加
- develop への反映を忘れない
