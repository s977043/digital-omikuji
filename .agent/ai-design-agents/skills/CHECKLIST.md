# 11体構成 Overlay Skills チェックリスト

11 体構成の overlay スキルを追加・更新する際の確認項目です。

## 必須項目

- `.agent/ai-design-agents/skills/<skill-name>/SKILL.md` を作成する
- `SKILL.md` に Front Matter を付ける
- Front Matter に `name` と `description` を入れる
- 必要に応じて `checklist.md`, `rules.md`, `template.md`, `glossary.md` を追加する
- 既存の skill 名や責務と重複していないことを確認する

## 運用項目

- `AGENTS.md` の overlay 運用ルールと矛盾しないこと
- `DESIGN.md` や既存 standards と整合すること
- 必要なら `usage-guide.md` や関連 agent の `Related Skills` を更新すること

## 検証

```bash
pnpm validate:skills
find .agent/ai-design-agents -type f -name '*.md' -print0 | xargs -0 pnpm exec markdownlint
```
