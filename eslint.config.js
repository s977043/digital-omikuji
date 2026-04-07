// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require("eslint-config-expo/flat");
const prettier = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");
const globals = require("globals");

module.exports = [
  ...expoConfig,
  prettier,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "error",
    },
    settings: {
      react: { version: "19.2" },
    },
  },
  {
    files: [
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
      "jest.setup.js",
      "jest.config.js",
      "eslint.config.js",
    ],
    languageOptions: {
      globals: { ...globals.jest, ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    ignores: [
      "node_modules/",
      ".expo/",
      ".agent/",
      ".git/",
      ".worktrees/",
      "dist/",
      "web-build/",
      "river-reviewer/",
      "scripts/",
    ],
  },
];
