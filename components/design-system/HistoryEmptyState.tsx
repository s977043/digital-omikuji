import React from "react";
import { Image, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { getStringToken } from "../../design-system";

export function HistoryEmptyState() {
  const { t } = useTranslation();

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}
    >
      <View
        style={{
          width: 160,
          height: 160,
          borderRadius: 80,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: getStringToken("semantic.surface.experience.historyPlaceholder"),
          borderWidth: 1,
          borderColor: getStringToken("semantic.border.soft"),
          marginBottom: 20,
        }}
      >
        <Image
          source={require("../../assets/empty_history.webp")}
          style={{ width: 92, height: 92, opacity: 0.8 }}
          resizeMode="contain"
          accessible={false}
        />
      </View>
      <Text
        style={{
          color: getStringToken("semantic.text.muted"),
          fontSize: 18,
          fontFamily: getStringToken("primitive.typography.family.ritualBody"),
          textAlign: "center",
          lineHeight: 28,
        }}
      >
        {t("history.empty")}
      </Text>
    </View>
  );
}
