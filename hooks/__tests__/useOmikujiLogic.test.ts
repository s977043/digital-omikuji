import { useOmikujiLogic } from '../useOmikujiLogic';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { OMIKUJI_DATA } from '../../constants/OmikujiData';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('useOmikujiLogic', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });
  it('初期状態では運勢がnullである', () => {
    const { result } = renderHook(() => useOmikujiLogic());
    expect(result.current.fortune).toBeNull();
  });

  it('drawFortune を呼ぶと運勢が抽選される', () => {
    const { result } = renderHook(() => useOmikujiLogic());

    act(() => {
      result.current.drawFortune();
    });

    expect(result.current.fortune).not.toBeNull();
    expect(OMIKUJI_DATA).toContainEqual(result.current.fortune);
  });

  it('resetFortune を呼ぶと運勢がnullにリセットされる', () => {
    const { result } = renderHook(() => useOmikujiLogic());

    act(() => {
      result.current.drawFortune();
    });

    expect(result.current.fortune).not.toBeNull();

    act(() => {
      result.current.resetFortune();
    });

    expect(result.current.fortune).toBeNull();
  });

  it('複数回抽選を行っても正常に動作する', () => {
    const { result } = renderHook(() => useOmikujiLogic());

    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.drawFortune();
      });

      expect(result.current.fortune).not.toBeNull();
      expect(OMIKUJI_DATA).toContainEqual(result.current.fortune);
    }
  });

  it('重み付けロジックが機能している（統計的検証）', () => {
    const results = new Map<string, number>();
    const { result } = renderHook(() => useOmikujiLogic());

    for (let i = 0; i < 1000; i++) {
      act(() => {
        result.current.drawFortune();
      });

      const fortuneResult = result.current.fortune?.result || '';
      results.set(fortuneResult, (results.get(fortuneResult) || 0) + 1);
    }

    // 大吉は凶より多く出るはず（weight: 10 vs 5）
    const daikichi = results.get('大吉') || 0;
    const kyo = results.get('凶') || 0;

    expect(daikichi).toBeGreaterThan(kyo);
  });

  it('drawFortune を呼ぶと履歴にエントリが追加される', async () => {
    const { result } = renderHook(() => useOmikujiLogic());

    await act(async () => {
      await result.current.drawFortune();
    });

    await waitFor(() => {
      expect(result.current.history.length).toBe(1);
    });
    expect(result.current.history[0].fortune).toEqual(result.current.fortune);
  });

  it('loadHistory を呼ぶと最新の履歴が読み込まれる', async () => {
    const { result } = renderHook(() => useOmikujiLogic());

    await act(async () => {
      await result.current.drawFortune();
    });

    const firstFortune = result.current.fortune;

    await act(async () => {
      await result.current.loadHistory();
    });

    await waitFor(() => {
      expect(result.current.history.length).toBeGreaterThan(0);
    });
    expect(result.current.history[0].fortune).toEqual(firstFortune);
  });
});
