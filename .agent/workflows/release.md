# リリースワークフロー

## 概要

`develop` → `main` へのバージョンアップとデプロイ

## 前提条件

- `develop`ブランチで全テストがグリーン
- [AGENTS.md](../../AGENTS.md) セクション6を確認

## フロー

### 1. バージョン更新

```bash
# package.json のバージョンを更新
# app.json の versionCode/buildNumber を更新
```

### 2. PR作成

```bash
# develop → main へPR作成
git checkout -b release/v{version}
git push origin release/v{version}
gh pr create --base main --title "Release v{version}" --body "$(cat <<'EOF'
## リリース内容

- 機能1
- 機能2

## テスト結果

[テスト結果を貼付]

## デプロイ先

- iOS: TestFlight → App Store
- Android: Internal Testing → Production
EOF
)"
```

### 3. マージ後のタグ付け

```bash
git checkout main
git pull origin main
git tag -a v{version} -m "Release v{version}"
git push origin v{version}
```

### 4. develop への反映

```bash
git checkout develop
git merge main
git push origin develop
```

## 関連コマンド

- `/check` - リリース前の最終チェック
- `/pr` - PR本文生成
