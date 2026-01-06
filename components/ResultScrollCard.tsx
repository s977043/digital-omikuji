import React, { useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform, Share } from "react-native";
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
  const scrollRef = useRef<View>(null);
  const { t } = useTranslation();

  // Get translated fortune title and message
  const fortuneTitle = t(`fortune.levels.${fortune.level}`);
  const fortuneMessages = t(`fortune.messages.${fortune.level}`, {
    returnObjects: true,
  }) as string[];
  const fortuneMessage = fortuneMessages[fortune.messageIndex] || fortuneMessages[0];

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

      // Capture logic
      let imageUri: string | undefined;
      if (Platform.OS !== "web" && scrollRef.current) {
        try {
          imageUri = await captureRef(scrollRef, {
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
      <MotiView
        from={{ opacity: 0, scale: 0.9, translateY: 20 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-md h-[85%] bg-[#FDF5E6] rounded-sm overflow-hidden flex-col shadow-2xl relative"
        ref={scrollRef}
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

        {/* Footer Actions (Sticky) */}
        <View className="p-4 bg-[#FDF5E6]/95 border-t border-amber-100 flex-row gap-4">
          <TouchableOpacity
            onPress={handleShare}
            className="flex-1 py-3 bg-slate-100 rounded-full items-center border border-slate-200"
          >
            <Text className="text-slate-800 font-bold">{t("common.share")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onReset}
            className="flex-1 py-3 bg-slate-900 rounded-full items-center"
          >
            <Text className="text-white font-bold">{t("common.close")}</Text>
          </TouchableOpacity>
        </View>

        {/* Scroll Footer Decoration */}
        <View className="h-2 bg-amber-600 w-full mt-auto" />
        <View className="h-4 bg-amber-800 w-full" />
      </MotiView>
    </View>
  );
};
