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
    // Domain layer boundary: runtime imports from UI / platform packages are
    // forbidden. `import type` is allowed because it is erased at compile time
    // and does not create a runtime dependency.
    files: ["domain/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "react",
                "react-native",
                "react-native/**",
                "expo",
                "expo-*",
                "@react-native*",
                "@react-native/**",
                "@sentry/*",
                "@react-native-async-storage/*",
              ],
              message:
                "domain/ layer must stay platform-agnostic. Use `import type` for types, or move side-effectful code into services/infra.",
              allowTypeImports: true,
            },
          ],
        },
      ],
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
