# React Best Practices

**Version 0.1.0** — Vercel Engineering

> このドキュメントはAIエージェント/LLMがReact/Next.jsコードベースをメンテナンス・生成・リファクタリングする際に参照するためのガイドです。

---

## Abstract

React/Next.jsアプリケーションのパフォーマンス最適化ガイド。45ルールを8カテゴリで整理し、影響度順（CRITICAL→LOW）に優先順位付け。

---

## 1. Eliminating Waterfalls — **CRITICAL**

ウォーターフォール（直列待ち）はパフォーマンス低下の最大要因。各`await`がネットワークレイテンシを追加。

### 1.1 Defer Await Until Needed
**Impact: HIGH**

`await`は実際に使う分岐内に移動。

```typescript
// ❌ 両分岐でブロック
async function handleRequest(userId: string, skip: boolean) {
  const userData = await fetchUserData(userId)
  if (skip) return { skipped: true }
  return processUserData(userData)
}

// ✅ 必要な時だけブロック
async function handleRequest(userId: string, skip: boolean) {
  if (skip) return { skipped: true }
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

### 1.2 Promise.all() for Independent Operations
**Impact: CRITICAL (2-10× improvement)**

独立した非同期操作は`Promise.all()`で並列化。

```typescript
// ❌ 直列（3ラウンドトリップ）
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()

// ✅ 並列（1ラウンドトリップ）
const [user, posts, comments] = await Promise.all([
  fetchUser(), fetchPosts(), fetchComments()
])
```

### 1.3 Strategic Suspense Boundaries
**Impact: HIGH**

Suspenseでラッパーを即表示、データはストリーム。

```tsx
// ✅ Sidebar/Header/Footerは即表示、DataDisplayのみ待機
function Page() {
  return (
    <div>
      <Sidebar /><Header />
      <Suspense fallback={<Skeleton />}>
        <DataDisplay />
      </Suspense>
      <Footer />
    </div>
  )
}
```

---

## 2. Bundle Size Optimization — **CRITICAL**

### 2.1 Avoid Barrel File Imports
**Impact: CRITICAL (200-800ms import cost)**

バレルファイル経由でなく、直接importする。

```tsx
// ❌ 全体をロード
import { Check, X } from 'lucide-react'

// ✅ 必要なものだけ
import Check from 'lucide-react/dist/esm/icons/check'
import X from 'lucide-react/dist/esm/icons/x'

// ✅ Next.js 13.5+: optimizePackageImportsで自動変換
```

### 2.2 Dynamic Imports for Heavy Components
**Impact: CRITICAL**

重いコンポーネントは`next/dynamic`で遅延ロード。

```tsx
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)
```

### 2.3 Defer Non-Critical Third-Party Libraries
**Impact: MEDIUM**

Analytics/Loggingはハイドレーション後にロード。

---

## 3. Server-Side Performance — **HIGH**

### 3.1 Cross-Request LRU Caching

`React.cache()`は1リクエスト内のみ。リクエスト間はLRUキャッシュ。

```typescript
import { LRUCache } from 'lru-cache'
const cache = new LRUCache<string, any>({ max: 1000, ttl: 5 * 60 * 1000 })

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached
  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}
```

### 3.2 Minimize Serialization at RSC Boundaries
**Impact: HIGH**

Client Componentsには必要なフィールドだけ渡す。

```tsx
// ❌ 50フィールド全部シリアライズ
return <Profile user={user} />

// ✅ 使う1フィールドだけ
return <Profile name={user.name} />
```

### 3.3 Use after() for Non-Blocking Operations

Next.jsの`after()`でレスポンス後に処理。

---

## 4. Client-Side Data Fetching — **MEDIUM-HIGH**

### 4.1 Use SWR for Automatic Deduplication

SWRでリクエスト重複排除・キャッシュ・再検証。

```tsx
import useSWR from 'swr'
const { data: users } = useSWR('/api/users', fetcher)
```

---

## 5. Re-render Optimization — **MEDIUM**

### 5.1 Defer State Reads to Usage Point

コールバック内でのみ使うstateはsubscribeしない。

```tsx
// ❌ searchParams変更で毎回再描画
const searchParams = useSearchParams()
const handleShare = () => shareChat(chatId, { ref: searchParams.get('ref') })

// ✅ 必要な時に読む
const handleShare = () => {
  const params = new URLSearchParams(window.location.search)
  shareChat(chatId, { ref: params.get('ref') })
}
```

### 5.2 Use Functional setState Updates
**Impact: MEDIUM**

state依存の更新は関数型setStateで安定コールバック。

```tsx
// ❌ items依存でコールバック再生成
const addItems = useCallback((newItems) => {
  setItems([...items, ...newItems])
}, [items])

// ✅ 依存なし、安定
const addItems = useCallback((newItems) => {
  setItems(curr => [...curr, ...newItems])
}, [])
```

### 5.3 Use Lazy State Initialization

高コスト初期値は関数で渡す。

```tsx
// ❌ 毎レンダーで実行
const [settings] = useState(JSON.parse(localStorage.getItem('settings') || '{}'))

// ✅ 初回のみ
const [settings] = useState(() => JSON.parse(localStorage.getItem('settings') || '{}'))
```

### 5.4 Use Transitions for Non-Urgent Updates

`startTransition`で非緊急更新をマーク。

---

## 6. Rendering Performance — **MEDIUM**

### 6.1 CSS content-visibility for Long Lists
**Impact: HIGH**

オフスクリーン要素の描画を遅延。

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

### 6.2 Hoist Static JSX Elements

静的JSXはコンポーネント外に。

### 6.3 Use Explicit Conditional Rendering

`&&`でなく三項演算子（0/NaN描画防止）。

```tsx
// ❌ count=0で"0"が描画される
{count && <Badge>{count}</Badge>}

// ✅
{count > 0 ? <Badge>{count}</Badge> : null}
```

---

## 7. JavaScript Performance — **LOW-MEDIUM**

### 7.1 Build Index Maps for Repeated Lookups

複数`.find()`は`Map`で O(1) ルックアップに。

```typescript
const userById = new Map(users.map(u => [u.id, u]))
orders.map(o => ({ ...o, user: userById.get(o.userId) }))
```

### 7.2 Combine Multiple Array Iterations

複数`filter/map`は1ループに統合。

### 7.3 Use Set/Map for O(1) Lookups

```typescript
const allowedIds = new Set(['a', 'b', 'c'])
items.filter(item => allowedIds.has(item.id))
```

### 7.4 Use toSorted() Instead of sort()
**Impact: MEDIUM-HIGH**

`.sort()`はミューテート。`.toSorted()`で不変性維持。

---

## 8. Advanced Patterns — **LOW**

### 8.1 useLatest for Stable Callback Refs

Effect依存からコールバックを除外しつつ最新値を参照。

```typescript
function useLatest<T>(value: T) {
  const ref = useRef(value)
  useEffect(() => { ref.current = value }, [value])
  return ref
}
```

---

## References

1. https://react.dev
2. https://nextjs.org
3. https://swr.vercel.app
4. https://github.com/shuding/better-all
5. https://github.com/isaacs/node-lru-cache
6. https://vercel.com/blog/how-we-optimized-package-imports-in-next-js
