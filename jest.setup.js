import "@testing-library/jest-native/extend-expect";

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

// Mock safe area values for component tests that render templates without app layout.
jest.mock("react-native-safe-area-context", () => {
  const actual = jest.requireActual("react-native-safe-area-context/jest/mock");
  return {
    ...actual,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

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
// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock expo-crypto
jest.mock("expo-crypto", () => ({
  randomUUID: jest.fn(() => global.crypto.randomUUID()),
}));
