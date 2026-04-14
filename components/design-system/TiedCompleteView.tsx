import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import { getStringToken } from "../../design-system";

interface TiedCompleteViewProps {
  onClose: () => void;
}

/**
 * おみくじ結果を「結ぶ」アクション完了後に表示される完了画面。
 *
 * 神社で御籤を結ぶ行為をモチーフにした装飾（🌸 + 🌿 + 御神籤プレート）と
 * 感謝メッセージを表示し、閉じるボタンで呼び出し元に戻る。
 */
export function TiedCompleteView({ onClose }: TiedCompleteViewProps) {
  const { t } = useTranslation();
  const ritualFontFamily = getStringToken("primitive.typography.family.ritual");

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}
    >
      <Text
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ fontSize: 64, marginBottom: 12 }}
      >
        🌸
      </Text>
      <View
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ flexDirection: "row", alignItems: "flex-start" }}
      >
        <Text style={{ fontSize: 40 }}>🌿</Text>
        <View
          style={{
            backgroundColor: getStringToken("semantic.surface.experience.tiedPaper"),
            paddingHorizontal: 12,
            paddingVertical: 16,
            marginHorizontal: 4,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: getStringToken("semantic.border.experience.tiedPaper"),
          }}
        >
          <Text
            style={{
              color: getStringToken("semantic.text.experience.tiedHeading"),
              fontSize: 13,
              textAlign: "center",
              fontFamily: ritualFontFamily,
            }}
          >
            {"御\n神\n籤"}
          </Text>
        </View>
        <Text style={{ fontSize: 40 }}>🌿</Text>
      </View>
      <Text
        accessibilityRole="header"
        style={{
          color: "white",
          fontSize: 22,
          textAlign: "center",
          marginTop: 24,
          fontFamily: ritualFontFamily,
        }}
      >
        {t("fortune.tiedTitle")}
      </Text>
      <Text
        style={{
          color: getStringToken("semantic.text.muted"),
          textAlign: "center",
          marginTop: 10,
          lineHeight: 24,
        }}
      >
        {t("fortune.tiedMessage")}
      </Text>
      <Button
        label={t("common.close")}
        onPress={onClose}
        variant="secondaryQuiet"
        style={{ marginTop: 24, minWidth: 180 }}
      />
    </View>
  );
}
