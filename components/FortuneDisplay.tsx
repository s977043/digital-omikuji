import React from 'react';
import { View, Text, TouchableOpacity, Share, Platform } from 'react-native';
import { MotiView } from 'moti';
import { OmikujiFortune } from '../constants/OmikujiData';
import * as Haptics from 'expo-haptics';

interface FortuneDisplayProps {
  fortune: OmikujiFortune;
  onReset: () => void;
}

export default function FortuneDisplay({ fortune, onReset }: FortuneDisplayProps) {

  const handleShare = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const message = `🎍 2026年 新春おみくじ 🎍\n\n私の運勢は… ✨ ${fortune.result} ✨\n「${fortune.message}」\n\n#おみくじ2026 #新春`;

      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Sharing failed', error);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15 }}
      className="absolute inset-0 flex-1 items-center justify-center bg-black/80 z-50 p-6"
    >
      {/* 大吉の場合の特別演出 (オーラ) */}
      {fortune.result === '大吉' && (
        <MotiView
          from={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ loop: true, type: 'timing', duration: 2000 }}
          className="absolute inset-0 bg-yellow-500/30 rounded-full"
        />
      )}

      <View
        className="bg-white rounded-3xl p-8 items-center w-full max-w-sm border-4 shadow-2xl"
        style={{ borderColor: fortune.color }}
      >
        {/* 結果タイトル */}
        <Text className="text-6xl font-shippori-bold mb-4 tracking-wi" style={{ color: fortune.color }}>
          {fortune.result}
        </Text>

        <View className="h-0.5 w-16 bg-slate-200 mb-6" />

        {/* メッセージ */}
        <Text className="text-slate-700 text-center text-lg font-shippori leading-relaxed mb-8">
          {fortune.message}
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
  );
}
