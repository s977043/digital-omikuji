import React, { useRef } from "react";
import { Platform, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFortuneInteraction } from "../../hooks/useFortuneInteraction";
import { OmikujiResult } from "../../types/omikuji";
import { executeShare } from "../../utils/shareUtils";
import { Button } from "./Button";
import { MotionView } from "./MotionView";
import { SurfaceCard } from "./SurfaceCard";
import { TiedCompleteView } from "./TiedCompleteView";
import { getComponentTokens, getStringToken } from "../../design-system";
import { COMPACT_HEIGHT_BREAKPOINT } from "../../constants/layout";

export interface FortuneDetailEntry {
  key: string;
  label: string;
  value: string;
}

interface PaperResultCardProps {
  fortune: OmikujiResult;
  fortuneTitle: string;
  fortuneMessage: string;
  detailEntries: FortuneDetailEntry[];
  shareText: string;
  onReset: () => void;
  reducedMotion?: boolean;
}

export function PaperResultCard({
  fortune,
  fortuneTitle,
  fortuneMessage,
  detailEntries,
  shareText,
  onReset,
  reducedMotion = false,
}: PaperResultCardProps) {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const cardRef = useRef<View>(null);
  const { exitAnimation, showTiedComplete, handleTie, handleKeep } = useFortuneInteraction({
    reducedMotion,
    onReset,
  });

  const resultTokens = getComponentTokens<{
    titleColor: string;
    bodyColor: string;
    trimColor: string;
    accentColor: string;
  }>("result.paperResult");
  const fortuneColor = getStringToken(`semantic.fortune.level.${fortune.level}`);
  const isCompactHeight = height < COMPACT_HEIGHT_BREAKPOINT;
  const actionButtonStyle = {
    minHeight: isCompactHeight ? 48 : 56,
    paddingVertical: isCompactHeight ? 10 : 12,
  };

  const handleShare = () =>
    executeShare({
      shareText,
      cardRef,
      shareTitle: t("fortune.shareTitle"),
      backgroundColor: getStringToken("semantic.surface.document.panel"),
    });

  if (showTiedComplete) {
    return <TiedCompleteView onClose={onReset} />;
  }

  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "transparent",
        paddingHorizontal: 16,
        paddingVertical: isCompactHeight ? 12 : 24,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MotionView
        from={{ opacity: 0, translateY: 24, scale: 0.96 }}
        animate={{
          opacity: exitAnimation ? 0 : 1,
          translateY: exitAnimation === "keep" ? 120 : exitAnimation === "tie" ? -80 : 0,
          scale: exitAnimation ? 0.92 : 1,
          rotateZ: exitAnimation === "tie" ? "12deg" : exitAnimation === "keep" ? "-8deg" : "0deg",
        }}
        transition={{ type: "timing", duration: reducedMotion ? 220 : 500 }}
        style={{
          width: "100%",
          maxWidth: 520,
          maxHeight: "100%",
          flexShrink: 1,
          alignSelf: "center",
        }}
      >
        <View
          ref={cardRef}
          testID="share-card"
          {...(Platform.OS === "web" ? { "data-testid": "share-card" } : {})}
        >
          <SurfaceCard
            variant="paperCard"
            style={{
              overflow: "hidden",
              paddingTop: 0,
              paddingHorizontal: 0,
              paddingBottom: 0,
              maxHeight: "100%",
              flexShrink: 1,
            }}
          >
            <View
              style={{
                backgroundColor: resultTokens.trimColor,
                paddingVertical: isCompactHeight ? 10 : 14,
                paddingHorizontal: 20,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: isCompactHeight ? 12 : 13,
                  letterSpacing: isCompactHeight ? 2.2 : 3,
                  fontFamily: getStringToken("primitive.typography.family.ritual"),
                }}
              >
                新春デジタルおみくじ
              </Text>
            </View>

            <ScrollView
              style={{ flexShrink: 1 }}
              contentContainerStyle={{
                padding: isCompactHeight ? 16 : 20,
                paddingBottom: isCompactHeight ? 16 : 24,
              }}
              showsVerticalScrollIndicator
            >
              <Text
                style={{
                  fontSize: isCompactHeight ? 42 : 54,
                  textAlign: "center",
                  color: fortuneColor,
                  fontFamily: getStringToken("primitive.typography.family.ritual"),
                }}
              >
                {fortuneTitle}
              </Text>
              <Text
                style={{
                  marginTop: isCompactHeight ? 8 : 10,
                  color: resultTokens.bodyColor,
                  fontSize: isCompactHeight ? 15 : 17,
                  textAlign: "center",
                  lineHeight: isCompactHeight ? 24 : 28,
                  fontFamily: getStringToken("primitive.typography.family.ritualBody"),
                }}
              >
                {fortuneMessage}
              </Text>

              <View
                style={{
                  marginTop: isCompactHeight ? 14 : 20,
                  paddingTop: isCompactHeight ? 14 : 18,
                  borderTopWidth: 1,
                  borderTopColor: "rgba(180, 83, 9, 0.18)",
                  gap: isCompactHeight ? 10 : 14,
                }}
              >
                {detailEntries.map((entry) => (
                  <View
                    key={entry.key}
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        width: 72,
                        color: resultTokens.titleColor,
                        fontWeight: "700",
                      }}
                    >
                      {entry.label}
                    </Text>
                    <Text style={{ flex: 1, color: resultTokens.bodyColor, lineHeight: 23 }}>
                      {entry.value}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View
              style={{
                padding: 16,
                paddingVertical: isCompactHeight ? 12 : 16,
                borderTopWidth: 1,
                borderTopColor: "rgba(180, 83, 9, 0.18)",
                gap: isCompactHeight ? 8 : 10,
              }}
            >
              <Button
                label={t("common.share")}
                onPress={handleShare}
                variant="utilityWarm"
                style={actionButtonStyle}
              />
              <View style={{ flexDirection: "row", gap: isCompactHeight ? 8 : 10 }}>
                <View style={{ flex: 1 }}>
                  <Button
                    label={t("fortune.tie")}
                    onPress={handleTie}
                    variant="secondaryQuiet"
                    style={actionButtonStyle}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    label={t("fortune.keep")}
                    onPress={handleKeep}
                    variant="primaryRitual"
                    style={actionButtonStyle}
                  />
                </View>
              </View>
            </View>
          </SurfaceCard>
        </View>
      </MotionView>
    </View>
  );
}
