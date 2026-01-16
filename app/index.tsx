import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ImageBackground,
  Image,
  AccessibilityInfo,
  Share,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import { MotiView } from "moti";
import * as Haptics from "expo-haptics";
import Constants from "expo-constants";
import { router, useFocusEffect } from "expo-router";
import { useOmikujiLogic } from "../hooks/useOmikujiLogic";
import FortuneDisplay from "../components/FortuneDisplay";
import { VersionDisplay } from "../components/VersionDisplay";
import { soundManager } from "../utils/SoundManager";
import { getLastResultAction, ResultAction } from "../utils/HistoryStorage";
// global.css is imported in _layout.tsx

import { DrawingOverlay } from "../components/DrawingOverlay";
import { ShakingOverlay } from "../components/ShakingOverlay";

// Web環境固有のスタイル定義は必要に応じて拡張可
// Import DrawingOverlay

// ... (other imports)

// ステートマシン
type AppState = "IDLE" | "SHAKING" | "DRAWING" | "REVEALING" | "RESULT";

const SHAKE_THRESHOLD = 1.8;
const SHAKING_DURATION_MS = 1500;
// DRAWING_DURATION_MS was increased from 1200ms to 3500ms to give users enough time
// to perceive the full drawing animation and keep it in sync with sound/haptic effects.
const DRAWING_DURATION_MS = 3500;
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

const DRAW_BUTTON_STYLE =
  Platform.OS === "web"
    ? { boxShadow: "0px 6px 14px rgba(180,83,9,0.5)" }
    : {
      shadowColor: "#B45309",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
    };

const OMIKUJI_FRAME_SIZE = 184;
const OMIKUJI_IMAGE_SIZE = OMIKUJI_FRAME_SIZE;

// ハプティックフィードバックヘルパー
type HapticFeedbackType =
  | { type: "impact"; style: Haptics.ImpactFeedbackStyle }
  | { type: "notification"; style: Haptics.NotificationFeedbackType };

