# API仕様書

## 概要

digital-omikuji プロジェクトのAPI仕様について説明します。Remix のLoader と Action を使用したAPIエンドポイントの詳細を記載します。

## エンドポイント一覧

### 1. おみくじ結果取得

#### GET /api/omikuji
おみくじの結果を取得します。

**リクエスト:**
```http
GET /api/omikuji
Content-Type: application/json
```

**レスポンス:**
```json
{
  "result": "大吉",
  "message": "今日はとても良い日になりそうです。",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "probability": 0.1
}
```

**レスポンスフィールド:**
- `result` (string): おみくじの結果 ("大吉", "中吉", "小吉", "凶")
- `message` (string): 結果に応じたメッセージ
- `timestamp` (string): 結果を生成した時刻
- `probability` (number): 該当結果の出現確率

### 2. おみくじ統計情報

#### GET /api/omikuji/stats
おみくじの統計情報を取得します。

**リクエスト:**
```http
GET /api/omikuji/stats
Content-Type: application/json
```

**レスポンス:**
```json
{
  "totalDraws": 1000,
  "results": {
    "大吉": {
      "count": 100,
      "percentage": 10.0
    },
    "中吉": {
      "count": 300,
      "percentage": 30.0
    },
    "小吉": {
      "count": 500,
      "percentage": 50.0
    },
    "凶": {
      "count": 100,
      "percentage": 10.0
    }
  },
  "lastUpdate": "2024-01-01T00:00:00.000Z"
}
```

### 3. ヘルスチェック

#### GET /health
アプリケーションの健康状態を確認します。

**リクエスト:**
```http
GET /health
Content-Type: application/json
```

**レスポンス:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600
}
```

## データ構造

### OmikujiResult 型

```typescript
interface OmikujiResult {
  result: '大吉' | '中吉' | '小吉' | '凶';
  message: string;
  timestamp: string;
  probability: number;
}
```

### OmikujiStats 型

```typescript
interface OmikujiStats {
  totalDraws: number;
  results: {
    [key: string]: {
      count: number;
      percentage: number;
    };
  };
  lastUpdate: string;
}
```

### HealthStatus 型

```typescript
interface HealthStatus {
  status: 'OK' | 'ERROR';
  timestamp: string;
  version: string;
  uptime: number;
}
```

## エラーハンドリング

### エラーレスポンス形式

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "サーバー内部エラーが発生しました",
    "details": "詳細なエラー情報（開発環境のみ）"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/omikuji"
}
```

### エラーコード一覧

| コード | 説明 |
|--------|------|
| `INTERNAL_SERVER_ERROR` | サーバー内部エラー |
| `BAD_REQUEST` | 不正なリクエスト |
| `NOT_FOUND` | リソースが見つからない |
| `RATE_LIMIT_EXCEEDED` | レート制限に達した |

## 実装例

### Remix Loader の実装

```typescript
// app/routes/api/omikuji.ts
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';

const results = [
  { result: '大吉', weight: 1, message: '今日はとても良い日になりそうです。' },
  { result: '中吉', weight: 3, message: '良いことが起こる予感です。' },
  { result: '小吉', weight: 5, message: '小さな幸せが見つかるでしょう。' },
  { result: '凶', weight: 1, message: '注意深く行動しましょう。' },
];

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const totalWeight = results.reduce((sum, { weight }) => sum + weight, 0);
    let randomNumber = Math.floor(Math.random() * totalWeight);

    for (const { result, weight, message } of results) {
      if (randomNumber < weight) {
        return json({
          result,
          message,
          timestamp: new Date().toISOString(),
          probability: weight / totalWeight
        });
      }
      randomNumber -= weight;
    }

    // フォールバック
    return json({
      result: '小吉',
      message: '小さな幸せが見つかるでしょう。',
      timestamp: new Date().toISOString(),
      probability: 0.5
    });
  } catch (error) {
    console.error('おみくじ生成エラー:', error);
    
    return json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'サーバー内部エラーが発生しました',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      timestamp: new Date().toISOString(),
      path: '/api/omikuji'
    }, { status: 500 });
  }
};
```

### 統計情報の実装

```typescript
// app/routes/api/omikuji/stats.ts
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';

// 実際の実装では、データベースから統計情報を取得
const mockStats = {
  totalDraws: 1000,
  results: {
    '大吉': { count: 100, percentage: 10.0 },
    '中吉': { count: 300, percentage: 30.0 },
    '小吉': { count: 500, percentage: 50.0 },
    '凶': { count: 100, percentage: 10.0 }
  },
  lastUpdate: new Date().toISOString()
};

export const loader: LoaderFunction = async () => {
  return json(mockStats);
};
```

### クライアント側の実装

```typescript
// app/hooks/useOmikuji.ts
import { useCallback, useState } from 'react';

interface UseOmikujiResult {
  result: OmikujiResult | null;
  loading: boolean;
  error: string | null;
  drawOmikuji: () => Promise<void>;
}

export function useOmikuji(): UseOmikujiResult {
  const [result, setResult] = useState<OmikujiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const drawOmikuji = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/omikuji');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'おみくじの取得に失敗しました');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    result,
    loading,
    error,
    drawOmikuji
  };
}
```

## レート制限

APIの乱用を防ぐため、レート制限を実装することを推奨します。

### 実装例

```typescript
// app/utils/rateLimit.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(clientId: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientId);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}
```

## キャッシュ戦略

パフォーマンス向上のため、適切なキャッシュ戦略を実装します。

### HTTP キャッシュヘッダー

```typescript
// 統計情報は5分間キャッシュ
export const loader: LoaderFunction = async () => {
  const stats = await getOmikujiStats();
  
  return json(stats, {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'ETag': generateETag(stats)
    }
  });
};
```

## セキュリティ

### CORS設定

```typescript
// app/utils/cors.ts
export function setCorsHeaders(headers: Headers) {
  headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
```

### 入力検証

```typescript
// app/utils/validation.ts
import { z } from 'zod';

export const omikujiRequestSchema = z.object({
  userId: z.string().optional(),
  preferences: z.object({
    language: z.enum(['ja', 'en']).default('ja')
  }).optional()
});
```

## 参考資料

- [Remix Loader/Action ドキュメント](https://remix.run/docs/en/main/route/loader)
- [REST API 設計原則](https://restfulapi.net/)
- [HTTP ステータスコード](https://developer.mozilla.org/ja/docs/Web/HTTP/Status)