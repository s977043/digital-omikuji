/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["@remix-run/eslint-config"],
  rules: {
    "no-console": "off", // 必要に応じて修正
  },
};
