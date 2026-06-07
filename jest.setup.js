import "@testing-library/jest-native/extend-expect";

// expo/src/winter lazily installs globals via getters that call require().
// In the jest-expo + testEnvironment:"node" setup, these lazy getters can
// fail. Pre-define all globals so the getters never fire.
// Node 20+ already provides most of these natively.
for (const name of [
  "TextDecoder",
  "TextDecoderStream",
  "TextEncoderStream",
  "URL",
  "URLSearchParams",
  "structuredClone",
]) {
  const current = globalThis[name];
  if (current) {
    Object.defineProperty(globalThis, name, {
      value: current,
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }
}
Object.defineProperty(globalThis, "__ExpoImportMetaRegistry", {
  value: { url: null },
  writable: true,
  configurable: true,
});

// Mock react-native-worklets for Reanimated v4 compatibility
// Reanimated v4 requires worklets for its threading model, but in Jest (Node.js environment)
// native worklet execution is not available. These mocks provide necessary stubs.
jest.mock("react-native-worklets", () => ({
  init: jest.fn(),
  Worklets: {
    createRunInContext: jest.fn(),
    createContext: jest.fn(),
  },
  // createSerializable / makeShareable: pass-through for serialization in tests
  // (Reanimated 4.3 / SDK56 が useAnimatedStyle で makeShareable を要求する)
  createSerializable: (val) => val,
  makeShareable: (val) => val,
  makeShareableCloneRecursive: (val) => val,
  // isWorklet/isWorkletCallable: return false since we're not in a real worklet context
  isWorklet: () => false,
  isWorkletCallable: () => false,
  WorkletsError: class extends Error {},
  // serializableMappingCache: used by Reanimated for caching serialized objects
  serializableMappingCache: new Map(),
  // scheduleOnUI/scheduleOnRN: execute synchronously in tests for predictable behavior
  scheduleOnUI: (fn) => fn,
  scheduleOnRN: (fn) => fn,
}));

require("react-native-reanimated").setUpTests();

// Mock expo-haptics
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
}));

// Mock expo-sensors
jest.mock("expo-sensors", () => ({
  Accelerometer: {
    addListener: jest.fn(),
    setUpdateInterval: jest.fn(),
    removeAllListeners: jest.fn(),
    isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  },
}));

// Mock expo-audio（SDK56 で expo-av から移行）
jest.mock("expo-audio", () => ({
  setAudioModeAsync: jest.fn(),
  createAudioPlayer: jest.fn(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    seekTo: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn(),
    volume: 1,
    muted: false,
    isLoaded: true,
  })),
}));
// Mock AsyncStorage (v3 changed export path)
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock expo-crypto
jest.mock("expo-crypto", () => ({
  randomUUID: jest.fn(() => global.crypto.randomUUID()),
}));

// MotionView を Reanimated から切り離し素の View としてモック（test 専用、旧 moti mock の代替）。
// reanimated 4 + React19 の act() 環境では無限ループ(withRepeat(-1))が AggregateError を
// 誘発するため、ユニットテストではアニメーション詳細を検証せず View として扱う。
jest.mock("./components/design-system/MotionView", () => {
  const { View } = require("react-native");
  return { MotionView: View };
});

// Mock react-i18next (default: return key as value; tests can override)
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) => {
      if (options?.returnObjects) return key;
      return key;
    },
  }),
}));

// Mock react-native-view-shot
jest.mock("react-native-view-shot", () => ({
  captureRef: jest.fn(),
}));

// Mock @sentry/react-native (requires native setup not available in tests)
jest.mock("@sentry/react-native", () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setContext: jest.fn(),
  addBreadcrumb: jest.fn(),
  withScope: jest.fn((cb) =>
    cb({
      setContext: jest.fn(),
      setLevel: jest.fn(),
      setTag: jest.fn(),
      setExtra: jest.fn(),
    })
  ),
  wrap: (component) => component,
}));
