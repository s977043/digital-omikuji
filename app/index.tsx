import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, Platform, ImageBackground, Image } from "react-native";
import { Accelerometer } from "expo-sensors";
import { MotiView } from "moti";
import * as Haptics from "expo-haptics";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useOmikujiLogic } from "../hooks/useOmikujiLogic";
import FortuneDisplay from "../components/FortuneDisplay";
import { VersionDisplay } from "../components/VersionDisplay";
import { soundManager } from "../utils/SoundManager";
// global.css is imported in _layout.tsx

import { DrawingOverlay } from "../components/DrawingOverlay"; // Import DrawingOverlay

// ... (other imports)

// ステートマシン
type AppState = "IDLE" | "SHAKING" | "DRAWING" | "REVEALING" | "RESULT";

const SHAKE_THRESHOLD = 1.8;
const SHAKING_DURATION_MS = 1500;
const DRAWING_DURATION_MS = 1200; // New duration for drawing phase
const REVEALING_DURATION_MS = 2000;

// アニメーション定数
const SHAKE_ANIMATION = {
  TRANSLATE_X: 15,
  ROTATE_Z_DEG: 10,
  SCALE_FROM: 0.9,
  SCALE_TO: 1.1,
  DURATION: 50,
  TEXT_PULSE_DURATION: 500,
};

const REVEAL_ANIMATION = {
  BOX_SPRING_DAMPING: 15,
  STICK_SPRING_DAMPING: 12,
  STICK_SPRING_STIFFNESS: 100,
  STICK_APPEAR_DELAY: 300,
  SPARKLE_APPEAR_DELAY: 600,
  SPARKLE_DURATION: 500,
};

// ハプティックフィードバックヘルパー
type HapticFeedbackType =
  | { type: "impact"; style: Haptics.ImpactFeedbackStyle }
  | { type: "notification"; style: Haptics.NotificationFeedbackType };

const triggerHaptic = (feedback: HapticFeedbackType) => {
  if (Platform.OS === "web") return;

  if (feedback.type === "impact") {
    Haptics.impactAsync(feedback.style);
  } else {
    Haptics.notificationAsync(feedback.style);
  }
};

interface Subscription {
  remove: () => void;
}

