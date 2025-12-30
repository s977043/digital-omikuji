import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';
import { useOmikujiLogic } from '../hooks/useOmikujiLogic';
import FortuneDisplay from '../components/FortuneDisplay';
import "../../global.css";

// ステートマシン
type AppState = 'IDLE' | 'SHAKING' | 'REVEALING' | 'RESULT';

const SHAKE_THRESHOLD = 1.8;

export default function OmikujiApp() {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const subscription = useRef<any>(null);
  const { fortune, drawFortune, resetFortune } = useOmikujiLogic();

  // デバッグボタン用判定
  const appVariant = Constants.expoConfig?.extra?.appVariant || 'development';
  const showDebug = appVariant === 'development';

  // --- シェイク検知ロジック ---
  const _subscribe = () => {
    Accelerometer.setUpdateInterval(100);
    subscription.current = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
    });
  };

  const _unsubscribe = () => {
    subscription.current && subscription.current.remove();
    subscription.current = null;
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  // シェイク監視
  useEffect(() => {
    if (appState === 'IDLE') {
      const totalForce = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
      if (totalForce > SHAKE_THRESHOLD) {
        handleShakeStart();
      }
    }
  }, [data, appState]);

  const handleShakeStart = async () => {
    if (appState !== 'IDLE') return;

    // Haptics: 開始時の軽い振動
    if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setAppState('SHAKING');

    // シェイク演出後に抽選へ
    setTimeout(() => {
      drawFortune();
      setAppState('REVEALING');
      // Haptics: 抽選完了時のフィードバック
      if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 1500);
  };

  // --- アニメーション状態遷移 ---
  useEffect(() => {
    if (appState === 'REVEALING') {
      setTimeout(() => {
        setAppState('RESULT');
        // Haptics: 結果が出た時の重い衝撃
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      }, 2000);
    }
  }, [appState]);

  const handleReset = () => {
    resetFortune();
    setAppState('IDLE');
  };

  // --- 描画 (Render) ---

  return (
    <View className="flex-1 items-center justify-center bg-slate-900 relative overflow-hidden">

      {/* 背景の雰囲気づくり */}
      <View className="absolute inset-0 bg-slate-800 opacity-50" />

      {/* 待機状態 (IDLE) */}
      {appState === 'IDLE' && (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="items-center"
        >
          <Text className="text-6xl text-white font-bold mb-6">🔮</Text>
          <Text className="text-2xl text-white font-bold tracking-wider">スマホを振って</Text>
          <Text className="text-xl text-white font-bold tracking-wider mb-2">おみくじを引く</Text>
          <Text className="text-slate-400 mt-2 font-medium">2026年 新春デジタルおみくじ</Text>
        </MotiView>
      )}

      {/* シェイク中 (SHAKING) */}
      {appState === 'SHAKING' && (
        <MotiView
          from={{ translateX: -10, rotateZ: '-5deg' }}
          animate={{ translateX: 10, rotateZ: '5deg' }}
          transition={{
            type: 'timing',
            duration: 80,
            loop: true,
            repeatReverse: true,
          }}
          className="items-center"
        >
          <Text className="text-8xl">🫨</Text>
          <Text className="text-xl text-yellow-400 font-bold mt-8 tracking-widest uppercase">運命を抽選中...</Text>
        </MotiView>
      )}

      {/* 結果表示中 (REVEALING - 棒が出るアニメ) */}
      {appState === 'REVEALING' && (
        <View className="items-center relative h-64 w-full justify-end">
          {/* おみくじ箱 */}
          <View className="w-32 h-48 bg-red-800 rounded-lg border-4 border-yellow-600 z-20 shadow-xl" />

          {/* 出てくる棒 */}
          <MotiView
            className="absolute w-8 h-48 bg-amber-100 bottom-10 z-10 rounded-t-lg border-x-2 border-t-2 border-amber-300 items-center justify-start pt-2"
            from={{ translateY: 100 }}
            animate={{ translateY: -80 }}
            transition={{ type: 'spring', damping: 12 }}
          >
            <Text className="text-red-600 font-bold text-xs writing-vertical-rl">第2026番</Text>
          </MotiView>
        </View>
      )}

      {/* 結果画面 (コンポーネント) */}
      {appState === 'RESULT' && fortune && (
        <FortuneDisplay fortune={fortune} onReset={handleReset} />
      )}

      {/* デバッグボタン (開発時のみ) */}
      {showDebug && appState === 'IDLE' && (
        <TouchableOpacity
          onPress={handleShakeStart}
          className="absolute bottom-12 right-6 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-600"
        >
          <Text className="text-xs text-white font-mono">🐞 Debug Shake</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
