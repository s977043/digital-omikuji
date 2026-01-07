// ポリフィル: React Native環境でのuuid生成に必要
import "react-native-get-random-values";

// Sentry初期化 (エラー監視) - 早期に実行する必要あり
import { initializeSentry, Sentry } from "../utils/sentry";
initializeSentry();

import { SplashScreen, Stack } from "expo-router";
import {
  useFonts,
  ShipporiMincho_400Regular,
  ShipporiMincho_700Bold,
} from "@expo-google-fonts/shippori-mincho";
import { useEffect } from "react";
import { logVersionInfo } from "../utils/VersionInfo";
import "../global.css";
import "../i18n"; // i18n initialization

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
