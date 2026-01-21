const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { withNativeWind } = require("nativewind/metro");

// Use Sentry's Expo config as base for proper source maps
const config = getSentryExpoConfig(__dirname);

// Apply NativeWind configuration
module.exports = withNativeWind(config, { input: "./global.css" });
