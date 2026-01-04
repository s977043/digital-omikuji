import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import ja from "./locales/ja.json";
import en from "./locales/en.json";

// デバイスの言語設定を取得
const deviceLanguage = getLocales()[0]?.languageCode ?? "ja";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      ja: { translation: ja },
      en: { translation: en },
    },
    lng: deviceLanguage, // 初期言語
    fallbackLng: "ja", // フォールバック言語
    interpolation: {
      escapeValue: false, // react already protects from xss
    },
  })
  .catch((err) => {
    console.error("i18n initialization failed", err);
  });

export default i18n;
