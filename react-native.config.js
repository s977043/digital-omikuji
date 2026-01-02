module.exports = {
  dependencies: {
    'react-native-worklets-core': {
      platforms: {
        android: null, // Disable autolinking on Android to avoid build errors with RN 0.76
        ios: null,     // Disable autolinking on iOS as well
      },
    },
  },
};
