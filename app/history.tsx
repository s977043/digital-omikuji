import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { MotiView } from "moti";
import {
  getHistory,
  clearHistory,
  HistoryEntry,
} from "../utils/HistoryStorage";
import { VersionDisplay } from "../components/VersionDisplay";

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

  const handleClearHistory = () => {
    Alert.alert("履歴を削除", "本当にすべての履歴を削除しますか？", [
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
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: HistoryEntry;
    index: number;
  }) => (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ delay: index * 50 }}
      className="bg-white/10 rounded-xl p-4 mb-3 border border-white/20"
    >
      <View className="flex-row justify-between items-center">
        <Text
          className="text-3xl font-shippori-bold"
          style={{ color: item.color }}
        >
          {item.fortuneParams.title}
        </Text>
        <Text className="text-white/60 text-xs">
          {formatDate(item.createdAt)}
        </Text>
      </View>
      <Text className="text-white/80 mt-2 font-shippori text-sm">
        {item.fortuneParams.description}
      </Text>
    </MotiView>
  );

  return (
    <View className="flex-1 bg-slate-900 p-4">
      {/* ヘッダー */}
      <View className="flex-row justify-between items-center mb-6 pt-10">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-lg">← 戻る</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-shippori-bold">運勢手帳</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
            <Text className="text-red-400 text-sm">全削除</Text>
          </TouchableOpacity>
        )}
        {history.length === 0 && <View className="w-12" />}
      </View>

      {/* リスト */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-white/60">読み込み中...</Text>
        </View>
      ) : history.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-6xl mb-4">📜</Text>
          <Text className="text-white/60 text-center">
            まだ履歴がありません。{"\n"}おみくじを引いてみましょう！
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* デプロイバージョン表示 */}
      <VersionDisplay />
    </View>
  );
}
