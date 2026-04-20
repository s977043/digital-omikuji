const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

// Use Sentry's Expo config as base for proper source maps
const config = getSentryExpoConfig(__dirname);

// Web bundle から不要な native-only runtime を除外する。
// - react-native-reanimated: MotionView.web.tsx が CSS アニメーションを使う
//   ため worklet runtime は不要。named import (Easing など) は文字列に置換。
// - react-native-view-shot: shareUtils は web では html-to-image を dynamic
//   import しており、view-shot は native 分岐でしか使われない。
const WEB_STUBS = {
  "react-native-reanimated": path.resolve(__dirname, "metro-stubs/reanimated-web.js"),
  "react-native-view-shot": path.resolve(__dirname, "metro-stubs/view-shot-web.js"),
};

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && Object.prototype.hasOwnProperty.call(WEB_STUBS, moduleName)) {
    return {
      type: "sourceFile",
      filePath: WEB_STUBS[moduleName],
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Apply NativeWind configuration
module.exports = withNativeWind(config, { input: "./global.css" });
