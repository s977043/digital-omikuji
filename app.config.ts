import { ExpoConfig, ConfigContext } from "expo/config";

// Constants
const PRIVACY_POLICY_URL = "https://digital-omikuji.vercel.app/privacy-policy";

export default ({ config }: ConfigContext): ExpoConfig => {
  // NODE_ENVがproductionの場合はデフォルトでproductionとして扱う
  const appVariant =
    process.env.APP_VARIANT ||
    (process.env.NODE_ENV === "production" ? "production" : "development");

  let name = "おみくじ (Dev)";
  let bundleIdentifier = "jp.co.digitalomikuji.dev";

  if (appVariant === "production") {
    name = "2026 おみくじ";
    bundleIdentifier = "jp.co.digitalomikuji";
  } else if (appVariant === "preview") {
    name = "おみくじ (Preview)";
    bundleIdentifier = "jp.co.digitalomikuji.preview";
  }

  return {
    ...config,
    name,
    slug: "digital-omikuji",
    version: config.version,
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/shrine_background.png",
      resizeMode: "cover",
      backgroundColor: "#1e293b",
    },
    ios: {
      ...config.ios,
      bundleIdentifier,
      supportsTablet: true,
      infoPlist: {
        CFBundleDisplayName: name,
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      ...config.android,
      package: bundleIdentifier,
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/icon.png",
    },
    plugins: ["expo-router", "expo-localization", "./plugins/withWorklets"],
    extra: {
      ...config.extra,
      appVariant,
      privacyPolicyUrl: PRIVACY_POLICY_URL,
    },
  };
};
