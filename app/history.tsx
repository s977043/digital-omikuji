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
import { MotiView } from "moti";
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
  const [showConfirm, setShowConfirm] = useState(false);

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
    setShowConfirm(true);
  };

  const handleClearHistory = async () => {
    await clearHistory();
    setHistory([]);
    setShowConfirm(false);
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
            className="flex-row items-center px-4 py-2 rounded-lg bg-black/20 border border-white/10 active:bg-black/40"
            accessibilityLabel={t("common.back")}
            accessibilityRole="button"
          >
            <Text className="text-stone-200 font-shippori-bold leading-none">
              {t("common.back")}
            </Text>
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-stone-100 font-shippori-bold text-2xl tracking-[0.3em] drop-shadow-sm">
              {t("history.title")}
            </Text>
          </View>

          <View className="w-[84px] items-end">
            {history.length > 0 && (
              <TouchableOpacity
                onPress={confirmClearHistory}
                className="px-3 py-1.5 bg-red-900/60 border border-red-500/40 rounded-md active:bg-red-800/80 shadow-sm"
                accessibilityLabel={t("history.deleteAll")}
                accessibilityRole="button"
              >
                <Text className="text-red-100 text-xs font-shippori-bold">
                  {t("history.deleteAll")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
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

      {/* --- Confirmation Modal --- */}
      {showConfirm && (
        <View className="absolute inset-0 bg-black/80 z-[100] items-center justify-center px-8">
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#fdfaf5] p-8 rounded-sm border-2 border-stone-300 w-full max-w-sm"
          >
            <Text className="text-stone-800 font-shippori-bold text-xl mb-4 text-center tracking-widest">
              {t("history.deleteConfirmTitle")}
            </Text>
            <Text className="text-stone-600 font-shippori text-sm mb-8 text-center leading-relaxed">
              {t("history.deleteConfirmMessage")}
            </Text>
            <View className="flex-row justify-between gap-4">
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-stone-200 rounded-sm active:bg-stone-300"
              >
                <Text className="text-stone-600 font-shippori-bold text-center leading-none">
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleClearHistory}
                className="flex-1 py-3 bg-red-900 rounded-sm active:bg-red-800 shadow-sm"
              >
                <Text className="text-white font-shippori-bold text-center leading-none">
                  {t("history.deleteAll")}
                </Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        </View>
      )}
    </View>
  );
}
