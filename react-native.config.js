module.exports = {
  dependencies: {
    // Keep the legacy core package disabled; RNWorklets itself must stay linked for Reanimated v4
    "react-native-worklets-core": {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
};
