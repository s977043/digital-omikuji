// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "prettier/prettier": "error",
  },
};
