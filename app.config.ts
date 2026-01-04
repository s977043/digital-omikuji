import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const appVariant = process.env.APP_VARIANT || "development";

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
    version: "1.0.0",
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
        NSPhotoLibraryUsageDescription:
          "おみくじ結果を画像として保存するために写真ライブラリへのアクセスが必要です",
        NSPhotoLibraryAddUsageDescription:
          "おみくじ結果を画像として保存するために写真ライブラリへの書き込みアクセスが必要です",
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
    plugins: ["expo-router"],
    extra: {
      ...config.extra,
      appVariant,
      privacyPolicyUrl: "https://digital-omikuji.vercel.app/privacy-policy",
    },
  };
};
