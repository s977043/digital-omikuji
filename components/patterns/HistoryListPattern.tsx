import React from "react";
import { FlatList, View } from "react-native";
import { useTranslation } from "react-i18next";
import { HistoryEntry } from "../../utils/HistoryStorage";
import { getFortuneText } from "../../domain";
import { HistoryEmptyState } from "../design-system/HistoryEmptyState";
import { HistoryItemCard } from "../design-system/HistoryItemCard";

interface HistoryListPatternProps {
  history: HistoryEntry[];
  emptyAction?: React.ReactNode;
}

export function HistoryListPattern({ history, emptyAction }: HistoryListPatternProps) {
  const { t } = useTranslation();

  if (history.length === 0) {
    return <HistoryEmptyState action={emptyAction} />;
  }

  return (
    <FlatList
      data={history}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const { title, message } = getFortuneText(t, item.level, item.messageIndex);
        return (
          <View style={{ marginBottom: 12 }}>
            <HistoryItemCard item={item} fortuneTitle={title} fortuneMessage={message} />
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}
