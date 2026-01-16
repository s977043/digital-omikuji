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
import {
  getHistory,
  clearHistory,
  HistoryEntry,
} from "../utils/HistoryStorage";
import { HistoryList } from "../components/HistoryList";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

export default function HistoryScreen() {
  const { t } = useTranslation();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/");
  };

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    const data = await getHistory();
    setHistory(data);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const confirmClearHistory = () => {
    if (history.length === 0) return;
    Alert.alert(
      t("history.deleteConfirmTitle"),
      t("history.deleteConfirmMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("history.deleteAll"),
          style: "destructive",
          onPress: handleClearHistory,
        },
      ]
    );
  };

  const handleClearHistory = async () => {
    await clearHistory();
    setHistory([]);
  };

  return (
    <View className="flex-1 bg-[#2d1e12]">
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "card",
        }}
      />
      <StatusBar style="light" />

      {/* --- Notebook Header (Cover) --- */}
      <View
        className="pt-10 pb-4 px-6 bg-[#3d2b1f] z-10 border-b-2 border-[#1a110a] shadow-xl"
        style={{
          paddingTop: Platform.OS === "android" ? 32 : undefined,
        }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handleBack}
            className="flex-row items-center p-2 -ml-2 rounded-lg bg-black/20 border border-white/10 active:bg-black/40"
            accessibilityLabel={t("common.back")}
            accessibilityRole="button"
          >
            <Text className="text-stone-200 font-bold">
              ← {t("common.back")}
            </Text>
          </TouchableOpacity>
          <View className="items-center absolute left-0 right-0 -z-10">
            <Text className="text-stone-100 font-shippori-bold text-2xl tracking-[0.3em] drop-shadow-sm">
              {t("history.title")}
            </Text>
          </View>
          {history.length > 0 && (
            <TouchableOpacity
              onPress={confirmClearHistory}
              className="px-3 py-1.5 bg-red-950/40 border border-red-500/30 rounded-md active:bg-red-900/60"
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

      {/* --- Diary Pages --- */}
      <View className="flex-1 relative bg-[#fdfaf5]">
        <ImageBackground
          source={require("../assets/diary_paper.png")}
          className="absolute inset-0"
          style={{ opacity: 0.8 }}
          resizeMode="repeat"
        />
        <View className="flex-1 px-5">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-stone-500 font-shippori">{t("common.loading")}</Text>
            </View>
          ) : (
            <HistoryList history={history} />
          )}
        </View>
      </View>

    </View>
  );
}
