import AsyncStorage from "@react-native-async-storage/async-storage";
import { reportSilentError } from "./errorReporter";

export type AppSettings = {
  /** false にするとシェイクで抽選しない（タップのみ） */
  shakeEnabled: boolean;
  /** true にすると OS 設定に関わらずアニメーションを抑制する */
  forceReducedMotion: boolean;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  shakeEnabled: true,
  forceReducedMotion: false,
};

const STORAGE_KEY = "app_settings_v1";

function reportSettingsError(operation: string, error: unknown): void {
  reportSilentError(`[AppSettingsStorage:${operation}]`, error, {
    source: "AppSettingsStorage",
    operation,
  });
}

function isAppSettings(value: unknown): value is AppSettings {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.shakeEnabled === "boolean" && typeof v.forceReducedMotion === "boolean";
}

/**
 * 設定を取得する。未保存・破損時はデフォルトを返す。
 */
export async function getAppSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw == null) return DEFAULT_APP_SETTINGS;
    const parsed: unknown = JSON.parse(raw);
    if (!isAppSettings(parsed)) return DEFAULT_APP_SETTINGS;
    return parsed;
  } catch (error) {
    reportSettingsError("getAppSettings", error);
    return DEFAULT_APP_SETTINGS;
  }
}

/**
 * 設定を保存する。失敗してもユーザー通知は行わない（silent）。
 */
export async function setAppSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    reportSettingsError("setAppSettings", error);
  }
}
