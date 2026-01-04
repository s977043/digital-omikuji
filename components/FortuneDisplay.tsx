import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Share, Platform } from "react-native";
import { MotiView } from "moti";
import { OmikujiResult } from "../types/omikuji";
import * as Haptics from "expo-haptics";
import { captureRef } from "react-native-view-shot";
import { FORTUNE_ANIMATIONS } from "../data/fortuneAnimations";

interface FortuneDisplayProps {
  fortune: OmikujiResult;
  onReset: () => void;
}

export default function FortuneDisplay({
  fortune,
  onReset,
}: FortuneDisplayProps) {
  const fortuneCardRef = useRef<View>(null);
  const animConfig = FORTUNE_ANIMATIONS[fortune.level];

  const handleShare = async () => {
    try {
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const message = `🎍 2026年 新春おみくじ 🎍\n\n私の運勢は… ✨ ${fortune.fortuneParams.title} ✨\n「${fortune.fortuneParams.description}」\n\n#おみくじ2026 #新春`;

      // Capture the fortune card as an image
      let imageUri: string | undefined;
      if (Platform.OS !== "web" && fortuneCardRef.current) {
        try {
          imageUri = await captureRef(fortuneCardRef, {
            format: "png",
            quality: 1,
          });
        } catch (captureError) {
          console.error("Image capture failed", captureError);
        }
      }

      // Share with image if available
      await Share.share(
        {
          message,
          ...(imageUri && Platform.OS === "ios" ? { url: imageUri } : {}),
        },
        {
          ...(imageUri && Platform.OS === "android"
            ? { dialogTitle: "おみくじをシェア" }
            : {}),
        }
      );
    } catch (error) {
      console.error("Sharing failed", error);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: animConfig.entryScale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        damping: animConfig.springDamping,
      }}
      className="absolute inset-0 flex-1 items-center justify-center bg-black/80 z-50 p-6"
    >
      {/* 運勢別のパルス演出 */}
      {animConfig.enablePulse && (
        <MotiView
          from={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1.3, opacity: 0 }}
          transition={{ loop: true, type: "timing", duration: 2000 }}
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: animConfig.pulseColor }}
        />
      )}

      {/* カード登場時の追加演出 (大吉のみ) */}
      {fortune.level === "daikichi" && (
        <>
          <MotiView
            from={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              loop: true,
              type: "timing",
              duration: 1500,
              delay: 500,
            }}
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: "rgba(255, 215, 0, 0.2)" }}
          />
          <MotiView
            from={{ rotate: "0deg" }}
            animate={{ rotate: "360deg" }}
            transition={{ loop: true, type: "timing", duration: 8000 }}
            className="absolute w-96 h-96 border-2 border-yellow-400/30 rounded-full"
          />
        </>
      )}

      <View
        ref={fortuneCardRef}
        className="bg-white rounded-3xl p-8 items-center w-full max-w-sm border-4 shadow-2xl"
        style={{ borderColor: fortune.color }}
      >
        {/* 結果タイトル */}
        <MotiView
          from={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 8,
            delay: 200,
          }}
        >
          <Text
            className="text-6xl font-shippori-bold mb-4 tracking-wi"
            style={{ color: fortune.color }}
          >
            {fortune.fortuneParams.title}
          </Text>
        </MotiView>

        <View className="h-0.5 w-16 bg-slate-200 mb-6" />

        {/* メッセージ */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400, delay: 400 }}
        >
          <Text className="text-slate-700 text-center text-lg font-shippori leading-relaxed mb-8">
            {fortune.fortuneParams.description}
          </Text>
        </MotiView>

        {/* アクションボタン */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 300, delay: 600 }}
          className="flex-row gap-4 w-full"
        >
          {/* シェアボタン */}
          <TouchableOpacity
            onPress={handleShare}
            className="flex-1 bg-slate-100 py-3 rounded-xl items-center justify-center active:bg-slate-200 border border-slate-200"
          >
            <Text className="text-slate-800 font-semibold">シェア 📤</Text>
          </TouchableOpacity>

          {/* 閉じるボタン */}
          <TouchableOpacity
            onPress={onReset}
            className="flex-1 bg-slate-900 py-3 rounded-xl items-center justify-center active:bg-slate-700"
          >
            <Text className="text-white font-bold">閉じる</Text>
          </TouchableOpacity>
        </MotiView>
      </View>
    </MotiView>
  );
}

