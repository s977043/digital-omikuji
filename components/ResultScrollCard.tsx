import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Share,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { MotiView } from "moti";
import { OmikujiResult } from "../types/omikuji";
import { captureRef } from "react-native-view-shot";
import * as Haptics from "expo-haptics";
import { buildShareText } from "../utils/buildShareText";

interface ResultScrollCardProps {
  fortune: OmikujiResult;
  onReset: () => void;
}

export const ResultScrollCard = ({ fortune, onReset }: ResultScrollCardProps) => {
  const scrollRef = useRef<View>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    // Hide hint after scrolling down a bit
    if (contentOffset.y > 20) {
      setShowScrollHint(false);
    } else {
      setShowScrollHint(true);
    }
  };

  const handleShare = async () => {
    try {
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const message = buildShareText(fortune);

      // Capture logic
      let imageUri: string | undefined;
      // We capture the whole scroll card (or just the visible part if preferred, but usually whole card is better)
      // Note: Capturing a scrollview with content offscreen can be tricky.
      // For MVP, we capture what's visible or the reference to the container.
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
          ...(imageUri && Platform.OS === "android" ? { dialogTitle: "おみくじをシェア" } : {}),
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
          showsVerticalScrollIndicator={true}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Main Result (Top) */}
          <View className="items-center mt-8 mb-8 border-b-2 border-dashed border-slate-300 pb-8">
            <Text className="text-xl text-slate-500 font-shippori tracking-widest mb-4">
              令和八年 丙午
            </Text>

            {/* Fortune Title (Vertical-ish via large font or narrow width logic if needed, but horizontal is safe) */}
            <Text
              className="text-7xl font-shippori-bold mb-6 text-center"
              style={{ color: fortune.color }}
            >
              {fortune.fortuneParams.title}
            </Text>

            <Text className="text-lg text-slate-700 font-shippori text-center leading-loose px-4">
              {fortune.fortuneParams.description}
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
              {fortune.details?.map((detail, index) => (
                <View key={index} className="flex-row border-b border-slate-200 pb-2 mb-2">
                  <Text className="text-slate-500 w-16 font-shippori-bold">{detail.label}</Text>
                  <Text className="text-slate-800 flex-1 font-shippori">{detail.text}</Text>
                </View>
              ))}
              {!fortune.details && <Text>詳細情報はありません。</Text>}
            </MotiView>
          </View>
        </ScrollView>

        {/* Fade gradient to indicate more content - only on Web */}
        {showScrollHint && Platform.OS === "web" && (
          <View
            className="absolute left-0 right-0 h-12 pointer-events-none"
            style={{
              bottom: 80,
              // @ts-ignore - web only
              backgroundImage:
                "linear-gradient(to bottom, rgba(253,245,230,0), rgba(253,245,230,1))",
            }}
          />
        )}

        {/* Fade gradient for native platforms */}
        {showScrollHint && Platform.OS !== "web" && (
          <LinearGradient
            colors={["transparent", "#FDF5E6"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 48,
              bottom: 80,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Footer Actions (Sticky) */}
        <View className="p-4 bg-[#FDF5E6]/95 border-t border-amber-100 flex-row gap-4">
          <TouchableOpacity
            onPress={handleShare}
            className="flex-1 py-3 bg-slate-100 rounded-full items-center border border-slate-200"
          >
            <Text className="text-slate-800 font-bold">シェア</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onReset}
            className="flex-1 py-3 bg-slate-900 rounded-full items-center"
          >
            <Text className="text-white font-bold">閉じる</Text>
          </TouchableOpacity>
        </View>

        {/* Scroll Footer Decoration */}
        <View className="h-2 bg-amber-600 w-full mt-auto" />
        <View className="h-4 bg-amber-800 w-full" />
      </MotiView>
    </View>
  );
};