export default function OmikujiApp() {
  const [appState, setAppState] = useState<AppState>("IDLE");
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [isSensorAvailable, setIsSensorAvailable] = useState<boolean | null>(null);
  const subscription = useRef<Subscription | null>(null);
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { fortune, drawFortune, resetFortune, hasDrawnToday } = useOmikujiLogic();

  // デバッグボタン用判定
  const appVariant = Constants.expoConfig?.extra?.appVariant || "development";
  const showDebug = appVariant === "development";

  const [isMuted, setIsMuted] = useState(false);

  // --- サウンドとセンサーの初期化 ---
  useEffect(() => {
    async function initSounds() {
      await soundManager.initialize();

      // 安全なサウンドロード（ファイルがなくてもクラッシュさせない）
      const soundsToLoad = [
        { key: "shake", loader: () => require("../assets/sounds/shake.wav") },
        { key: "result", loader: () => require("../assets/sounds/result.wav") },
      ];

      for (const sound of soundsToLoad) {
        try {
          await soundManager.loadSound(sound.key, sound.loader());
        } catch {
          console.warn(`${sound.key} sound not found`);
        }
      }
    }
    initSounds();

    // センサーの可用性確認と購読
    async function setupSensor() {
      // Web版ではセンサーAPIが不安定なため、プラットフォームチェックを追加
      if (Platform.OS === "web") {
        // Web版ではセンサー無効として扱い、ボタンUIを表示
        setIsSensorAvailable(false);
        return;
      }

      try {
        const available = await Accelerometer.isAvailableAsync();
        setIsSensorAvailable(available);

        if (available) {
          Accelerometer.setUpdateInterval(100);
          subscription.current = Accelerometer.addListener(setData);
        }
      } catch (error) {
        console.warn("Accelerometer initialization failed:", error);
        setIsSensorAvailable(false);
      }
    }

    setupSensor();

    return () => {
      subscription.current && subscription.current.remove();
      soundManager.unloadAll();
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prevMuted) => {
      const nextMuted = !prevMuted;
      soundManager.setMute(nextMuted);
      return nextMuted;
    });
  }, []);

  // Note: Auto-transition removed - user should explicitly tap "View result again" button
  // to see the result when hasDrawnToday is true

  const handleResultView = useCallback(() => {
    if (fortune) {
      setAppState("RESULT");
    }
  }, [fortune]);

  const handleShakeStart = useCallback(async () => {
    if (appState !== "IDLE" || hasDrawnToday) return;

    // Haptics: 開始時の軽い振動
    triggerHaptic({
      type: "impact",
      style: Haptics.ImpactFeedbackStyle.Medium,
    });

    setAppState("SHAKING");
    soundManager.playSound("shake");

    // シェイク終了 -> 抽選演出 (DRAWING) へ
    shakeTimerRef.current = setTimeout(async () => {
      // 抽選ロジックはここで確定させるが、ユーザーにはまだ見せない
      await drawFortune();
      setAppState("DRAWING");

      // Haptics: 抽選中への切り替わり
      triggerHaptic({
        type: "impact",
        style: Haptics.ImpactFeedbackStyle.Light,
      });
    }, SHAKING_DURATION_MS);
  }, [appState, drawFortune, hasDrawnToday]);

  // シェイク監視
  useEffect(() => {
    if (appState === "IDLE") {
      const totalForce = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
      if (totalForce > SHAKE_THRESHOLD) {
        handleShakeStart();
      }
    }
  }, [data, appState, handleShakeStart]);

  // Cleanup shake timer on unmount
  useEffect(() => {
    return () => {
      if (shakeTimerRef.current) {
        clearTimeout(shakeTimerRef.current);
      }
    };
  }, []);

  // --- アニメーション状態遷移 ---
  useEffect(() => {
    // DRAWING -> REVEALING
    if (appState === "DRAWING") {
      const timer = setTimeout(() => {
        setAppState("REVEALING");
        // Haptics: 棒が出る瞬間
        triggerHaptic({
          type: "notification",
          style: Haptics.NotificationFeedbackType.Success,
        });
      }, DRAWING_DURATION_MS);
      return () => clearTimeout(timer);
    }

    // REVEALING -> RESULT
    if (appState === "REVEALING") {
      const timer = setTimeout(() => {
        setAppState("RESULT");
        // Haptics: 結果が出た時の重い衝撃
        triggerHaptic({
          type: "impact",
          style: Haptics.ImpactFeedbackStyle.Heavy,
        });
        soundManager.playSound("result");
      }, REVEALING_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleReset = () => {
    resetFortune();
    setAppState("IDLE");
  };

  // --- 描画 (Render) ---

  return (
    <View className="flex-1 bg-slate-900">
      <ImageBackground
        source={require("../assets/shrine_background.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View className="flex-1 items-center justify-center bg-black/40 relative overflow-hidden">
          {/* 待機状態 (IDLE) */}
          {appState === "IDLE" && (
            <MotiView
              from={{ opacity: 0, scale: 0.9, translateY: 10 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              className="items-center px-6"
            >
              <View
                className="bg-white/10 p-2 rounded-full border border-white/20 mb-8 backdrop-blur-md shadow-lg overflow-hidden items-center justify-center"
                style={{ width: 184, height: 184 }}
              >
                <Image
                  source={require("../assets/omikuji_cylinder.png")}
                  className="rounded-full"
                  style={{ width: 180, height: 180, opacity: hasDrawnToday ? 0.5 : 1 }}
                  resizeMode="cover"
                />
              </View>
              <Text className="text-3xl text-white font-shippori-bold tracking-tight mb-2 text-center">
                {hasDrawnToday ? "本日の運勢は確認済みです" : "スマホを振っておみくじを引こう"}
              </Text>

              {!hasDrawnToday && (
                <View className="bg-red-600 px-4 py-1 rounded-full mt-4">
                  <Text className="text-white font-bold text-sm tracking-widest">
                    令和七年 デジタルおみくじ
                  </Text>
                </View>
              )}

              {hasDrawnToday && (
                <TouchableOpacity
                  onPress={handleResultView}
                  className="bg-amber-500 px-8 py-3 rounded-full mt-6 shadow-lg active:bg-amber-600"
                >
                  <Text className="text-white font-bold text-lg">結果をもう一度見る</Text>
                </TouchableOpacity>
              )}
            </MotiView>
          )}

          {/* シェイク中 (SHAKING) */}
          {appState === "SHAKING" && (
            <MotiView
              from={{
                translateX: -SHAKE_ANIMATION.TRANSLATE_X,
                rotateZ: `-${SHAKE_ANIMATION.ROTATE_Z_DEG}deg`,
                scale: SHAKE_ANIMATION.SCALE_FROM,
              }}
              animate={{
                translateX: SHAKE_ANIMATION.TRANSLATE_X,
                rotateZ: `${SHAKE_ANIMATION.ROTATE_Z_DEG}deg`,
                scale: SHAKE_ANIMATION.SCALE_TO,
              }}
              transition={{
                type: "timing",
                duration: SHAKE_ANIMATION.DURATION,
                loop: true,
                repeatReverse: true,
              }}
              className="items-center"
            >
              <Text className="text-9xl mb-6">🫨</Text>
              <MotiView
                from={{ opacity: 0.5, scale: 1 }}
                animate={{ opacity: 1, scale: 1.2 }}
                transition={{
                  type: "timing",
                  duration: SHAKE_ANIMATION.TEXT_PULSE_DURATION,
                  loop: true,
                  repeatReverse: true,
                }}
              >
                <Text className="text-xl text-yellow-400 font-shippori-bold mt-8 tracking-widest uppercase bg-black/50 px-6 py-2 rounded-full border border-yellow-400/50">
                  念を込めて...
                </Text>
              </MotiView>
            </MotiView>
          )}

          {/* 抽選中 (DRAWING) */}
          {appState === "DRAWING" && <DrawingOverlay />}

          {/* 結果表示中 (REVEALING - 棒が出るアニメ) */}
          {appState === "REVEALING" && (
            <View className="items-center relative h-64 w-full justify-end">
              <MotiView
                from={{ translateY: 200, rotate: "180deg" }}
                animate={{ translateY: 0, rotate: "0deg" }}
                transition={{
                  type: "spring",
                  damping: REVEAL_ANIMATION.BOX_SPRING_DAMPING,
                }}
                className="w-40 h-48 bg-red-800 rounded-lg border-4 border-yellow-600 z-20 shadow-2xl flex items-center justify-center"
              >
                <View className="w-20 h-2 bg-yellow-600/30 rounded-full mb-2" />
                <View className="w-16 h-2 bg-yellow-600/30 rounded-full" />
              </MotiView>

              <MotiView
                className="absolute w-16 h-48 bg-amber-50 bottom-12 z-10 rounded-t-lg border-x-2 border-t-2 border-amber-200 items-center justify-start pt-4 shadow-lg"
                from={{ translateY: 100, opacity: 0 }}
                animate={{ translateY: -100, opacity: 1 }}
                transition={{
                  type: "spring",
                  delay: REVEAL_ANIMATION.STICK_APPEAR_DELAY,
                  damping: REVEAL_ANIMATION.STICK_SPRING_DAMPING,
                  stiffness: REVEAL_ANIMATION.STICK_SPRING_STIFFNESS,
                }}
              >
                <Text className="text-red-700 font-shippori-bold text-sm text-center leading-tight">
                  {"2026\n奉\n納"}
                </Text>
              </MotiView>

              {/* キラキラエフェクト */}
              <MotiView
                from={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1.5 }}
                transition={{
                  delay: REVEAL_ANIMATION.SPARKLE_APPEAR_DELAY,
                  type: "timing",
                  duration: REVEAL_ANIMATION.SPARKLE_DURATION,
                }}
                className="absolute -top-10 z-0 bg-yellow-400/30 w-40 h-40 rounded-full blur-xl"
              />
            </View>
          )}

          {/* 結果画面 (コンポーネント) */}
          {appState === "RESULT" && fortune && (
            <FortuneDisplay fortune={fortune} onReset={handleReset} />
          )}

          {/* デバッグボタン (開発時 または センサー無効時) */}
          {(showDebug || isSensorAvailable === false) && appState === "IDLE" && (
            <TouchableOpacity
              onPress={handleShakeStart}
              className="absolute bottom-16 right-6 bg-amber-500 py-3 px-6 rounded-full shadow-lg border-2 border-white items-center justify-center active:bg-amber-600"
            >
              <Text className="text-white font-bold">
                {isSensorAvailable === false ? "おみくじを引く" : "🔧 デバッグ"}
              </Text>
            </TouchableOpacity>
          )}

          {/* 履歴画面へのナビゲーションボタン */}
          {appState === "IDLE" && (
            <>
              <TouchableOpacity
                onPress={() => router.push("/history")}
                className="absolute bottom-16 left-6 bg-slate-700/80 py-3 px-5 rounded-full shadow-lg border border-white/30 items-center justify-center active:bg-slate-600"
              >
                <Text className="text-white font-bold">履歴</Text>
              </TouchableOpacity>

              {/* ミュート切り替えボタン */}
              <TouchableOpacity
                onPress={toggleMute}
                className="absolute top-12 left-6 bg-black/30 p-3 rounded-full border border-white/20 active:bg-black/50"
              >
                <Text className="text-2xl">{isMuted ? "🔇" : "🔊"}</Text>
              </TouchableOpacity>

              {/* デプロイバージョン表示 */}
              <VersionDisplay />
            </>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}
