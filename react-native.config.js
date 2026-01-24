module.exports = {
  dependencies: {
    // worklets-core is disabled for RN 0.76+ compatibility (NativeWind web builds only)
    // react-native-worklets is enabled for react-native-reanimated v4 native linking
    "react-native-worklets-core": {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
};
