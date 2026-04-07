import "@testing-library/jest-native/extend-expect";

// Jest 30 blocks require() inside lazy getters set up by expo/src/winter.
// Pre-define all globals that expo/src/winter would lazily install, so the
// getters never fire. Node 20+ already provides most of these natively.
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
  // createSerializable: pass-through for serialization in tests
  createSerializable: (val) => val,
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
  },
}));

// Mock expo-av
jest.mock(
  "expo-av",
  () => ({
    Audio: {
      Sound: {
        createAsync: jest.fn(() =>
          Promise.resolve({
            sound: {
              playAsync: jest.fn(),
              replayAsync: jest.fn(),
              unloadAsync: jest.fn(),
              setVolumeAsync: jest.fn(),
              setIsMutedAsync: jest.fn(),
              getStatusAsync: jest.fn().mockResolvedValue({
                isLoaded: true,
                isPlaying: false,
                positionMillis: 0,
              }),
            },
            status: { isLoaded: true, isPlaying: false, positionMillis: 0 },
          })
        ),
      },
      setAudioModeAsync: jest.fn(),
    },
  }),
  { virtual: true }
);
// Mock AsyncStorage (v3 changed export path)
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest")
);

// Mock expo-crypto
jest.mock("expo-crypto", () => ({
  randomUUID: jest.fn(() => global.crypto.randomUUID()),
}));

// Mock moti (Reanimated animation wrapper)
jest.mock("moti", () => {
  const { View } = require("react-native");
  return { MotiView: View };
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
