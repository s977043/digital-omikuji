import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform, Share, ToastAndroid } from "react-native";
import { MotiView } from "moti";
import { OmikujiResult } from "../types/omikuji";
import { captureRef } from "react-native-view-shot";
import * as Haptics from "expo-haptics";
import { buildShareText } from "../utils/buildShareText";
import { useTranslation } from "react-i18next";
import { DETAIL_KEYS } from "../data/omikujiData";

interface ResultScrollCardProps {
  fortune: OmikujiResult;
  onReset: () => void;
}

export const ResultScrollCard = ({ fortune, onReset }: ResultScrollCardProps) => {
  const animationRef = useRef<View>(null);
  const cardRef = useRef<View>(null);
  const { t } = useTranslation();
  const [exitAnimation, setExitAnimation] = useState<"tie" | "keep" | null>(null);
  const [showTiedComplete, setShowTiedComplete] = useState(false);

  const handleTie = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setExitAnimation("tie");

    // Show toast
    if (Platform.OS === "android") {
      ToastAndroid.show(t("fortune.toastTie"), ToastAndroid.SHORT);
    }

    // 1段階目: カードが飛んでいく (800ms)
    // 2段階目: 結ばれた状態を表示 (2000ms)
    setTimeout(() => {
      setShowTiedComplete(true);
      setTimeout(onReset, 2000);
    }, 800);
  };

  const handleKeep = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setExitAnimation("keep");

    if (Platform.OS === "android") {
      ToastAndroid.show(t("fortune.toastKeep"), ToastAndroid.SHORT);
    }

    setTimeout(onReset, 800);
  };

  // Get translated fortune title and message
  const fortuneTitle = t(`fortune.levels.${fortune.level}`);
  const fortuneMessages = t(`fortune.messages.${fortune.level}`, {
    returnObjects: true,
  });
  const fortuneMessage = Array.isArray(fortuneMessages)
    ? fortuneMessages[fortune.messageIndex] || fortuneMessages[0]
    : String(fortuneMessages);

  const handleShare = async () => {
    try {
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const message = buildShareText({
        level: fortune.level,
        title: fortuneTitle,
        description: fortuneMessage,
      });

      // --- Web Implementation ---
      if (Platform.OS === "web") {
        try {
          const { toPng } = await import("html-to-image");
          const element = document.querySelector('[data-testid="share-card"]') as HTMLElement;
          if (element) {
            const dataUrl = await toPng(element, { backgroundColor: "#FDF5E6" });
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
              // Fallback: Download
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

      // --- Native Implementation ---
      let imageUri: string | undefined;
      if (cardRef.current) {
        try {
          imageUri = await captureRef(cardRef, {
            format: "png",
            quality: 0.8,
          });
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

  return (
    <View className="flex-1 items-center justify-center bg-black/80 px-4 py-8 w-full h-full absolute inset-0 z-50">
      {/* 結ばれたおみくじ完了画面 */}
      {showTiedComplete && (
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="items-center justify-center"
        >
          {/* 木の枝と結ばれたおみくじ */}
          <View className="items-center">
            <Text className="text-6xl mb-2">🌸</Text>
            <View className="flex-row items-start">
              <Text className="text-4xl">🌿</Text>
              <View className="bg-white/90 px-3 py-4 rounded-sm mx-1 shadow-lg border border-amber-200" style={{ transform: [{ rotate: "-8deg" }] }}>
                <Text className="text-red-700 font-shippori-bold text-xs text-center">御\n神\n籤</Text>
              </View>
              <View className="bg-white/90 px-3 py-4 rounded-sm mx-1 shadow-lg border border-amber-200" style={{ transform: [{ rotate: "5deg" }] }}>
                <Text className="text-red-700 font-shippori-bold text-xs text-center">願\n成\n就</Text>
              </View>
              <Text className="text-4xl">🌿</Text>
            </View>
            <Text className="text-6xl mt-2">🌸</Text>
          </View>
          {/* メッセージ */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 300 }}
            className="mt-8"
          >
            <Text className="text-white text-xl font-shippori-bold text-center tracking-widest">
              おみくじを結びました
            </Text>
            <Text className="text-white/70 text-sm font-shippori text-center mt-2">
              願いが届きますように...
            </Text>
          </MotiView>
        </MotiView>
      )}

      {/* 光のパーティクルエフェクト - 結ぶ時のみ */}
      {exitAnimation === "tie" && !showTiedComplete && (
        <MotiView
          from={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 2.5 }}
          transition={{ type: "timing", duration: 700 }}
          className="absolute w-48 h-48 bg-yellow-300/50 rounded-full z-0"
          style={{ top: "20%", left: "50%", transform: [{ translateX: -96 }, { translateY: -96 }] }}
        />
      )}
      {!showTiedComplete && (
        <MotiView
          from={{ opacity: 0, scale: 0.9, translateY: 20 }}
          animate={{
            opacity: exitAnimation ? 0 : 1,
            scale: exitAnimation === "keep" ? 0.15 : exitAnimation === "tie" ? 0.25 : 1,
            translateY: exitAnimation === "tie" ? -450 : exitAnimation === "keep" ? 250 : 0,
            translateX: exitAnimation === "keep" ? -180 : 0,
            rotateZ: exitAnimation === "tie" ? "20deg" : exitAnimation === "keep" ? "-15deg" : "0deg",
          }}
          transition={{ type: "spring", damping: 18, stiffness: 90 }}
          className="w-full max-w-md h-[85%] bg-[#FDF5E6] rounded-sm overflow-hidden flex-col shadow-2xl relative z-10"
          ref={animationRef}
        >
          <View ref={cardRef} className="flex-1 bg-[#FDF5E6]">
            {/* @ts-ignore - data-testid is for web capture selection */}
            <View
              nativeID="share-card"
              {...(Platform.OS === "web" ? { "data-testid": "share-card" } : {})}
              className="flex-1"
            >
              {/* Scroll Header Decoration */}
              <View className="h-4 bg-amber-800 w-full" />
              <View className="h-2 bg-amber-600 w-full mb-4" />

              <ScrollView
                className="flex-1 px-6"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
              >
                {/* Main Result (Top) */}
                <View className="items-center mt-8 mb-8 border-b-2 border-dashed border-slate-300 pb-8">
                  <Text className="text-xl text-slate-500 font-shippori tracking-widest mb-4">
                    令和八年 丙午
                  </Text>

                  {/* Fortune Title */}
                  <Text
                    className="text-7xl font-shippori-bold mb-6 text-center"
                    style={{ color: fortune.color }}
                  >
                    {fortuneTitle}
                  </Text>

                  <Text className="text-lg text-slate-700 font-shippori text-center leading-loose px-4">
                    {fortuneMessage}
                  </Text>
                </View>

                {/* Detailed Section */}
                <View className="relative min-h-[200px]">
                  <Text className="text-center text-slate-400 font-bold mb-6 text-sm tracking-widest">
                    ── 運勢詳細 ──
                  </Text>

                  <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 500 }}
                    className="space-y-4"
                  >
                    {DETAIL_KEYS.map((key) => (
                      <View key={key} className="flex-row border-b border-slate-200 pb-2 mb-2">
                        <Text className="text-slate-500 w-16 font-shippori-bold">
                          {t(`fortune.detailLabels.${key}`)}
                        </Text>
                        <Text className="text-slate-800 flex-1 font-shippori">
                          {t(`fortune.details.${fortune.level}.${key}`)}
                        </Text>
                      </View>
                    ))}
                  </MotiView>
                </View>
              </ScrollView>

              {/* Scroll Footer Decoration */}
              <View className="h-2 bg-amber-600 w-full mt-auto" />
              <View className="h-4 bg-amber-800 w-full" />
            </View>
          </View>

          {/* Footer Actions (Sticky) */}
          <View className="p-4 bg-[#FDF5E6]/95 border-t border-amber-100 flex-row gap-4">
            <TouchableOpacity
              onPress={handleShare}
              className="flex-1 py-3 bg-slate-100 rounded-full items-center border border-slate-200"
            >
              <Text className="text-slate-800 font-bold">{t("common.share")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleTie}
              className="flex-1 py-3 bg-white border border-amber-200 rounded-full items-center"
            >
              <Text className="text-amber-700 font-bold">{t("fortune.tie")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleKeep}
              className="flex-1 py-3 bg-amber-600 rounded-full items-center shadow-sm"
            >
              <Text className="text-white font-bold">{t("fortune.keep")}</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      )}
    </View>
  );
};
