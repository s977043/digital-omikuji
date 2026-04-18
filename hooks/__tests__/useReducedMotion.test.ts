import { act, renderHook, waitFor } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";
import { useReducedMotion } from "../useReducedMotion";

type ReduceMotionListener = (value: boolean) => void;

describe("useReducedMotion", () => {
  let listeners: ReduceMotionListener[];
  let removeSpy: jest.Mock;

  beforeEach(() => {
    listeners = [];
    removeSpy = jest.fn();

    jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);

    jest
      .spyOn(AccessibilityInfo, "addEventListener")
      // RN の addEventListener はイベント名で型が分岐するオーバーロードのため
      // any でキャストして reduceMotionChanged ハンドラを捕捉する
      .mockImplementation(((event: string, handler: unknown) => {
        if (event === "reduceMotionChanged") {
          listeners.push(handler as ReduceMotionListener);
        }
        return { remove: removeSpy };
      }) as unknown as typeof AccessibilityInfo.addEventListener);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns false initially before the OS value resolves", () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("reflects the OS value after isReduceMotionEnabled resolves", async () => {
    (AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockResolvedValue(true);
    const { result } = renderHook(() => useReducedMotion());
    await waitFor(() => expect(result.current).toBe(true));
  });

  it("updates when reduceMotionChanged event fires", async () => {
    const { result } = renderHook(() => useReducedMotion());
    await waitFor(() => expect(result.current).toBe(false));

    await act(async () => {
      listeners.forEach((listener) => listener(true));
    });
    expect(result.current).toBe(true);

    await act(async () => {
      listeners.forEach((listener) => listener(false));
    });
    expect(result.current).toBe(false);
  });

  it("removes the event listener on unmount", () => {
    const { unmount } = renderHook(() => useReducedMotion());
    unmount();
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });
});
