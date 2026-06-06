import { ExpoConfig, ConfigContext } from "expo/config";

// 静的な Expo 設定の SSOT は app.json。
// app.config.ts は APP_VARIANT(dev/preview/production) に応じた
// 表示名と package/bundleIdentifier の上書きのみを担い、app.json の
// プラグイン・権限・splash 等はそのまま継承する（spread で保持）。
const BASE_PACKAGE = "com.s977043.digitalomikuji";
const PRIVACY_POLICY_URL = "https://digital-omikuji.vercel.app/privacy-policy";

export default ({ config }: ConfigContext): ExpoConfig => {
  const appVariant = process.env.APP_VARIANT ?? "development";

  let name = "おみくじ (Dev)";
  let packageName = `${BASE_PACKAGE}.dev`;

  if (appVariant === "production") {
    name = config.name ?? "デジタルおみくじ";
    packageName = BASE_PACKAGE;
  } else if (appVariant === "preview") {
    name = "おみくじ (Preview)";
    packageName = `${BASE_PACKAGE}.preview`;
  }

  return {
    ...config,
    name,
    slug: config.slug ?? "digital-omikuji",
    ios: {
      ...config.ios,
      bundleIdentifier: packageName,
    },
    android: {
      ...config.android,
      package: packageName,
    },
    extra: {
      ...config.extra,
      appVariant,
      privacyPolicyUrl: PRIVACY_POLICY_URL,
    },
  };
};
