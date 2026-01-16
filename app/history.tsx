import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import { router, useFocusEffect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { getHistory, clearHistory, HistoryEntry } from "../utils/HistoryStorage";
import { HistoryList } from "../components/HistoryList";
import { useTranslation } from "react-i18next";

export default function HistoryScreen() {
  const { t } = useTranslation();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    // 直接URL遷移で履歴ページを開いた場合のフォールバック
    router.replace("/");
  };

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    const data = await getHistory();
    setHistory(data);
    setIsLoading(false);
  }, []);

  // 画面がフォーカスされるたびに履歴を再読み込み
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const confirmClearHistory = () => {
    if (history.length === 0) return;
    handleClearHistory();
  };

  const handleClearHistory = async () => {
    await clearHistory();
    setHistory([]);
  };

  return (
    <View className="flex-1 bg-slate-900">
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "card",
        }}
      />
      <StatusBar style="light" />

      {/* --- Header --- */}
      <View
        className="pt-10 pb-4 px-6 bg-slate-900 z-10 border-b border-white/10"
        style={{
          paddingTop: Platform.OS === "android" ? 32 : undefined, // Safe area for Android (控えめに)
        }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handleBack}
            className="flex-row items-center p-2 -ml-2 rounded-full active:bg-white/10"
            accessibilityLabel={t("common.back")}
            accessibilityRole="button"
          >
            <Text className="text-white font-bold text-lg">
              {t("common.back")}
            </Text>
          </TouchableOpacity>
          <Text className="text-white font-shippori-bold text-xl tracking-widest absolute left-0 right-0 text-center pointer-events-none z-0">
            {t("history.title")}
          </Text>
          {history.length > 0 && (
            <TouchableOpacity
              onPress={confirmClearHistory}
              className="px-3 py-1 bg-red-900/50 border border-red-500/50 rounded-full active:bg-red-800/80"
              accessibilityLabel={t("history.deleteAll")}
              accessibilityRole="button"
            >
              <Text className="text-red-200 text-xs font-bold">
                {t("history.deleteAll")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* --- History List --- */}
      <View className="flex-1 bg-slate-50/5 relative">
        <ImageBackground
          source={require("../assets/shrine_background.png")}
          className="flex-1"
          style={{ opacity: 0.3 }}
          resizeMode="cover"
        />
        <View className="absolute inset-0 px-6 pt-6">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-white/60">{t("common.loading")}</Text>
            </View>
          ) : (
            <HistoryList history={history} />
          )}
        </View>
      </View>

    </View>
  );
}
