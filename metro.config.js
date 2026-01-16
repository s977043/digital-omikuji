const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

// Use Sentry's Expo config as base for proper source maps
const config = getSentryExpoConfig(__dirname);

// Fix tslib ESM/CJS interop issue for moti/framer-motion
// Force tslib to use CommonJS version instead of ESM modules/index.js
const originalResolveRequest = config.resolver?.resolveRequest;
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // Redirect tslib to its CJS entry point
    if (moduleName === "tslib") {
      return {
        filePath: path.resolve(__dirname, "node_modules/tslib/tslib.js"),
        type: "sourceFile",
      };
    }
    // Fall back to default resolution
    if (originalResolveRequest) {
      return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

// Apply NativeWind configuration
module.exports = withNativeWind(config, { input: "./global.css" });
