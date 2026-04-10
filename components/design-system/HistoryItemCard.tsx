import React from "react";
import { Text, View } from "react-native";
import { HistoryEntry } from "../../utils/HistoryStorage";
import { getComponentTokens, getStringToken } from "../../design-system";
import { SurfaceCard } from "./SurfaceCard";

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface HistoryItemCardProps {
  item: HistoryEntry;
  fortuneTitle: string;
  fortuneMessage: string;
}

export function HistoryItemCard({ item, fortuneTitle, fortuneMessage }: HistoryItemCardProps) {
  const tokens = getComponentTokens<{
    metaColor: string;
    bodyColor: string;
  }>("history.item");
  const ritualBodyFont = getStringToken("primitive.typography.family.ritualBody");
  const fortuneColor = getStringToken(`semantic.fortune.level.${item.level}`);

  return (
    <SurfaceCard variant="glassCard">
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16 }}>
        <Text
          style={{
            color: fortuneColor,
            fontSize: 30,
            fontFamily: getStringToken("primitive.typography.family.ritual"),
          }}
        >
          {fortuneTitle}
        </Text>
        <Text style={{ color: tokens.metaColor, fontSize: 12, flexShrink: 1, textAlign: "right" }}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
      <Text
        style={{
          color: tokens.bodyColor,
          fontSize: 15,
          lineHeight: 24,
          marginTop: 12,
          fontFamily: ritualBodyFont,
        }}
      >
        {fortuneMessage}
      </Text>
    </SurfaceCard>
  );
}
