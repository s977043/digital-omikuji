import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const appVariant = process.env.APP_VARIANT || 'development';

  let name = 'おみくじ (Dev)';
  let bundleIdentifier = 'com.yourname.omikujidev';

  if (appVariant === 'production') {
    name = '2026 おみくじ';
    bundleIdentifier = 'com.yourname.omikuji';
  } else if (appVariant === 'preview') {
    name = 'おみくじ (Preview)';
    bundleIdentifier = 'com.yourname.omikujipreview';
  }

  return {
    ...config,
    name,
    slug: 'digital-omikuji',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/shrine_background.png',
      resizeMode: 'cover',
      backgroundColor: '#1e293b',
    },
    ios: {
      ...config.ios,
      bundleIdentifier,
      supportsTablet: true,
    },
    android: {
      ...config.android,
      package: bundleIdentifier,
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      bundler: 'metro',
      favicon: './assets/icon.png',
    },
    plugins: ['expo-router'],
    extra: {
      appVariant,
      eas: {
        projectId: 'your-project-id',
      },
    },
  };
};
