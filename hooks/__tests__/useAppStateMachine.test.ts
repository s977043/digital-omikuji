import { renderHook, act } from "@testing-library/react-native";
import { useAppStateMachine } from "../useAppStateMachine";

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "LIGHT", Medium: "MEDIUM", Heavy: "HEAVY" },
  NotificationFeedbackType: { Success: "SUCCESS" },
}));

jest.mock("../../utils/haptics", () => ({
  triggerHaptic: jest.fn(),
}));

const defaultOptions = () => ({
  reducedMotion: false,
  drawFortune: jest.fn().mockResolvedValue(undefined),
  resetFortune: jest.fn(),
  playSound: jest.fn(),
  hasDrawnToday: false,
  hasFortune: false,
});

describe("useAppStateMachine", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts in IDLE state", () => {
    const { result } = renderHook(() => useAppStateMachine(defaultOptions()));
    expect(result.current.appState).toBe("IDLE");
  });

  it("transitions IDLE → SHAKING on handleShakeStart", async () => {
    const opts = defaultOptions();
    const { result } = renderHook(() => useAppStateMachine(opts));

    await act(async () => {
      await result.current.handleShakeStart();
    });

    expect(result.current.appState).toBe("SHAKING");
    expect(opts.playSound).toHaveBeenCalledWith("shake");
  });

  it("does not shake when hasDrawnToday is true", async () => {
    const opts = { ...defaultOptions(), hasDrawnToday: true };
    const { result } = renderHook(() => useAppStateMachine(opts));

    await act(async () => {
      await result.current.handleShakeStart();
    });

    expect(result.current.appState).toBe("IDLE");
  });

  it("transitions SHAKING → DRAWING after timer", async () => {
    const opts = defaultOptions();
    const { result } = renderHook(() => useAppStateMachine(opts));

    await act(async () => {
      await result.current.handleShakeStart();
    });

    expect(result.current.appState).toBe("SHAKING");

    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    expect(result.current.appState).toBe("DRAWING");
    expect(opts.drawFortune).toHaveBeenCalled();
  });

  it("transitions DRAWING → REVEALING → RESULT automatically", async () => {
    const opts = defaultOptions();
    const { result } = renderHook(() => useAppStateMachine(opts));

    await act(async () => {
      await result.current.handleShakeStart();
    });

    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    expect(result.current.appState).toBe("DRAWING");

    act(() => {
      jest.advanceTimersByTime(3500);
    });

    expect(result.current.appState).toBe("REVEALING");

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.appState).toBe("RESULT");
    expect(opts.playSound).toHaveBeenCalledWith("result");
  });

  it("transitions RESULT → IDLE on handleReset", async () => {
    const opts = defaultOptions();
    const { result } = renderHook(() => useAppStateMachine(opts));

    // Drive to RESULT state
    await act(async () => {
      await result.current.handleShakeStart();
    });
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    act(() => jest.advanceTimersByTime(3500));
    act(() => jest.advanceTimersByTime(2000));

    expect(result.current.appState).toBe("RESULT");

    act(() => {
      result.current.handleReset();
    });

    expect(result.current.appState).toBe("IDLE");
    expect(opts.resetFortune).toHaveBeenCalled();
  });

  it("transitions IDLE → RESULT on handleResultView when fortune exists", () => {
    const opts = { ...defaultOptions(), hasFortune: true };
    const { result } = renderHook(() => useAppStateMachine(opts));

    act(() => {
      result.current.handleResultView();
    });

    expect(result.current.appState).toBe("RESULT");
  });

  it("does not transition on handleResultView when no fortune", () => {
    const opts = { ...defaultOptions(), hasFortune: false };
    const { result } = renderHook(() => useAppStateMachine(opts));

    act(() => {
      result.current.handleResultView();
    });

    expect(result.current.appState).toBe("IDLE");
  });

  it("prevents double-fire of drawFortune on rapid handleShakeStart calls", async () => {
    const opts = defaultOptions();
    const { result } = renderHook(() => useAppStateMachine(opts));

    // 同一フレーム内で連続呼び出し（連打・センサー + タップ同時発火を模擬）
    await act(async () => {
      await Promise.all([result.current.handleShakeStart(), result.current.handleShakeStart()]);
    });

    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    // drawFortune は 1 回だけ呼ばれるべき
    expect(opts.drawFortune).toHaveBeenCalledTimes(1);
    expect(opts.playSound).toHaveBeenCalledWith("shake");
    // shake 音も 1 回（START_SHAKE は IDLE→SHAKING のみ遷移するため）
    const shakeCalls = (opts.playSound as jest.Mock).mock.calls.filter(([k]) => k === "shake");
    expect(shakeCalls).toHaveLength(1);
  });

  it("uses reduced durations when reducedMotion is true", async () => {
    const opts = { ...defaultOptions(), reducedMotion: true };
    const { result } = renderHook(() => useAppStateMachine(opts));

    await act(async () => {
      await result.current.handleShakeStart();
    });
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    expect(result.current.appState).toBe("DRAWING");

    // Reduced drawing duration: 600ms
    act(() => jest.advanceTimersByTime(600));
    expect(result.current.appState).toBe("REVEALING");

    // Reduced revealing duration: 350ms
    act(() => jest.advanceTimersByTime(350));
    expect(result.current.appState).toBe("RESULT");
  });
});
