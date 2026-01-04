module.exports = {
  dependencies: {
    // Both worklets packages need to be disabled for RN 0.76+ compatibility
    // They are only used by NativeWind for web builds (Babel plugin)
    "react-native-worklets": {
      platforms: {
        android: null,
        ios: null,
      },
    },
    "react-native-worklets-core": {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
};
