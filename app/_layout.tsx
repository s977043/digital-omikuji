// Sentry初期化 (エラー監視) - 早期に実行する必要あり
import { initializeSentry, Sentry } from "../utils/sentry";

import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
// バレル import を避け、利用する 2 ウェイトだけサブパス import で取得する。
// バレル import すると Metro が同パッケージ配下の 500/600/800 等の TTF まで
// バンドルに含めてしまい、Web 配信物に約 25MB の死荷重が発生する。
import { ShipporiMincho_400Regular } from "@expo-google-fonts/shippori-mincho/400Regular";
import { ShipporiMincho_700Bold } from "@expo-google-fonts/shippori-mincho/700Bold";
import { useEffect } from "react";
import { logVersionInfo } from "../utils/VersionInfo";
import "../global.css";
import "../i18n";
initializeSentry(); // i18n initialization

// スプラッシュスクリーンを自動的に隠さないように設定
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const [fontsLoaded] = useFonts({
    ShipporiMincho_400Regular,
    ShipporiMincho_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      // デプロイバージョンをコンソールに出力
      logVersionInfo();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

// Sentry.wrapでエラー境界をラップ
export default Sentry.wrap(RootLayout);
