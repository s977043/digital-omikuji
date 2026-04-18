import { useCallback, useEffect, useState } from "react";
import {
  AppSettings,
  DEFAULT_APP_SETTINGS,
  getAppSettings,
  setAppSettings,
} from "../utils/AppSettingsStorage";

/**
 * アプリ設定の取得・更新を担う React フック。
 *
 * - 初回マウントで AsyncStorage から読み込み、以降は state を真とする
 * - `update` は楽観的に state を更新したあと永続化する（失敗時の回復は
 *   行わない＝設定は失っても致命的でないため）
 */
export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAppSettings().then((loaded) => {
      if (cancelled) return;
      setSettings(loaded);
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(
    async (patch: Partial<AppSettings>) => {
      const next = { ...settings, ...patch };
      setSettings(next);
      await setAppSettings(next);
    },
    [settings]
  );

  return { settings, update, hydrated };
}
