import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { OmikujiResult } from "../types/omikuji";
import * as Haptics from "expo-haptics";
import ShareImageCard from "./ShareImageCard";
import {
  captureShareImage,
  shareOmikujiResult,
  cleanupOldShareFiles,
} from "../utils/shareUtils";

interface FortuneDisplayProps {
  fortune: OmikujiResult;
  onReset: () => void;
}

export default function FortuneDisplay({
  fortune,
  onReset,
}: FortuneDisplayProps) {
  const shareCardRef = useRef<View>(null);

  // コンポーネントマウント時に古い一時ファイルをクリーンアップ
  useEffect(() => {
    cleanupOldShareFiles();
  }, []);

  const handleShare = async () => {
    try {
      // ハプティックフィードバック
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // シェア用画像をキャプチャ
      const imageUri = await captureShareImage(shareCardRef);

      // シェア実行（フォールバック対応済み）
      const result = await shareOmikujiResult(fortune, imageUri);

      if (result.success) {
        // 成功時のフィードバック
        if (Platform.OS !== "web") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.error("Share handling failed:", error);
    }
  };

  return (
    <>
      {/* 画面外にシェア用カードをレンダリング（キャプチャ用） */}
      <View style={styles.offscreenContainer} pointerEvents="none">
        <ShareImageCard ref={shareCardRef} fortune={fortune} />
      </View>

      {/* メイン表示 */}
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="absolute inset-0 flex-1 items-center justify-center bg-black/80 z-50 p-6"
      >
        {/* 大吉の場合の特別演出 (オーラ) */}
        {fortune.fortuneParams.title === "大吉" && (
          <MotiView
            from={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ loop: true, type: "timing", duration: 2000 }}
            className="absolute inset-0 bg-yellow-500/30 rounded-full"
          />
        )}

        <View
          className="bg-white rounded-3xl p-8 items-center w-full max-w-sm border-4 shadow-2xl"
          style={{ borderColor: fortune.color }}
        >
          {/* 結果タイトル */}
          <Text
            className="text-6xl font-shippori-bold mb-4 tracking-wide"
            style={{ color: fortune.color }}
          >
            {fortune.fortuneParams.title}
          </Text>

          <View className="h-0.5 w-16 bg-slate-200 mb-6" />

          {/* メッセージ */}
          <Text className="text-slate-700 text-center text-lg font-shippori leading-relaxed mb-8">
            {fortune.fortuneParams.description}
          </Text>

          {/* アクションボタン */}
          <View className="flex-row gap-4 w-full">
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
          </View>
        </View>
      </MotiView>
    </>
  );
}

const styles = StyleSheet.create({
  offscreenContainer: {
    position: "absolute",
    top: -2000,
    left: -2000,
    opacity: 0,
  },
});
