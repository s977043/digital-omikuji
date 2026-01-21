import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Share,
  ToastAndroid,
} from "react-native";
import { MotiView } from "moti";
import { OmikujiResult } from "../types/omikuji";
import { captureRef } from "react-native-view-shot";
import * as Haptics from "expo-haptics";
import { buildShareText } from "../utils/buildShareText";
import { setLastResultAction } from "../utils/HistoryStorage";
import { useTranslation } from "react-i18next";
import { DETAIL_KEYS } from "../data/omikujiData";

// アニメーション定数
const ANIMATION_TIMING = {
  TIE_CARD_FLY: 1200,
  TIE_TRANSITION: 1000,
  KEEP_TRANSITION: 800,
  REDUCED_MOTION: 400,
} as const;

const TIE_ANIMATION = {
  opacity: 0.2,
  scale: 0.3,
  translateY: -500,
  rotateZ: "25deg",
} as const;

const KEEP_ANIMATION = {
  opacity: 0,
  scale: 0.15,
  translateY: 250,
  translateX: -180,
  rotateZ: "-15deg",
} as const;

const REDUCED_MOTION_ANIMATION = {
  scale: 0.95,
  translateY: { tie: -20, keep: 20 },
} as const;

interface ResultScrollCardProps {
  fortune: OmikujiResult;
  onReset: () => void;
  reducedMotion?: boolean;
  hasSelectedAction?: boolean; // 結ぶ/持ち帰るが選択済みかどうか
  onActionSelected?: () => void;
}

