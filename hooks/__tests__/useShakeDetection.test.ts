import { renderHook, act } from "@testing-library/react-native";
import { Platform } from "react-native";
import { Accelerometer } from "expo-sensors";
import { useShakeDetection } from "../useShakeDetection";

jest.mock("expo-sensors", () => ({
  Accelerometer: {
    isAvailableAsync: jest.fn(),
    setUpdateInterval: jest.fn(),
    addListener: jest.fn(),
  },
}));

describe("useShakeDetection", () => {
  let listenerCallback: ((data: { x: number; y: number; z: number }) => void) | null = null;
  const mockRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    listenerCallback = null;
    (Platform as { OS: string }).OS = "ios";

    (Accelerometer.isAvailableAsync as jest.Mock).mockResolvedValue(true);
    (Accelerometer.addListener as jest.Mock).mockImplementation((cb) => {
      listenerCallback = cb;
      return { remove: mockRemove };
    });
  });

  it("does nothing on web platform", () => {
    (Platform as { OS: string }).OS = "web";
    const onShake = jest.fn();

    renderHook(() => useShakeDetection({ enabled: true, threshold: 1.8, onShake }));

    expect(Accelerometer.isAvailableAsync).not.toHaveBeenCalled();
  });

  it("does nothing when disabled", () => {
    const onShake = jest.fn();

    renderHook(() => useShakeDetection({ enabled: false, threshold: 1.8, onShake }));

    expect(Accelerometer.isAvailableAsync).not.toHaveBeenCalled();
  });

  it("sets up accelerometer when enabled and available", async () => {
    const onShake = jest.fn();

    renderHook(() => useShakeDetection({ enabled: true, threshold: 1.8, onShake }));

    await act(async () => {});

    expect(Accelerometer.isAvailableAsync).toHaveBeenCalled();
    expect(Accelerometer.setUpdateInterval).toHaveBeenCalledWith(100);
    expect(Accelerometer.addListener).toHaveBeenCalled();
  });

  it("calls onShake when force exceeds threshold", async () => {
    const onShake = jest.fn();

    renderHook(() => useShakeDetection({ enabled: true, threshold: 1.8, onShake }));

    await act(async () => {});

    expect(listenerCallback).not.toBeNull();
    act(() => {
      listenerCallback!({ x: 2.0, y: 0, z: 0 });
    });

    expect(onShake).toHaveBeenCalled();
  });

  it("does not call onShake when force is below threshold", async () => {
    const onShake = jest.fn();

    renderHook(() => useShakeDetection({ enabled: true, threshold: 1.8, onShake }));

    await act(async () => {});

    act(() => {
      listenerCallback!({ x: 0.5, y: 0.5, z: 0.5 });
    });

    expect(onShake).not.toHaveBeenCalled();
  });

  it("does not set up listener when accelerometer unavailable", async () => {
    (Accelerometer.isAvailableAsync as jest.Mock).mockResolvedValue(false);
    const onShake = jest.fn();

    renderHook(() => useShakeDetection({ enabled: true, threshold: 1.8, onShake }));

    await act(async () => {});

    expect(Accelerometer.addListener).not.toHaveBeenCalled();
  });

  it("handles accelerometer initialization failure gracefully", async () => {
    (Accelerometer.isAvailableAsync as jest.Mock).mockRejectedValue(new Error("sensor error"));
    const errorSpy = jest.spyOn(console, "error").mockImplementation();
    const onShake = jest.fn();

    renderHook(() => useShakeDetection({ enabled: true, threshold: 1.8, onShake }));

    await act(async () => {});

    // reportSilentError forwards to console.error with the original log message.
    expect(errorSpy).toHaveBeenCalledWith(
      "Accelerometer initialization failed:",
      expect.any(Error)
    );
    errorSpy.mockRestore();
  });

  it("removes subscription on cleanup", async () => {
    const onShake = jest.fn();

    const { unmount } = renderHook(() =>
      useShakeDetection({ enabled: true, threshold: 1.8, onShake })
    );

    await act(async () => {});

    unmount();

    expect(mockRemove).toHaveBeenCalled();
  });
});
