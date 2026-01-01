module.exports = {
    preset: 'jest-expo',
    transformIgnorePatterns: [
        '[/\\\\](?:node_modules|\\.pnpm)[/\\\\](?!.*((jest-)?react-native|@react-native(-community)?|@react-native/js-polyfills|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|uuid))',
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    collectCoverageFrom: [
        '**/*.{ts,tsx}',
        '!**/coverage/**',
        '!**/node_modules/**',
        '!**/.expo/**',
        '!**/babel.config.js',
        '!**/jest.setup.js',
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/.vscode/"
    ],
};
