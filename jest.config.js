module.exports = {
  preset: "jest-expo",
  // jest-expo's preset uses react-native's built-in jest-environment which
  // targets jest 29. To avoid "clearMocksOnScope is not a function" errors,
  // we pin jest to ^29 (see package.json) and override with the standard
  // node environment so jest-expo's setup files work correctly.
  testEnvironment: "node",
  transformIgnorePatterns: [
    "node_modules/(?!(.pnpm|react-native|@react-native|expo|@expo|moti|react-native-reanimated|react-native-css-interop|react-native-worklets|react-native-worklets-core|@react-native-community|@testing-library))",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "domain/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "utils/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/.expo/**",
    "!**/babel.config.js",
    "!**/jest.setup.js",
    "!**/jest.config.js",
    "!**/tailwind.config.js",
    "!**/react-native.config.js",
    "!**/eslint.config.js",
    "!app/+html.tsx",
    "!app/_layout.tsx",
    "!app/+not-found.tsx",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.vscode/",
    "/.worktrees/",
    "/.agent/",
    "/.gemini/",
    "/river-reviewer/",
    "/e2e/",
  ],
};
