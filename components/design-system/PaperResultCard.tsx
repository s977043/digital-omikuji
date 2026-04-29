import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  Share,
  Text,
  ToastAndroid,
  useWindowDimensions,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { DETAIL_KEYS } from "../../data/omikujiData";
import { OmikujiResult } from "../../types/omikuji";
import { buildShareText } from "../../utils/buildShareText";
import { Button } from "./Button";
import { MotionView } from "./MotionView";
import { SurfaceCard } from "./SurfaceCard";
import { getComponentTokens, getStringToken } from "../../design-system";

const ANIMATION_TIMING = {
  tie: 1200,
  keep: 800,
};

interface PaperResultCardProps {
  fortune: OmikujiResult;
  onReset: () => void;
  reducedMotion?: boolean;
}

export function PaperResultCard({ fortune, onReset, reducedMotion = false }: PaperResultCardProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const cardRef = useRef<View>(null);
  const tieTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [exitAnimation, setExitAnimation] = useState<"tie" | "keep" | null>(null);
  const [showTiedComplete, setShowTiedComplete] = useState(false);
  const { t } = useTranslation();

  const resultTokens = getComponentTokens<{
    titleColor: string;
    bodyColor: string;
    trimColor: string;
    accentColor: string;
  }>("result.paperResult");
  const fortuneColor = getStringToken(`semantic.fortune.level.${fortune.level}`);
  const isCompactHeight = height < 720;
  const shellPaddingTop = Math.max(insets.top + 8, isCompactHeight ? 12 : 24);
  const shellPaddingBottom = Math.max(insets.bottom + 12, isCompactHeight ? 12 : 24);
  const scrollPadding = isCompactHeight ? 16 : 20;
  const actionButtonStyle = {
    minHeight: isCompactHeight ? 48 : 56,
    paddingVertical: isCompactHeight ? 10 : 12,
  };

  useEffect(() => {
    return () => {
      if (tieTimerRef.current) clearTimeout(tieTimerRef.current);
      if (keepTimerRef.current) clearTimeout(keepTimerRef.current);
    };
  }, []);

  const fortuneTitle = t(`fortune.levels.${fortune.level}`);
  const fortuneMessages = t(`fortune.messages.${fortune.level}`, {
    returnObjects: true,
  });
  const fortuneMessage = Array.isArray(fortuneMessages)
    ? fortuneMessages[fortune.messageIndex] || fortuneMessages[0]
    : String(fortuneMessages);

  const handleTie = useCallback(() => {
    if (exitAnimation) return;

    if (Platform.OS !== "web" && !reducedMotion) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setExitAnimation("tie");

    if (Platform.OS === "android") {
      ToastAndroid.show(t("fortune.toastTie"), ToastAndroid.SHORT);
    }

    tieTimerRef.current = setTimeout(() => {
      setShowTiedComplete(true);
    }, ANIMATION_TIMING.tie);
  }, [exitAnimation, reducedMotion, t]);

  const handleKeep = useCallback(() => {
    if (exitAnimation) return;

    if (Platform.OS !== "web" && !reducedMotion) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setExitAnimation("keep");

    if (Platform.OS === "android") {
      ToastAndroid.show(t("fortune.toastKeep"), ToastAndroid.SHORT);
    }

    keepTimerRef.current = setTimeout(onReset, ANIMATION_TIMING.keep);
  }, [exitAnimation, onReset, reducedMotion, t]);

  const handleShare = async () => {
    try {
      const message = buildShareText({
        level: fortune.level,
        title: fortuneTitle,
        description: fortuneMessage,
      });

      if (Platform.OS === "web") {
        try {
          const { toPng } = await import("html-to-image");
          const element = globalThis.document?.querySelector?.(
            '[data-testid="share-card"], [testID="share-card"]'
          ) as HTMLElement | null;

          if (element) {
            const dataUrl = await toPng(element, {
              backgroundColor: getStringToken("semantic.surface.document.panel"),
            });
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const file = new File([blob], "omikuji.png", { type: "image/png" });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: t("fortune.shareTitle"),
                text: message,
              });
            } else {
              const link = document.createElement("a");
              link.download = "omikuji.png";
              link.href = dataUrl;
              link.click();
            }
            return;
          }
        } catch (webShareError) {
          console.error("Web sharing failed", webShareError);
        }
      }

      let imageUri: string | undefined;
      if (cardRef.current && Platform.OS !== "web") {
        try {
          imageUri = await captureRef(cardRef, { format: "png", quality: 0.8 });
        } catch (captureError) {
          console.error("Image capture failed", captureError);
        }
      }

      await Share.share(
        {
          message,
          ...(imageUri && Platform.OS === "ios" ? { url: imageUri } : {}),
        },
        {
          ...(imageUri && Platform.OS === "android"
            ? { dialogTitle: t("fortune.shareTitle") }
            : {}),
        }
      );
    } catch (error) {
      console.error("Sharing failed", error);
    }
  };

  if (showTiedComplete) {
    return (
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}
      >
        <Text style={{ fontSize: 64, marginBottom: 12 }}>🌸</Text>
        <View
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ flexDirection: "row", alignItems: "flex-start" }}
        >
          <Text style={{ fontSize: 40 }}>🌿</Text>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.92)",
              paddingHorizontal: 12,
              paddingVertical: 16,
              marginHorizontal: 4,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#FDE68A",
            }}
          >
            <Text
              style={{
                color: "#B91C1C",
                fontSize: 13,
                textAlign: "center",
                fontFamily: getStringToken("primitive.typography.family.ritual"),
              }}
            >
              {"御\n神\n籤"}
            </Text>
          </View>
          <Text style={{ fontSize: 40 }}>🌿</Text>
        </View>
        <Text
          style={{
            color: "white",
            fontSize: 22,
            textAlign: "center",
            marginTop: 24,
            fontFamily: getStringToken("primitive.typography.family.ritual"),
          }}
        >
          {t("fortune.tiedTitle")}
        </Text>
        <Text
          style={{
            color: "rgba(255,255,255,0.72)",
            textAlign: "center",
            marginTop: 10,
            lineHeight: 24,
          }}
        >
          {t("fortune.tiedMessage")}
        </Text>
        <Button
          label={t("common.close")}
          onPress={onReset}
          variant="secondaryQuiet"
          style={{ marginTop: 24, minWidth: 180 }}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "transparent",
        paddingHorizontal: 16,
        paddingTop: shellPaddingTop,
        paddingBottom: shellPaddingBottom,
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
                padding: scrollPadding,
                paddingBottom: isCompactHeight ? 14 : 22,
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
                {DETAIL_KEYS.map((key) => (
                  <View
                    key={key}
                    style={{
                      flexDirection: isCompactHeight ? "column" : "row",
                      gap: isCompactHeight ? 4 : 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        width: isCompactHeight ? undefined : 72,
                        color: resultTokens.titleColor,
                        fontWeight: "700",
                      }}
                    >
                      {t(`fortune.detailLabels.${key}`)}
                    </Text>
                    <Text style={{ flex: 1, color: resultTokens.bodyColor, lineHeight: 23 }}>
                      {t(`fortune.details.${fortune.level}.${key}`)}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View
              style={{
                padding: 16,
                paddingVertical: isCompactHeight ? 12 : 16,
                paddingBottom: Math.max(insets.bottom + 10, isCompactHeight ? 12 : 16),
                borderTopWidth: 1,
                borderTopColor: "rgba(180, 83, 9, 0.18)",
                gap: isCompactHeight ? 8 : 10,
              }}
            >
              <Button
                label={t("common.share")}
                icon="↗"
                onPress={handleShare}
                variant="utilityWarm"
                style={actionButtonStyle}
              />
              <View style={{ flexDirection: "row", gap: isCompactHeight ? 8 : 10 }}>
                <View style={{ flex: 1 }}>
                  <Button
                    label={t("fortune.tie")}
                    icon="⌁"
                    onPress={handleTie}
                    variant="secondaryQuiet"
                    style={actionButtonStyle}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    label={t("fortune.keep")}
                    icon="✓"
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
