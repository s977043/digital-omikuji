---
name: react-best-practices
description: React/Next.js パフォーマンス最適化ガイドライン（Vercel Engineering）。コードレビュー、リファクタリング、新規実装時に参照。45ルール × 8カテゴリを影響度順に整理。
contexts:
  - Codex
  - Gemini
  - Antigravity
tags:
  - react
  - performance
  - nextjs
  - optimization
---

# Vercel React Best Practices

React / Next.js アプリケーションのパフォーマンス最適化ガイド。
Vercel Engineering が10年以上の経験から抽出した45ルールを、影響度順に8カテゴリで整理。

## 参照元

- [Vercel Blog: Introducing React Best Practices](https://vercel.com/blog/introducing-react-best-practices)
- [GitHub: vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)

## 適用タイミング

- 新規 React コンポーネント / Next.js ページの作成時
- データフェッチ実装（クライアント / サーバー）
- コードレビューでのパフォーマンス指摘
- 既存コードのリファクタリング
- バンドルサイズ / ロード時間の最適化

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Eliminating Waterfalls | **CRITICAL** | `async-` |
| 2 | Bundle Size Optimization | **CRITICAL** | `bundle-` |
| 3 | Server-Side Performance | HIGH | `server-` |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH | `client-` |
| 5 | Re-render Optimization | MEDIUM | `rerender-` |
| 6 | Rendering Performance | MEDIUM | `rendering-` |
| 7 | JavaScript Performance | LOW-MEDIUM | `js-` |
| 8 | Advanced Patterns | LOW | `advanced-` |

---

## Quick Reference

### 1. Eliminating Waterfalls (CRITICAL)

| Rule | Summary |
|------|---------|
| `async-defer-await` | `await` を実際に使う分岐内に移動 |
| `async-parallel` | 独立操作は `Promise.all()` で並列化 |
| `async-dependencies` | 部分依存は `better-all` で最大並列化 |
| `async-api-routes` | Promise を早期開始、await は後 |
| `async-suspense-boundaries` | Suspense でコンテンツをストリーム |

### 2. Bundle Size Optimization (CRITICAL)

| Rule | Summary |
|------|---------|
| `bundle-barrel-imports` | バレルファイル避け、直接import |
| `bundle-dynamic-imports` | 重いコンポーネントは `next/dynamic` |
| `bundle-defer-third-party` | Analytics等はハイドレーション後に読込 |
| `bundle-conditional` | 機能有効時のみモジュールをロード |
| `bundle-preload` | hover/focus で事前ロード |

### 3. Server-Side Performance (HIGH)

| Rule | Summary |
|------|---------|
| `server-cache-react` | `React.cache()` でリクエスト内重複排除 |
| `server-cache-lru` | LRUキャッシュでリクエスト間キャッシュ |
| `server-serialization` | Client Components へのデータ最小化 |
| `server-parallel-fetching` | コンポーネント構成でフェッチ並列化 |
| `server-after-nonblocking` | `after()` でノンブロッキング処理 |

### 4. Client-Side Data Fetching (MEDIUM-HIGH)

| Rule | Summary |
|------|---------|
| `client-swr-dedup` | SWR で自動リクエスト重複排除 |
| `client-event-listeners` | グローバルイベントリスナー重複排除 |

### 5. Re-render Optimization (MEDIUM)

| Rule | Summary |
|------|---------|
| `rerender-defer-reads` | コールバック内のみで使う state は subscribe しない |
| `rerender-memo` | 高コスト処理をメモ化コンポーネントに抽出 |
| `rerender-dependencies` | Effect 依存はプリミティブに |
| `rerender-derived-state` | 派生ブール値を subscribe |
| `rerender-functional-setstate` | 関数型 setState で安定コールバック |
| `rerender-lazy-state-init` | 高コスト初期値は関数で渡す |
| `rerender-transitions` | 非緊急更新は `startTransition` |

### 6. Rendering Performance (MEDIUM)

| Rule | Summary |
|------|---------|
| `rendering-animate-svg-wrapper` | SVG 要素でなく div ラッパーをアニメーション |
| `rendering-content-visibility` | 長リストに `content-visibility` |
| `rendering-hoist-jsx` | 静的 JSX をコンポーネント外に抽出 |
| `rendering-svg-precision` | SVG 座標精度を削減 |
| `rendering-hydration-no-flicker` | インラインスクリプトでちらつき防止 |
| `rendering-activity` | Activity コンポーネントで show/hide |
| `rendering-conditional-render` | `&&` でなく三項演算子で条件描画 |

### 7. JavaScript Performance (LOW-MEDIUM)

| Rule | Summary |
|------|---------|
| `js-batch-dom-css` | CSS 変更をクラスか cssText でまとめる |
| `js-index-maps` | 繰り返しルックアップは Map 構築 |
| `js-cache-property-access` | ループ内でプロパティアクセスをキャッシュ |
| `js-cache-function-results` | 関数結果をモジュールレベル Map でキャッシュ |
| `js-cache-storage` | localStorage/sessionStorage 読み取りをキャッシュ |
| `js-combine-iterations` | 複数 filter/map を1ループに統合 |
| `js-length-check-first` | 高コスト比較前に配列長チェック |
| `js-early-exit` | 早期リターン |
| `js-hoist-regexp` | RegExp 生成をループ外に |
| `js-min-max-loop` | min/max は sort でなくループ |
| `js-set-map-lookups` | Set/Map で O(1) ルックアップ |
| `js-tosorted-immutable` | 不変性には `toSorted()` |

### 8. Advanced Patterns (LOW)

| Rule | Summary |
|------|---------|
| `advanced-event-handler-refs` | イベントハンドラを ref に格納 |
| `advanced-use-latest` | `useLatest` で安定コールバック ref |

---

## Full Compiled Document

全ルールの詳細とコード例は [`AGENTS.md`](./AGENTS.md) を参照。
