import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { getHistory, clearHistory, HistoryEntry } from "../utils/HistoryStorage";
import { VersionDisplay } from "../components/VersionDisplay";
import { HistoryList } from "../components/HistoryList";

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleClearHistory = async () => {
    if (Platform.OS === "web") {
      // Web では window.confirm を使用
      const confirmed = window.confirm("本当に全ての履歴を削除しますか？");
      if (confirmed) {
        await clearHistory();
        setHistory([]);
      }
    } else {
      // ネイティブでは Alert.alert を使用
      Alert.alert("履歴の削除", "本当に全ての履歴を削除しますか？", [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            await clearHistory();
            setHistory([]);
          },
        },
      ]);
    }
  };

  return (
    <View className="flex-1 bg-slate-900 p-4">
      {/* ヘッダー */}
      <View className="flex-row justify-between items-center mb-6 pt-10">
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
        >
          <Text className="text-white text-lg">戻る</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-shippori-bold">履歴</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
            <Text className="text-red-400 text-sm">全て削除</Text>
          </TouchableOpacity>
        )}
        {history.length === 0 && <View className="w-12" />}
      </View>

      {/* リスト */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-white/60">読み込み中...</Text>
        </View>
      ) : (
        <HistoryList history={history} />
      )}

      {/* デプロイバージョン表示 */}
      <VersionDisplay />
    </View>
  );
}
