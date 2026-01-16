import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { MotiView } from "moti";
import { HistoryEntry } from "../utils/HistoryStorage";
import { useTranslation } from "react-i18next";

interface HistoryListProps {
  history: HistoryEntry[];
  onDelete: (id: string) => void;
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

const HistoryItem = ({
  item,
  index,
  onDelete,
}: {
  item: HistoryEntry;
  index: number;
  onDelete: (id: string) => void;
}) => {
  const { t } = useTranslation();
  const fortuneTitle = t(`fortune.levels.${item.level}`);
  const fortuneMessages = t(`fortune.messages.${item.level}`, {
    returnObjects: true,
  });
  const fortuneMessage = Array.isArray(fortuneMessages)
    ? fortuneMessages[item.messageIndex] || fortuneMessages[0]
    : String(fortuneMessages);

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 50 }}
      className="bg-white/70 rounded-sm p-5 mb-6 shadow-sm border border-stone-200/50 relative"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      }}
    >
      <View className="flex-row justify-between items-start mb-3">
        {/* Hanko (Stamp) Style Title */}
        <View
          className="px-2 py-1 border-2 rotate-[-5deg]"
          style={{
            borderColor: "#b22222",
            backgroundColor: "transparent",
            borderRadius: 4,
          }}
        >
          <Text className="text-xl font-shippori-bold" style={{ color: "#b22222" }}>
            {fortuneTitle}
          </Text>
        </View>

        <View className="items-end flex-row">
          <View className="items-end mr-3">
            <Text className="text-stone-600 text-[10px] font-shippori leading-none mb-1">
              {formatDate(item.createdAt).split(" ")[0]}
            </Text>
            <Text className="text-stone-400 text-[9px] font-shippori leading-none">
              {formatDate(item.createdAt).split(" ")[1]}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            className="w-8 h-8 items-center justify-center rounded-full bg-stone-100 border border-stone-200"
            accessibilityLabel="この履歴を削除"
          >
            <Text className="text-stone-400 text-xs text-center">✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Message with Lined Paper Effect */}
      <View className="mt-1 relative">
        <View className="absolute inset-0 border-t border-stone-200" style={{ marginTop: 24 }} />
        <View className="absolute inset-0 border-t border-stone-200" style={{ marginTop: 48 }} />

        <Text
          className="text-stone-800 font-shippori text-sm leading-6"
          style={{ minHeight: 48 }}
        >
          {fortuneMessage}
        </Text>
      </View>
    </MotiView>
  );
};

export const HistoryList = ({ history, onDelete }: HistoryListProps) => {
  const { t } = useTranslation();

  if (history.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Image
          source={require("../assets/empty_history.png")}
          className="w-32 h-32 mb-4 opacity-60"
          resizeMode="contain"
        />
        <Text className="text-stone-400 font-shippori text-center">{t("history.empty")}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={history}
      renderItem={({ item, index }) => (
        <HistoryItem item={item} index={index} onDelete={onDelete} />
      )}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32, paddingTop: 4 }}
    />
  );
};
