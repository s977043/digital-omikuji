import React from "react";
import { FlatList, View } from "react-native";
import { HistoryEntry } from "../../utils/HistoryStorage";
import { HistoryEmptyState } from "../design-system/HistoryEmptyState";
import { HistoryItemCard } from "../design-system/HistoryItemCard";

interface HistoryListPatternProps {
  history: HistoryEntry[];
}

export function HistoryListPattern({ history }: HistoryListPatternProps) {
  if (history.length === 0) {
    return <HistoryEmptyState />;
  }

  return (
    <FlatList
      data={history}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ marginBottom: 12 }}>
          <HistoryItemCard item={item} />
        </View>
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}
