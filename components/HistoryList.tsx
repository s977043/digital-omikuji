import React from "react";
import { View, Text, FlatList } from "react-native";
import { MotiView } from "moti";
import { HistoryEntry } from "../utils/HistoryStorage";

interface HistoryListProps {
  history: HistoryEntry[];
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const HistoryItem = ({ item, index }: { item: HistoryEntry; index: number }) => (
  <MotiView
    from={{ opacity: 0, translateX: -20 }}
    animate={{ opacity: 1, translateX: 0 }}
    transition={{ delay: index * 50 }}
    className="bg-white/10 rounded-xl p-4 mb-3 border border-white/20"
  >
    <View className="flex-row justify-between items-center">
      <Text className="text-3xl font-shippori-bold" style={{ color: item.color }}>
        {item.fortuneParams.title}
      </Text>
      <Text className="text-white/60 text-xs">{formatDate(item.createdAt)}</Text>
    </View>
    <Text className="text-white/80 mt-2 font-shippori text-sm">
      {item.fortuneParams.description}
    </Text>
  </MotiView>
);

export const HistoryList = ({ history }: HistoryListProps) => {
  if (history.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-6xl mb-4">📜</Text>
        <Text className="text-white/60 text-center">まだ履歴がありません</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={history}
      renderItem={({ item, index }) => <HistoryItem item={item} index={index} />}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};
