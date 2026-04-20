// Minimal shim for react-native-reanimated on web.
//
// MotionView.web.tsx は CSS ベースのアニメーションに置き換えているため
// reanimated の worklet runtime は Web で不要。named import (主に `Easing`)
// が解決できるよう、CSS の easing 文字列を返す最小スタブを提供する。
// 詳細は metro.config.js の WEB_STUBS コメントを参照。

const linear = "linear";
const ease = "ease";
const easeIn = "ease-in";
const easeOut = "ease-out";
const easeInOut = "ease-in-out";

const Easing = {
  linear,
  ease,
  quad: () => linear,
  cubic: () => linear,
  poly: () => linear,
  sin: () => easeInOut,
  circle: () => easeInOut,
  exp: () => easeInOut,
  elastic: () => easeInOut,
  back: () => easeInOut,
  bounce: () => easeInOut,
  bezier: () => linear,
  in: () => easeIn,
  out: () => easeOut,
  inOut: () => easeInOut,
};

module.exports = {
  Easing,
  default: {},
};
