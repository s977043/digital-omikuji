import { SplashScreen, Stack } from 'expo-router';
import { useFonts, ShipporiMincho_400Regular, ShipporiMincho_700Bold } from '@expo-google-fonts/shippori-mincho';
import { useEffect } from 'react';
import "../global.css";

// スプラッシュスクリーンを自動的に隠さないように設定
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ShipporiMincho_400Regular,
    ShipporiMincho_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
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
