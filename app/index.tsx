import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform, ImageBackground } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useOmikujiLogic } from '../hooks/useOmikujiLogic';
import FortuneDisplay from '../components/FortuneDisplay';
import { soundManager } from '../utils/SoundManager';
// global.css is imported in _layout.tsx

// ステートマシン
type AppState = 'IDLE' | 'SHAKING' | 'REVEALING' | 'RESULT';

const SHAKE_THRESHOLD = 1.8;
const SHAKING_DURATION_MS = 1500;
const REVEALING_DURATION_MS = 2000;

interface Subscription {
  remove: () => void;
}

export default function OmikujiApp() {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [isSensorAvailable, setIsSensorAvailable] = useState<boolean | null>(null);
  const subscription = useRef<Subscription | null>(null);
  const { fortune, drawFortune, resetFortune } = useOmikujiLogic();

  // デバッグボタン用判定
  const appVariant = Constants.expoConfig?.extra?.appVariant || 'development';
  const showDebug = appVariant === 'development';

  // --- サウンドとセンサーの初期化 ---
  useEffect(() => {
    async function initSounds() {
      await soundManager.initialize();
      // サウンドファイルのロード (ダミーファイルでもエラーにならないか確認が必要)
      // 注意: ファイルが存在しないと require でエラーになるため、ファイルは assets/sounds/ に配置済みであること
      await soundManager.loadSound('shake', require('../assets/sounds/shake.mp3'));
      await soundManager.loadSound('result', require('../assets/sounds/result.mp3'));
    }
    initSounds();

    // センサーの可用性確認と購読
    async function setupSensor() {
      const available = await Accelerometer.isAvailableAsync();
      setIsSensorAvailable(available);

      if (available) {
        Accelerometer.setUpdateInterval(100);
        subscription.current = Accelerometer.addListener((accelerometerData: {x: number; y: number; z: number}) => {
          setData(accelerometerData);
        });
      }
    }

    setupSensor();

    return () => {
      subscription.current && subscription.current.remove();
      soundManager.unloadAll();
    };
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
    soundManager.playSound('shake');

    // シェイク演出後に抽選へ
    setTimeout(() => {
      drawFortune();
      setAppState('REVEALING');
      // Haptics: 抽選完了時のフィードバック
      if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, SHAKING_DURATION_MS);
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
        soundManager.playSound('result');
      }, REVEALING_DURATION_MS);
    }
  }, [appState]);

  const handleReset = () => {
    resetFortune();
    setAppState('IDLE');
  };

  // --- 描画 (Render) ---

  return (
    <View className="flex-1 bg-slate-900">
      <ImageBackground
        source={require('../assets/shrine_background.png')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View className="flex-1 items-center justify-center bg-black/40 relative overflow-hidden">

          {/* 待機状態 (IDLE) */}
          {appState === 'IDLE' && (
            <MotiView
              from={{ opacity: 0, scale: 0.9, translateY: 10 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              className="items-center px-6"
            >
              <View className="bg-white/10 p-8 rounded-full border border-white/20 mb-8 backdrop-blur-md">
                <Text className="text-7xl">🔮</Text>
              </View>
              <Text className="text-3xl text-white font-shippori-bold tracking-tight mb-2 text-center">
                スマホを振って{"\n"}おみくじを引く
              </Text>
              <View className="bg-red-600 px-4 py-1 rounded-full mt-4">
                <Text className="text-white font-bold text-sm tracking-widest">2026年 謹賀新年</Text>
              </View>
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
              <Text className="text-9xl mb-6">🫨</Text>
              <Text className="text-xl text-yellow-400 font-shippori-bold mt-8 tracking-widest uppercase bg-black/50 px-6 py-2 rounded-full border border-yellow-400/50">
                運命を抽選中...
              </Text>
            </MotiView>
          )}

          {/* 結果表示中 (REVEALING - 棒が出るアニメ) */}
          {appState === 'REVEALING' && (
            <View className="items-center relative h-64 w-full justify-end">
              <View className="w-32 h-48 bg-red-800 rounded-lg border-4 border-yellow-600 z-20 shadow-2xl flex items-center justify-center">
                <View className="w-20 h-2 bg-yellow-600/30 rounded-full mb-2" />
                <View className="w-16 h-2 bg-yellow-600/30 rounded-full" />
              </View>

              <MotiView
                className="absolute w-8 h-48 bg-amber-50 bottom-12 z-10 rounded-t-lg border-x-2 border-t-2 border-amber-200 items-center justify-start pt-4 shadow-lg"
                from={{ translateY: 100 }}
                animate={{ translateY: -100 }}
                transition={{ type: 'spring', damping: 10, stiffness: 80 }}
              >
                <Text className="text-red-700 font-shippori-bold text-sm text-center leading-tight">
                  {'2026\n奉\n納'}
                </Text>
              </MotiView>
            </View>
          )}

          {/* 結果画面 (コンポーネント) */}
          {appState === 'RESULT' && fortune && (
            <FortuneDisplay fortune={fortune} onReset={handleReset} />
          )}

          {/* デバッグボタン (開発時 または センサー無効時) */}
          {(showDebug || isSensorAvailable === false) && appState === 'IDLE' && (
            <TouchableOpacity
              onPress={handleShakeStart}
              className="absolute bottom-16 right-6 bg-amber-500 py-3 px-6 rounded-full shadow-lg border-2 border-white items-center justify-center active:bg-amber-600"
            >
              <Text className="text-white font-bold">
                {isSensorAvailable === false ? '📱 ボタンでおみくじを引く' : '🐞 テストで振る'}
              </Text>
            </TouchableOpacity>
          )}

          {/* 履歴画面へのナビゲーションボタン */}
          {appState === 'IDLE' && (
            <TouchableOpacity
              onPress={() => router.push('/history')}
              className="absolute bottom-16 left-6 bg-slate-700/80 py-3 px-5 rounded-full shadow-lg border border-white/30 items-center justify-center active:bg-slate-600"
            >
              <Text className="text-white font-bold">📜 運勢手帳</Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}
