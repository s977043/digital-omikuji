import "i18next";
import ja from "../i18n/locales/ja.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof ja;
    };
  }
}
