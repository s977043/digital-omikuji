import type { TFunction } from "i18next";

const APP_URL = "https://digital-omikuji.vercel.app";

interface ShareTextParams {
  title: string;
  description: string;
}

/** Builds localized share copy while preserving the displayed fortune. */
export function buildShareText(t: TFunction, params: ShareTextParams): string {
  const url = `${APP_URL}?utm_source=share&utm_campaign=omikuji`;
  return t("fortune.shareMessage", { ...params, url });
}
