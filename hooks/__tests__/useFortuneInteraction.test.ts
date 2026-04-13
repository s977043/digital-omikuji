import { renderHook, act } from "@testing-library/react-native";
import { Platform } from "react-native";
import { useFortuneInteraction } from "../useFortuneInteraction";
import { triggerHaptic } from "../../utils/haptics";

jest.mock("../../utils/haptics", () => ({
  triggerHaptic: jest.fn(),
}));

describe("useFortuneInteraction", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    (Platform as { OS: string }).OS = "ios";
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts with null exitAnimation and showTiedComplete false", () => {
    const { result } = renderHook(() =>
      useFortuneInteraction({ reducedMotion: false, onReset: jest.fn() })
    );

    expect(result.current.exitAnimation).toBeNull();
    expect(result.current.showTiedComplete).toBe(false);
  });

  it("handleTie sets exitAnimation to 'tie' immediately", () => {
    const { result } = renderHook(() =>
      useFortuneInteraction({ reducedMotion: false, onReset: jest.fn() })
    );

    act(() => {
      result.current.handleTie();
    });

    expect(result.current.exitAnimation).toBe("tie");
    expect(result.current.showTiedComplete).toBe(false);
  });

  it("handleTie sets showTiedComplete to true after 1200ms", () => {
    const { result } = renderHook(() =>
      useFortuneInteraction({ reducedMotion: false, onReset: jest.fn() })
    );

    act(() => {
      result.current.handleTie();
    });

    act(() => {
      jest.advanceTimersByTime(1199);
    });
    expect(result.current.showTiedComplete).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current.showTiedComplete).toBe(true);
  });

  it("handleKeep sets exitAnimation to 'keep' and calls onReset after 800ms", () => {
    const onReset = jest.fn();
    const { result } = renderHook(() => useFortuneInteraction({ reducedMotion: false, onReset }));

    act(() => {
      result.current.handleKeep();
    });

    expect(result.current.exitAnimation).toBe("keep");
    expect(onReset).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("ignores handleTie when exitAnimation is already set (double-click guard)", () => {
    const { result } = renderHook(() =>
      useFortuneInteraction({ reducedMotion: false, onReset: jest.fn() })
    );

    act(() => {
      result.current.handleTie();
    });
    act(() => {
      result.current.handleKeep(); // should be ignored
    });

    expect(result.current.exitAnimation).toBe("tie");
    // triggerHaptic should have been called only once (from the first handleTie)
    expect(triggerHaptic).toHaveBeenCalledTimes(1);
  });

  it("ignores handleKeep when exitAnimation is already set", () => {
    const onReset = jest.fn();
    const { result } = renderHook(() => useFortuneInteraction({ reducedMotion: false, onReset }));

    act(() => {
      result.current.handleKeep();
    });
    act(() => {
      result.current.handleKeep(); // should be ignored
    });

    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("passes reducedMotion flag to triggerHaptic", () => {
    const { result } = renderHook(() =>
      useFortuneInteraction({ reducedMotion: true, onReset: jest.fn() })
    );

    act(() => {
      result.current.handleTie();
    });

    expect(triggerHaptic).toHaveBeenCalledWith(
      expect.objectContaining({ type: "notification" }),
      false,
      true
    );
  });

  it("cleans up pending timers on unmount", () => {
    const onReset = jest.fn();
    const { result, unmount } = renderHook(() =>
      useFortuneInteraction({ reducedMotion: false, onReset })
    );

    act(() => {
      result.current.handleKeep();
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // onReset should not be called after unmount
    expect(onReset).not.toHaveBeenCalled();
  });
});
