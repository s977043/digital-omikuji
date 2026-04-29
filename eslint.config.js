const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");
const globals = require("globals");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      ".vscode/**",
      ".agent/**",
      ".git/**",
      ".worktrees/**",
      "dist/**",
      "web-build/**",
      "river-reviewer/**",
      "scripts/**",
    ],
  },
  ...expoConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
    },
  },
];
