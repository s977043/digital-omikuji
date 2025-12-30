import '@testing-library/jest-native/extend-expect';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
    impactAsync: jest.fn(),
    notificationAsync: jest.fn(),
    ImpactFeedbackStyle: {
        Light: 'light',
        Medium: 'medium',
        Heavy: 'heavy',
    },
    NotificationFeedbackType: {
        Success: 'success',
        Warning: 'warning',
        Error: 'error',
    },
}));

// Mock expo-sensors
jest.mock('expo-sensors', () => ({
    Accelerometer: {
        addListener: jest.fn(),
        setUpdateInterval: jest.fn(),
        removeAllListeners: jest.fn(),
    },
}));

// Mock expo-av
jest.mock('expo-av', () => ({
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
