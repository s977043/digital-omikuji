import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
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
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

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
    setIsDeleteModalVisible(true);
  };

  const handleClearHistory = async () => {
    await clearHistory();
    setHistory([]);
    setIsDeleteModalVisible(false);
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
        className="pt-16 pb-6 px-6 bg-slate-900 z-10 border-b border-white/10"
        style={{
          paddingTop: Platform.OS === "android" ? 40 : undefined, // Safe area for Android
        }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
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
        <View className="absolute inset-0">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-white/60">{t("common.loading")}</Text>
            </View>
          ) : (
            <HistoryList history={history} />
          )}
        </View>
      </View>

      {/* --- Custom Delete Confirmation Modal (View Overlay for Web Compat) --- */}
      {isDeleteModalVisible && (
        <View
          className="absolute inset-0 flex-1 justify-center items-center bg-black/70 px-4"
          style={{ zIndex: 9999, elevation: 10 }}
        >
          <View className="w-full max-w-sm bg-[#FDF5E6] rounded-2xl p-6 items-center shadow-2xl border-4 border-double border-amber-200">
            {/* Visual Element */}
            <View className="bg-white/50 p-4 rounded-full mb-4 border border-amber-100">
              <Image
                source={require("../assets/empty_history.png")}
                className="w-16 h-16 opacity-80"
                resizeMode="contain"
              />
            </View>

            <Text className="text-xl font-shippori-bold text-slate-800 mb-2 tracking-widest text-center">
              {t("history.deleteConfirmTitle")}
            </Text>
            <Text className="text-slate-600 text-sm font-shippori text-center mb-8 leading-relaxed">
              {t("history.deleteConfirmMessage")}
            </Text>

            <View className="flex-row gap-3 w-full">
              <TouchableOpacity
                onPress={() => setIsDeleteModalVisible(false)}
                className="flex-1 py-3 bg-slate-200 rounded-full items-center active:bg-slate-300"
                accessibilityLabel={t("common.cancel")}
                accessibilityRole="button"
              >
                <Text className="text-slate-700 font-bold">
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleClearHistory}
                className="flex-1 py-3 bg-red-600 rounded-full items-center shadow-md active:bg-red-700"
                accessibilityLabel={t("common.delete")}
                accessibilityRole="button"
              >
                <Text className="text-white font-bold">{t("common.delete")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
