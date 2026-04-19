// Minimal shim for react-native-view-shot on web.
//
// shareUtils.ts は Platform.OS==="web" の分岐では html-to-image を dynamic
// import しており react-native-view-shot を使わない。ただしトップレベル
// import が bundle 解決に乗るため、Web 用の空スタブに差し替えて初期 JS
// サイズを削減する。詳細は metro.config.js の WEB_STUBS コメントを参照。

const unsupported = () =>
  Promise.reject(new Error("react-native-view-shot is not supported on web"));

module.exports = {
  captureRef: unsupported,
  captureScreen: unsupported,
  releaseCapture: () => {},
  default: { captureRef: unsupported },
};
