---
name: web-vitals-audit
description: 表示速度と体感性能を Core Web Vitals と実装差分の観点で監査する。
---

# Web Vitals Audit

## Purpose

初期表示や操作応答を損なう要因を、計測結果と実装差分から評価する。

## Checkpoints

- LCP、INP、CLS の懸念があるか
- 初期描画を阻害する処理がないか
- 重いアセットや画像がないか
- 不要な再レンダーがないか
- 改善コストに対して効果が見込めるか

## Output Format

- Summary
- Metric Risks
- Bottlenecks
- Recommended Actions
- Decision