const triggerHaptic = (feedback: HapticFeedbackType, force = false, reducedMotion = false) => {
  if (Platform.OS === "web") return;
  if (reducedMotion && !force) return; // Skip minor haptics if reduced motion is enabled

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
  const [_isSensorAvailable, setIsSensorAvailable] = useState<boolean | null>(null);
  const subscription = useRef<Subscription | null>(null);
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    fortune,
    hasDrawnToday,
    drawFortune,
    resetFortune,
    checkDailyStatus,
    lastResultAction,
    debugResetDailyLimit,
  } = useOmikujiLogic();

  // デバッグボタン用判定
  const appVariant = Constants.expoConfig?.extra?.appVariant || "production";
  const showDebug = appVariant === "development" || __DEV__;

  const [isMuted, setIsMuted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // useOmikujiLogic 側の状態を使用するためローカルステートは削除

  // 画面がフォーカスされるたびに状態をチェック（履歴削除後の同期用）
  useFocusEffect(
    useCallback(() => {
      if (typeof checkDailyStatus === "function") {
        checkDailyStatus();
      } else {
        console.warn("checkDailyStatus is not a function", checkDailyStatus);
      }
    }, [checkDailyStatus])
  );
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReducedMotion
    );
    return () => {
      subscription.remove();
    };
  }, []);

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

  // --- おみくじを振る際の小刻みな振動（儀式性向上） ---
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (appState === "SHAKING") {
      // 儀式感を出すために小刻みな振動を繰り返す
      intervalId = setInterval(() => {
        triggerHaptic(
          {
            type: "impact",
            style: Haptics.ImpactFeedbackStyle.Light,
          },
          false,
          reducedMotion
        );
      }, 150); // 150ms間隔で振動
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [appState, reducedMotion]);

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
    triggerHaptic(
      {
        type: "impact",
        style: Haptics.ImpactFeedbackStyle.Medium,
      },
      false,
      reducedMotion
    );

    setAppState("SHAKING");
    soundManager.playSound("shake");

    // シェイク終了 -> 抽選演出 (DRAWING) へ
    shakeTimerRef.current = setTimeout(async () => {
      // 抽選ロジックはここで確定させるが、ユーザーにはまだ見せない
      await drawFortune();
      setAppState("DRAWING");

      // Haptics: 抽選中への切り替わり
      triggerHaptic(
        {
          type: "impact",
          style: Haptics.ImpactFeedbackStyle.Light,
        },
        false,
        reducedMotion
      );
    }, SHAKING_DURATION_MS);
  }, [appState, drawFortune, hasDrawnToday, reducedMotion]);

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
    // DRAWING -> RESULT (REVEALINGフェーズをスキップ)
    if (appState === "DRAWING") {
      const timer = setTimeout(() => {
        setAppState("RESULT");
        // Haptics: 結果が出た時の重い衝撃 (FORCE)
        triggerHaptic(
          {
            type: "impact",
            style: Haptics.ImpactFeedbackStyle.Heavy,
          },
          true
        );
        soundManager.playSound("result");
      }, DRAWING_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleReset = () => {
    resetFortune();
    setAppState("IDLE");
  };

  // --- 描画 (Render) ---

  return (
    // Note: Inline style is intentional fallback for Android white screen issue.
    // NativeWind styles may not apply immediately on first render, causing a white flash.
    // The inline backgroundColor ensures the view is never transparent during initialization.
    <View
      className="flex-1 bg-slate-900"
      style={{
        width: "100%",
        backgroundColor: "#0f172a",
        ...(Platform.OS === "web"
          ? ({
            height: "100vh",
            overflow: "hidden",
          } as any)
          : {
            flex: 1,
          }),
      }}
    >
      <ImageBackground
        source={require("../assets/shrine_background.png")}
        style={{ flex: 1, width: "100%" }}
        imageStyle={{
          ...(Platform.OS === "web" ? ({ backgroundPosition: "center" } as any) : {}),
        }}
        resizeMode="cover"
      >
        <MotiView
          animate={{
            translateX: appState === "SHAKING" ? [-2, 2, -2, 2, 0] : 0,
            translateY: appState === "SHAKING" ? [-1, 1, -1, 1, 0] : 0,
          }}
          transition={{
            type: "timing",
            duration: 100,
            loop: appState === "SHAKING",
          }}
          style={{ flex: 1 }}
        >
          <View
            style={{ flex: 1 }}
            className="items-center justify-center bg-black/40 relative overflow-hidden"
          >
            {/* 待機状態 (IDLE) */}
            {appState === "IDLE" && (
              <MotiView
                from={{ opacity: 1, scale: 1, translateY: 0 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                className="items-center px-6"
              >
                {/* おみくじ画像（確認済みの場合はアクションに応じて分岐） */}
                {hasDrawnToday ? (
                  <MotiView
                    from={
                      reducedMotion
                        ? { opacity: 0, scale: 1 }
                        : { opacity: 0, scale: 0.8, translateY: -20 }
                    }
                    animate={
                      reducedMotion
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 1, scale: 1, translateY: 0 }
                    }
                    transition={
                      reducedMotion
                        ? { type: "timing", duration: 300 }
                        : {
                          type: "spring",
                          damping: 12,
                          stiffness: 200,
                          mass: 0.8,
                        }
                    }
                    className="mb-8 items-center"
                  >
                    {/* アクションに応じたアニメーション（円形フレーム付き） */}
                    <MotiView
                      from={{ scale: lastResultAction === "tie" ? 1.15 : 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "timing",
                        duration: 300,
                        delay: 100,
                      }}
                    >
                      <View
                        className="bg-white/10 rounded-full border border-white/20 backdrop-blur-md shadow-lg overflow-hidden items-center justify-center self-center"
                        style={{ width: OMIKUJI_FRAME_SIZE, height: OMIKUJI_FRAME_SIZE }}
                      >
                        <Image
                          source={
                            lastResultAction === "keep"
                              ? require("../assets/omikuji_takehome.png")
                              : require("../assets/omikuji_confirmed.png")
                          }
                          style={{
                            width: OMIKUJI_IMAGE_SIZE,
                            height: OMIKUJI_IMAGE_SIZE,
                          }}
                          resizeMode="contain"
                        />
                      </View>
                    </MotiView>
                    {/* 余韻のエフェクト */}
                    {!reducedMotion && (
                      <MotiView
                        from={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.2, 1.5] }}
                        transition={{
                          type: "timing",
                          duration: 400,
                          delay: 350,
                        }}
                        className="absolute w-48 h-48 rounded-full"
                        style={{
                          backgroundColor:
                            lastResultAction === "keep"
                              ? "rgba(147, 197, 253, 0.15)" // 青系（持ち帰り）
                              : "rgba(253, 224, 71, 0.15)", // 黄系（結ぶ）
                        }}
                      />
                    )}
                  </MotiView>
                ) : (
                  <View
                    className="bg-white/10 rounded-full border border-white/20 mb-8 backdrop-blur-md shadow-lg overflow-hidden items-center justify-center self-center"
                    style={{ width: OMIKUJI_FRAME_SIZE, height: OMIKUJI_FRAME_SIZE }}
                  >
                    <Image
                      source={require("../assets/omikuji_cylinder.png")}
                      style={{
                        width: OMIKUJI_IMAGE_SIZE,
                        height: OMIKUJI_IMAGE_SIZE,
                        borderRadius: OMIKUJI_IMAGE_SIZE / 2,
                      }}
                      resizeMode="contain"
                    />
                  </View>
                )}

                <Text
                  className="text-2xl text-white font-shippori-bold tracking-tight mb-6 text-center shadow-lg"
                  style={{ textDecorationLine: "none" }}
                >
                  {hasDrawnToday
                    ? lastResultAction === "keep"
                      ? "おみくじを持ち帰りました"
                      : "おみくじを結びました"
                    : "スマホを振っておみくじを引こう"}
                </Text>

                {/* サブメッセージ（確認済みの場合） */}
                {hasDrawnToday && (
                  <Text
                    className="text-base text-white/70 font-shippori mb-4 text-center"
                    style={{ letterSpacing: 0.5 }}
                  >
                    {lastResultAction === "keep"
                      ? "ときどき読み返して、今日の指針に。"
                      : "良いご縁が結ばれますように…"}
                  </Text>
                )}

                {!hasDrawnToday && (
                  <>
                    <TouchableOpacity
                      onPress={handleShakeStart}
                      className="bg-red-600 px-10 py-5 rounded-full border-4 border-amber-400 shadow-2xl shadow-red-900/50 active:scale-95 transition-transform"
                      style={DRAW_BUTTON_STYLE}
                      accessibilityLabel="おみくじを引く"
                      accessibilityHint="スマートフォンを振るか、このボタンをタップしておみくじを引きます"
                      accessibilityRole="button"
                    >
                      <Text className="text-white font-shippori-bold text-xl tracking-widest text-center">
                        おみくじを引く
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {hasDrawnToday && (
                  <View className="flex-row gap-3 mt-4">
                    <TouchableOpacity
                      onPress={async () => {
                        if (Platform.OS !== "web") {
                          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }
                        const message = `🎍 本日の運勢を確認しました！\n#デジタルおみくじ #令和八年`;
                        try {
                          await Share.share({ message });
                        } catch (error) {
                          console.error("Share failed:", error);
                        }
                      }}
                      className="flex-1 bg-white/20 px-6 py-4 rounded-full border border-white/30 shadow-xl active:bg-white/30 items-center justify-center"
                      accessibilityLabel="シェア"
                      accessibilityRole="button"
                    >
                      <Text className="text-white font-shippori font-bold text-base tracking-wider text-center">
                        シェア
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleResultView}
                      className="flex-1 bg-slate-800/90 px-6 py-4 rounded-full border border-white/30 shadow-xl active:bg-slate-700 items-center justify-center"
                      accessibilityLabel="結果をもう一度見る"
                      accessibilityRole="button"
                    >
                      <Text className="text-white font-shippori font-bold text-base tracking-wider text-center">
                        結果を見る
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </MotiView>
            )}

            {/* シェイク中 (SHAKING) */}
            {appState === "SHAKING" && <ShakingOverlay reducedMotion={reducedMotion} />}

            {/* 抽選中 (DRAWING) */}
            {appState === "DRAWING" && <DrawingOverlay reducedMotion={reducedMotion} />}



            {/* 結果画面 (コンポーネント) */}
            {appState === "RESULT" && fortune && (
              <FortuneDisplay
                fortune={fortune}
                onReset={handleReset}
                reducedMotion={reducedMotion}
                hasSelectedAction={lastResultAction !== null}
              />
            )}

            {/* デバッグボタン (開発時のみ - センサー無効時は中央ボタンで対応) */}
            {showDebug && appState === "IDLE" && (
              <TouchableOpacity
                onPress={async () => {
                  await debugResetDailyLimit();
                  handleShakeStart();
                }}
                className="absolute bottom-16 right-6 bg-amber-500 py-3 px-6 rounded-full shadow-lg border-2 border-white items-center justify-center active:bg-amber-600"
                accessibilityLabel="デバッグ用に強制実行"
                accessibilityRole="button"
              >
                <Text className="text-white font-bold">🔧 デバッグ</Text>
              </TouchableOpacity>
            )}

            {/* 履歴画面へのナビゲーションボタン */}
            {appState === "IDLE" && (
              <>
                {/* ヘッダーボタン群 */}
                {/* ヘッダーボタン群 */}
                <TouchableOpacity
                  onPress={() => router.push("/history")}
                  className="absolute top-12 right-6 bg-slate-700/80 w-[52px] h-[52px] rounded-full shadow-lg border border-white/30 items-center justify-center active:bg-slate-600"
                  accessibilityLabel="履歴を見る"
                  accessibilityHint="これまでに引いたおみくじの履歴を表示します"
                  accessibilityRole="button"
                >
                  <Text className="text-white font-bold text-xs">履歴</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={toggleMute}
                  className="absolute top-12 left-6 bg-black/40 w-[52px] h-[52px] rounded-full border border-white/30 active:bg-black/60 items-center justify-center"
                  accessibilityLabel={isMuted ? "音声をオンにする" : "音声をオフにする"}
                  accessibilityRole="button"
                >
                  <Text className="text-xl">{isMuted ? "🔕" : "🔔"}</Text>
                </TouchableOpacity>

                {/* デプロイバージョン表示 */}
                <VersionDisplay />
              </>
            )}

            {appState === "IDLE" && !hasDrawnToday && (
              <View className="absolute bottom-8 bg-white/10 px-4 py-1 rounded-full border border-white/20">
                <Text className="text-white/80 font-bold text-xs tracking-widest leading-tight">
                  令和八年 丙午 デジタルおみくじ
                </Text>
              </View>
            )}
          </View>
        </MotiView>
      </ImageBackground>
    </View>
  );
}