export const ResultScrollCard = ({
  fortune,
  onReset,
  reducedMotion = false,
  hasSelectedAction = false,
  onActionSelected,
}: ResultScrollCardProps) => {
  const animationRef = useRef<View>(null);
  const cardRef = useRef<View>(null);
  const tieTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useTranslation();
  const [exitAnimation, setExitAnimation] = useState<"tie" | "keep" | null>(null);
  const [showTiedComplete, setShowTiedComplete] = useState(false);

  // タイマークリーンアップ
  useEffect(() => {
    return () => {
      if (tieTimerRef.current) clearTimeout(tieTimerRef.current);
      if (keepTimerRef.current) clearTimeout(keepTimerRef.current);
    };
  }, []);

  const handleTie = useCallback(async () => {
    // ボタン連打防止
    if (exitAnimation) return;

    if (Platform.OS !== "web" && !reducedMotion) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setExitAnimation("tie");

    // UIタイマーを先に開始（Optimistic UI）
    tieTimerRef.current = setTimeout(() => {
      setShowTiedComplete(true);
    }, ANIMATION_TIMING.TIE_CARD_FLY);

    if (Platform.OS === "android") {
      ToastAndroid.show(t("fortune.toastTie"), ToastAndroid.SHORT);
    }

    // Storage保存は裏で実行（ただし失敗時は補償が必要かもしれないが、このアプリでは許容）
    await setLastResultAction("tie");

    // 親コンポーネントに通知
    if (onActionSelected) {
      onActionSelected();
    }
  }, [exitAnimation, reducedMotion, t, onActionSelected]);

  const handleKeep = useCallback(async () => {
    // ボタン連打防止
    if (exitAnimation) return;

    if (Platform.OS !== "web" && !reducedMotion) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setExitAnimation("keep");

    // UIタイマーを先に開始
    keepTimerRef.current = setTimeout(onReset, ANIMATION_TIMING.KEEP_TRANSITION);

    if (Platform.OS === "android") {
      ToastAndroid.show(t("fortune.toastKeep"), ToastAndroid.SHORT);
    }

    await setLastResultAction("keep");

    // 親コンポーネントに通知
    if (onActionSelected) {
      onActionSelected();
    }
  }, [exitAnimation, reducedMotion, t, onReset, onActionSelected]);

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
    <View className="flex-1 items-center justify-center bg-black/80 w-full h-full absolute inset-0 z-50">
      {/* 結ばれたおみくじ完了画面 */}
      {showTiedComplete && (
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="items-center justify-center"
        >
          {/* 木の枝と結ばれたおみくじ */}
          <View
            className="items-center"
            accessibilityElementsHidden={true}
            importantForAccessibility="no-hide-descendants"
          >
            <Text className="text-6xl mb-2">🌸</Text>
            <View className="flex-row items-start">
              <Text className="text-4xl">🌿</Text>
              <View
                className="bg-white/90 px-3 py-4 rounded-sm mx-1 shadow-lg border border-amber-200"
                style={{ transform: [{ rotate: "-8deg" }] }}
              >
                <Text className="text-red-700 font-shippori-bold text-xs text-center">{`御\n神\n籤`}</Text>
              </View>
              <View
                className="bg-white/90 px-3 py-4 rounded-sm mx-1 shadow-lg border border-amber-200"
                style={{ transform: [{ rotate: "5deg" }] }}
              >
                <Text className="text-red-700 font-shippori-bold text-xs text-center">{`願\n成\n就`}</Text>
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
            className="mt-12 items-center"
          >
            <Text
              className="text-white text-2xl font-shippori-bold text-center leading-relaxed"
              style={{ letterSpacing: 1 }}
            >
              {t("fortune.tiedTitle")}
            </Text>
            <Text
              className="text-white/70 text-base font-shippori text-center mt-3"
              style={{ letterSpacing: 0.5 }}
            >
              {t("fortune.tiedMessage")}
            </Text>
            {/* 閉じるリンク */}
            <TouchableOpacity
              onPress={onReset}
              className="mt-10 px-8 py-4 bg-white/20 rounded-full border border-white/40 items-center min-h-[48px] justify-center"
              accessibilityLabel={t("common.close")}
              accessibilityRole="button"
            >
              <Text className="text-white font-bold text-base text-center">
                {t("common.close")}
              </Text>
            </TouchableOpacity>
          </MotiView>
        </MotiView>
      )}

      {!showTiedComplete && (
        <MotiView
          from={{ opacity: 0, scale: 0.9, translateY: 20 }}
          animate={
            exitAnimation === "tie"
              ? reducedMotion
                ? {
                    opacity: 0,
                    scale: REDUCED_MOTION_ANIMATION.scale,
                    translateY: REDUCED_MOTION_ANIMATION.translateY.tie,
                    rotateZ: "0deg",
                    translateX: 0,
                  }
                : TIE_ANIMATION
              : exitAnimation === "keep"
                ? reducedMotion
                  ? {
                      opacity: 0,
                      scale: REDUCED_MOTION_ANIMATION.scale,
                      translateY: REDUCED_MOTION_ANIMATION.translateY.keep,
                      translateX: 0,
                      rotateZ: "0deg",
                    }
                  : KEEP_ANIMATION
                : { opacity: 1, scale: 1, translateY: 0, translateX: 0, rotateZ: "0deg" }
          }
          transition={
            reducedMotion
              ? { type: "timing", duration: ANIMATION_TIMING.REDUCED_MOTION }
              : exitAnimation === "tie"
                ? { type: "timing", duration: ANIMATION_TIMING.TIE_TRANSITION }
                : { type: "spring", damping: 18, stiffness: 90 }
          }
          className="w-full max-w-md bg-[#FDF5E6] rounded-sm overflow-hidden flex-col shadow-2xl relative z-10 m-4 shrink h-[85vh] sm:h-auto"
          // @ts-ignore: vh unit is valid for web but not typed in React Native ViewStyle
          style={{ maxHeight: Platform.OS === "web" ? "85vh" : "85%" }}
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
              className={`${hasSelectedAction ? "flex-1" : ""} py-3 bg-slate-100 rounded-full items-center border border-slate-200 px-6`}
              accessibilityRole="button"
              accessibilityLabel="シェア"
            >
              <Text className="text-slate-800 font-bold">{t("common.share")}</Text>
            </TouchableOpacity>

            {!hasSelectedAction && (
              <>
                <TouchableOpacity
                  onPress={handleTie}
                  className="flex-1 py-3 bg-white border border-amber-200 rounded-full items-center"
                  accessibilityRole="button"
                  accessibilityLabel="結ぶ"
                >
                  <Text className="text-amber-700 font-bold">{t("fortune.tie")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleKeep}
                  className="flex-1 py-3 bg-amber-600 rounded-full items-center shadow-sm"
                  accessibilityRole="button"
                  accessibilityLabel="持ち帰る"
                >
                  <Text className="text-white font-bold">{t("fortune.keep")}</Text>
                </TouchableOpacity>
              </>
            )}

            {hasSelectedAction && (
              <TouchableOpacity
                onPress={onReset}
                className="flex-1 py-3 bg-slate-800 rounded-full items-center shadow-sm"
                accessibilityRole="button"
                accessibilityLabel="閉じる"
              >
                <Text className="text-white font-bold">閉じる</Text>
              </TouchableOpacity>
            )}
          </View>
        </MotiView>
      )}
    </View>
  );
};
