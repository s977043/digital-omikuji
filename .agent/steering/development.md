---
title: "開発フロー・AI連携ガイドライン"
description: "本プロジェクトにおける開発プロセス、コード品質基準、AIエージェントの役割分担を定義します。"
version: 1.1
last_updated: "2025-12-10"
target_audience: ["developer", "ai_agent"]
---

# 開発フロー・AI連携ガイドライン

## AI支援開発フロー

**PocketEitanプロジェクト専用の統合開発プロセス**

### AIエージェント×SDD【仕様書駆動】×AI-TDD

1. **仕様確認**: `steering/`, `specs/`で要件・設計・タスクを確認
2. **要件定義**: `.kiro/specs/<feature>/requirements.md`でGherkin形式のシナリオ作成
3. **設計**: `.kiro/specs/<feature>/design.md`でアーキテクチャ・UI設計
4. **タスク分解**: `.kiro/specs/<feature>/tasks.md`で実装タスクを細分化
5. **AI-TDD**: テストファースト（Swagger定義 → contract test → endpoint test）

### コード品質基準

#### 必須チェック項目

- TypeScript strict mode（型エラー0件）
- ESLint エラー0件
- Vitest テスト通過率100%
- ビルドエラー0件

#### 推奨基準

- ファイルサイズ: 200行以下
- 関数サイズ: 20行以下
- テストカバレッジ: 80%以上
- コンポーネント単一責任原則

### AI エージェント役割分担

#### Kiro（仕様駆動開発）

- 機能仕様の作成・管理
- アーキテクチャ設計支援
- タスク分解・優先順位付け
- 実装ガイダンス

#### GitHub Copilot（コード補完）

- リアルタイムコード補完
- 関数・クラス実装支援
- テストコード生成
- リファクタリング支援

#### Codex CLI（コードレビュー）

- 静的解析・品質チェック
- セキュリティ脆弱性検出
- パフォーマンス最適化提案
- ベストプラクティス適用

#### Gemini CLI（対話的開発）

- 技術的な質問・相談
- デバッグ支援
- アルゴリズム最適化
- ドキュメント生成

## 実装ガイドライン

### コンポーネント設計

```typescript
// 良い例: 単一責任・型安全
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <button onClick={() => onEdit(user.id)}>編集</button>
    </div>
  );
};
```

### カスタムフック設計

```typescript
// 良い例: 再利用可能・テスタブル
export const useUserData = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading, error };
};
```

### テスト設計

```typescript
// 良い例: 振る舞いテスト
describe('UserCard', () => {
  it('ユーザー名を表示する', () => {
    const user = { id: '1', name: 'テストユーザー' };
    render(<UserCard user={user} onEdit={vi.fn()} />);

    expect(screen.getByText('テストユーザー')).toBeInTheDocument();
  });

  it('編集ボタンクリックでonEditが呼ばれる', () => {
    const onEdit = vi.fn();
    const user = { id: '1', name: 'テストユーザー' };
    render(<UserCard user={user} onEdit={onEdit} />);

    fireEvent.click(screen.getByText('編集'));
    expect(onEdit).toHaveBeenCalledWith('1');
  });
});
```

## エラーハンドリング

### フロントエンド

```typescript
// 良い例: 型安全なエラーハンドリング
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export const fetchUserSafely = async (id: string): Promise<Result<User>> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { success: false, error };
    }

    if (!data) {
      return { success: false, error: new Error('User not found') };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
};
```

### React Error Boundary

```typescript
// 良い例: グローバルエラーハンドリング
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // エラー報告サービスに送信
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## パフォーマンス最適化

### React最適化

```typescript
// 良い例: メモ化・最適化
export const ExpensiveComponent = memo(({ data }: Props) => {
  const processedData = useMemo(() =>
    data.map(item => expensiveCalculation(item)),
    [data]
  );

  const handleClick = useCallback((id: string) => {
    // クリックハンドラー
  }, []);

  return <div>{/* レンダリング */}</div>;
});
```

### バンドル最適化

```typescript
// 良い例: 動的インポート
const LazyComponent = lazy(() => import('./HeavyComponent'));

export const App = () => (
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
);
```

## セキュリティ

### 入力検証

```typescript
// 良い例: Zodによる型安全な検証
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().min(0).max(150),
});

export const validateUser = (data: unknown) => {
  return UserSchema.safeParse(data);
};
```

### 認証・認可

```typescript
// 良い例: Supabase RLS活用
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, isAuthenticated: !!user };
};
```

## Definition of Done（統合DoD）

### 機能実装チェックリスト

- [ ] Swagger定義が更新されている
- [ ] API契約テスト（contract test）が通る
- [ ] APIエンドポイントテスト（endpoint test）が通る
- [ ] Clean Architectureの層分離が守られている
- [ ] `handleApiError`によるエラーハンドリング実装済み
- [ ] TypeScript strict modeでエラーがない
- [ ] ESLint・Prettierが通る
- [ ] Storybook story（UI変更時）が更新されている

### セキュリティ要件

- [ ] 入力検証が実装されている
- [ ] 機密情報がログに出力されない
- [ ] エラーメッセージが適切にサニタイズされている
- [ ] API認証・認可が適切に実装されている

### 品質要件

- [ ] ユニットテスト・統合テストが通る
- [ ] テストカバレッジが要件を満たす
- [ ] パフォーマンス要件を満たす
- [ ] アクセシビリティ要件を満たす（UI変更時）

## 継続的改善

### メトリクス収集

- Core Web Vitals監視
- エラー率追跡
- ユーザー行動分析
- パフォーマンス測定

### 定期レビュー

- 週次: コード品質レビュー
- 月次: アーキテクチャレビュー
- 四半期: 技術負債整理
- 年次: 技術スタック見直し
