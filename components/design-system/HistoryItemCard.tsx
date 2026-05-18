import { Pressable, Text, View } from "react-native";
import { HistoryEntry } from "../../utils/HistoryStorage";
import { getComponentTokens, getStringToken } from "../../design-system";
import { getFortuneLevelColor } from "../../design-system/fortuneTokens";
import { isOmikujiResult } from "../../types/omikuji";
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
  onPress?: () => void;
}

export function HistoryItemCard({
  item,
  fortuneTitle,
  fortuneMessage,
  onPress,
}: HistoryItemCardProps) {
  const tokens = getComponentTokens<{
    metaColor: string;
    bodyColor: string;
  }>("history.item");
  const ritualBodyFont = getStringToken("primitive.typography.family.ritualBody");
  // 現状は omikuji 種別のみだが、将来の占い種別追加に備えて型ガードで分岐
  // omikuji 以外のフォールバック色は semantic トークンから取得（raw HEX は使わない）
  const fortuneColor = isOmikujiResult(item)
    ? getFortuneLevelColor(item.level)
    : getStringToken("semantic.text.primary");

  const formattedDate = formatDate(item.createdAt);
  // スクリーンリーダーでは「大吉。2026年4月11日 09:30。最高の運気です。」のように読み上げる
  const combinedA11yLabel = `${fortuneTitle}。${formattedDate}。${fortuneMessage}`;

  const cardContent = (
    <>
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
          {formattedDate}
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
    </>
  );

  if (!onPress) {
    return (
      <SurfaceCard
        variant="glassCard"
        accessible
        accessibilityLabel={combinedA11yLabel}
        accessibilityRole="summary"
      >
        {cardContent}
      </SurfaceCard>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={combinedA11yLabel}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <SurfaceCard variant="glassCard">{cardContent}</SurfaceCard>
    </Pressable>
  );
}
