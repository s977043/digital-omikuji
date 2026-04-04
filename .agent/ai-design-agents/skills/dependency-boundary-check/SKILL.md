---
name: dependency-boundary-check
description: 依存方向、境界越え、層の漏れを重点的に確認する。
---

# Dependency Boundary Check

## Purpose

モジュール間の依存方向と境界違反を特定し、設計の崩れを早期に検知する。

## Checkpoints

- 下位詳細に上位が引きずられていないか
- ドメイン外の型や util が漏れていないか
- 循環依存の兆候がないか
- 境界をまたぐ import が説明可能か

## Output Format

- Summary
- Boundary Findings
- Risks
- Recommended Refactors
- Decision
