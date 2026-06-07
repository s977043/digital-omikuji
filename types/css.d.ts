// TypeScript 6.0 は side-effect import（`import "../global.css"`）に型宣言を要求する。
// nativewind の global.css 等の CSS モジュールに対する最小の型宣言。
declare module "*.css";
