import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const appVariant = process.env.APP_VARIANT || 'development';
  // 'development', 'preview', 'production'

  let name = 'Omikuji (Dev)';
  let bundleIdentifier = 'com.yourname.omikujidev';

  if (appVariant === 'production') {
    name = '2026 Omikuji';
    bundleIdentifier = 'com.yourname.omikuji';
  } else if (appVariant === 'preview') {
    name = 'Omikuji (Preview)';
    bundleIdentifier = 'com.yourname.omikujipreview';
  }

  return {
    ...config,
    name,
    slug: 'digital-omikuji',
    ios: {
      ...config.ios,
      bundleIdentifier,
    },
    android: {
      ...config.android,
      package: bundleIdentifier,
    },
    extra: {
      appVariant,
      eas: {
        projectId: "your-project-id",
      }
    },
  };
};
