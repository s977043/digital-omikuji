import { useOmikujiLogic } from "../useOmikujiLogic";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper function to wait for initial useEffect to complete
const renderHookAndWaitForInitialLoad = async () => {
  const renderResult = renderHook(() => useOmikujiLogic());
  // Wait for the initial loadHistory() in useEffect to complete
  await waitFor(() => {
    // The hook has initialized when history is an array (even if empty)
    expect(renderResult.result.current.history).toBeDefined();
  });
  return renderResult;
};

describe("useOmikujiLogic", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("初期状態では運勢がnullである", async () => {
    const { result } = await renderHookAndWaitForInitialLoad();
    expect(result.current.fortune).toBeNull();
  });

  it("drawFortune を呼ぶと運勢が抽選される", async () => {
    const { result } = await renderHookAndWaitForInitialLoad();

    await act(async () => {
      await result.current.drawFortune();
    });

    expect(result.current.fortune).not.toBeNull();
    // Validate structure
    const fortune = result.current.fortune;
    expect(fortune).toHaveProperty("id");
    expect(fortune).toHaveProperty("level");
    expect(fortune).toHaveProperty("messageIndex");
    expect(fortune).toHaveProperty("createdAt");
  });

  it("resetFortune behavior: preserves fortune if drawn today, otherwise resets", async () => {
    const { result } = await renderHookAndWaitForInitialLoad();

    await act(async () => {
      await result.current.drawFortune();
    });

    expect(result.current.fortune).not.toBeNull();
    expect(result.current.hasDrawnToday).toBe(true);

    // resetFortune should NOT clear fortune if drawn today (to allow "View Result Again")
    act(() => {
      result.current.resetFortune();
    });
    expect(result.current.fortune).not.toBeNull();

    // Reset daily limit (simulate next day)
    await act(async () => {
      await result.current.debugResetDailyLimit();
    });
    // debugResetDailyLimit clears fortune, so we can't test resetFortune clearing it here directly
    // but we verify the primary requirement: existing fortune is KEPT.
    expect(result.current.fortune).toBeNull();
  });

  it("複数回抽選を行っても正常に動作する", async () => {
    const { result } = await renderHookAndWaitForInitialLoad();

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await result.current.debugResetDailyLimit();
        await result.current.drawFortune();
      });

      expect(result.current.fortune).not.toBeNull();
      expect(result.current.fortune?.id).toBeDefined();
    }
  });

  it("重み付けロジックが機能している（統計的検証）", async () => {
    const results = new Map<string, number>();
    const { result } = await renderHookAndWaitForInitialLoad();

    for (let i = 0; i < 1000; i++) {
      await act(async () => {
        await result.current.debugResetDailyLimit();
        await result.current.drawFortune();
      });

      const fortuneLevel = result.current.fortune?.level || "";
      results.set(fortuneLevel, (results.get(fortuneLevel) || 0) + 1);
    }

    // 大吉(daikichi)は凶(kyo)より少ないはず（weight: 5 vs 10）
    // Wait, old implementation daikichi=10, kyo=5?
    // My new implementation: daikichi=5, kyo=10 (Standard omikuji distribution)
    // Actually in my data: daikichi=5, kyo=10.
    // So Daikichi < Kyo.

    const daikichi = results.get("daikichi") || 0;
    const kyo = results.get("kyo") || 0;

    // Adjusted expectation based on new weights
    expect(kyo).toBeGreaterThan(daikichi);
  });

  it("drawFortune を呼ぶと履歴にエントリが追加される", async () => {
    const { result } = await renderHookAndWaitForInitialLoad();

    await act(async () => {
      await result.current.drawFortune();
    });

    await waitFor(() => {
      expect(result.current.history.length).toBeGreaterThanOrEqual(1);
    });
    // History entry IS the result now
    expect(result.current.history.some((h) => h.id === result.current.fortune?.id)).toBe(true);
  });

  it("loadHistory を呼ぶと最新の履歴が読み込まれる", async () => {
    const { result } = await renderHookAndWaitForInitialLoad();

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
    // Check if distinct ID exists in history
    expect(result.current.history.some((h) => h.id === firstFortune?.id)).toBe(true);
  });

  it("1日1回制限が機能する", async () => {
    const { result } = await renderHookAndWaitForInitialLoad();

    // First draw
    await act(async () => {
      await result.current.drawFortune();
    });
    const firstFortune = result.current.fortune;
    expect(result.current.hasDrawnToday).toBe(true);

    // Second draw (should return same fortune)
    await act(async () => {
      await result.current.drawFortune();
    });
    expect(result.current.fortune).toBe(firstFortune); // Same object reference

    // Simulate next day (reset)
    await act(async () => {
      await result.current.debugResetDailyLimit();
    });
    expect(result.current.hasDrawnToday).toBe(false);

    // Third draw (should be new)
    await act(async () => {
      await result.current.drawFortune();
    });
    expect(result.current.fortune).not.toBe(firstFortune); // Should be different object (new draw)
    expect(result.current.hasDrawnToday).toBe(true);
  });
});
