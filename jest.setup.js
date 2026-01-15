import "@testing-library/jest-native/extend-expect";

// Mock react-native-reanimated and its dependencies
jest.mock("react-native-worklets", () => ({
  init: jest.fn(),
  Worklets: {
    createRunInContext: jest.fn(),
    createContext: jest.fn(),
  },
  createSerializable: (val) => val,
  isWorklet: () => false,
  isWorkletCallable: () => false,
  WorkletsError: class extends Error {},
  serializableMappingCache: new Map(),
  scheduleOnUI: (fn) => fn,
  scheduleOnRN: (fn) => fn,
}));

jest.mock("react-native-worklets-core", () => ({
  Worklets: {
    createRunInContext: jest.fn(),
    createContext: jest.fn(),
  },
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
jest.mock("expo-av", () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() =>
        Promise.resolve({
          sound: {
            playAsync: jest.fn(),
            unloadAsync: jest.fn(),
          },
        })
      ),
    },
    setAudioModeAsync: jest.fn(),
  },
}));
// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock expo-crypto
jest.mock("expo-crypto", () => ({
  randomUUID: jest.fn(() => global.crypto.randomUUID()),
}));
