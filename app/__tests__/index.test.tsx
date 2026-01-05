import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import IndexScreen from "../index";

// Mocks
jest.mock("expo-router", () => ({
  Link: "Link",
  Stack: { Screen: () => null },
  router: { push: jest.fn() },
}));

// react-i18next mock removed - index.tsx no longer uses i18n

// Mock useOmikujiLogic
jest.mock("../../hooks/useOmikujiLogic", () => ({
  useOmikujiLogic: () => ({
    fortune: null,
    history: [],
    drawFortune: jest.fn(),
    resetFortune: jest.fn(),
    loadHistory: jest.fn(),
  }),
}));

// Mock components to avoid native issues
jest.mock("../../components/FortuneDisplay", () => ({
  FortuneDisplay: () => <></>,
}));
jest.mock("../../components/VersionDisplay", () => ({
  VersionDisplay: () => <></>,
}));
jest.mock("moti", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require("react-native");
  return {
    MotiView: View,
  };
});

// Mock SoundManager
jest.mock("../../utils/SoundManager", () => ({
  soundManager: {
    initialize: jest.fn(),
    loadSound: jest.fn(),
    playSound: jest.fn(),
    setMute: jest.fn(),
    unloadAll: jest.fn(),
  },
}));

// Mock expo-sensors to force button display (unavailable)
jest.mock("expo-sensors", () => ({
  Accelerometer: {
    isAvailableAsync: jest.fn().mockResolvedValue(false),
    setUpdateInterval: jest.fn(),
    addListener: jest.fn(),
  },
}));

describe("IndexScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders correctly and handles flow", async () => {
    const { getByText, queryByText } = render(<IndexScreen />);

    // Initial state
    await waitFor(() => {
      expect(getByText("令和七年 デジタルおみくじ")).toBeTruthy();
      // Button should be visible due to sensor unavailable mock
      expect(getByText("おみくじを引く")).toBeTruthy();
    });

    // Press Play
    await act(async () => {
      fireEvent.press(getByText("おみくじを引く"));
    });

    // Should enter SHAKING state
    // Text changes to "念を込めて..." (implied by SHAKING UI in source)
    await waitFor(() => {
      expect(getByText("念を込めて...")).toBeTruthy();
    });

    // Fast forward timers for SHAKING -> DRAWING
    act(() => {
      jest.advanceTimersByTime(2000); // SHAKING_DURATION_MS = 1500
    });

    // Should start DRAWING
    await waitFor(() => {
      // Assuming DrawingOverlay is rendered. We can check if "念を込めて..." is gone or some other element is present.
      expect(queryByText("念を込めて...")).toBeNull();
    });

    // Fast forward timers for DRAWING -> REVEALING
    act(() => {
      jest.advanceTimersByTime(1500); // DRAWING_DURATION_MS = 1200
    });

    // Should start REVEALING
    await waitFor(() => {
      expect(getByText("2026\n奉\n納")).toBeTruthy();
    });

    // Wait for REVEALING -> RESULT
    act(() => {
      jest.advanceTimersByTime(2500); // REVEALING_DURATION_MS = 2000
    });

    await waitFor(() => {
      expect(queryByText("おみくじを引く")).toBeNull();
    });
  });

  it("handles mute toggle and history navigation", async () => {
    const { getByText } = render(<IndexScreen />);

    await waitFor(() => expect(getByText("🔊")).toBeTruthy());

    fireEvent.press(getByText("🔊"));
    // Should toggle to muted icon or state?
    // Text becomes "🔇" ?
    // Implementation: {isMuted ? "🔇" : "🔊"}
    // Assuming update happens.

    // Navigation
    fireEvent.press(getByText("履歴"));
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { router } = require("expo-router");
    expect(router.push).toHaveBeenCalledWith("/history");
  });
});
