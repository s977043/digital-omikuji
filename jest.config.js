module.exports = {
  preset: "jest-expo",
  // react-native 0.84 bundles a jest-environment built for jest 29.
  // Override with jest 30's built-in node environment to avoid
  // "clearMocksOnScope is not a function" errors.
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
