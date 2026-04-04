import React, { useCallback, useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Platform, useWindowDimensions } from "react-native";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Accelerometer } from "expo-sensors";
import { useOmikujiLogic } from "../hooks/useOmikujiLogic";
import { VersionDisplay } from "../components/VersionDisplay";
import { soundManager } from "../utils/SoundManager";
import { ExperienceScreenTemplate } from "../components/templates/ExperienceScreenTemplate";
import { IdleRitualPattern } from "../components/patterns/IdleRitualPattern";
import { ShakingPattern } from "../components/patterns/ShakingPattern";
import { ResultPattern } from "../components/patterns/ResultPattern";
import { RitualProgressOverlay } from "../components/design-system/RitualProgressOverlay";
import { RevealStickStage } from "../components/design-system/RevealStickStage";
import { Button } from "../components/design-system/Button";
import { MuteToggle } from "../components/design-system/MuteToggle";
import { PageHeader } from "../components/design-system/PageHeader";

type AppState = "IDLE" | "SHAKING" | "DRAWING" | "REVEALING" | "RESULT";

const SHAKE_THRESHOLD = 1.8;
const SHAKING_DURATION_MS = 1500;
const DRAWING_DURATION_MS = 3500;
const REVEALING_DURATION_MS = 2000;
const REDUCED_DRAWING_DURATION_MS = 600;
const REDUCED_REVEALING_DURATION_MS = 350;

type HapticFeedbackType =
  | { type: "impact"; style: Haptics.ImpactFeedbackStyle }
  | { type: "notification"; style: Haptics.NotificationFeedbackType };

interface Subscription {
  remove: () => void;
}

function triggerHaptic(feedback: HapticFeedbackType, force = false, reducedMotion = false) {
  if (Platform.OS === "web") return;
  if (reducedMotion && !force) return;

  if (feedback.type === "impact") {
    Haptics.impactAsync(feedback.style);
  } else {
    Haptics.notificationAsync(feedback.style);
  }
}

export default function OmikujiApp() {
  const { height: viewportHeight } = useWindowDimensions();
  const [appState, setAppState] = useState<AppState>("IDLE");
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const subscription = useRef<Subscription | null>(null);
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { fortune, drawFortune, resetFortune, hasDrawnToday } = useOmikujiLogic();

  const appVariant =
    Constants.expoConfig?.extra?.appVariant ?? (__DEV__ ? "development" : "production");
  const showDebug = appVariant === "development";
  const isCompactLayout = viewportHeight < 720;
  const drawingDuration = reducedMotion ? REDUCED_DRAWING_DURATION_MS : DRAWING_DURATION_MS;
  const revealingDuration = reducedMotion ? REDUCED_REVEALING_DURATION_MS : REVEALING_DURATION_MS;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);
    const motionSubscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReducedMotion
    );
    return () => {
      motionSubscription.remove();
    };
  }, []);

  useEffect(() => {
    async function initSounds() {
      await soundManager.initialize();
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

    async function setupSensor() {
      if (Platform.OS === "web") {
        return;
      }

      try {
        const available = await Accelerometer.isAvailableAsync();
        if (available) {
          Accelerometer.setUpdateInterval(100);
          subscription.current = Accelerometer.addListener(setData);
        }
      } catch (error) {
        console.warn("Accelerometer initialization failed:", error);
      }
    }

    initSounds();
    setupSensor();

    return () => {
      subscription.current?.remove();
      soundManager.unloadAll();
    };
  }, []);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (appState === "SHAKING") {
      intervalId = setInterval(() => {
        triggerHaptic(
          { type: "impact", style: Haptics.ImpactFeedbackStyle.Light },
          false,
          reducedMotion
        );
      }, 150);
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

  const handleResultView = useCallback(() => {
    if (fortune) {
      setAppState("RESULT");
    }
  }, [fortune]);

  const handleShakeStart = useCallback(async () => {
    if (appState !== "IDLE" || hasDrawnToday) return;

    triggerHaptic(
      { type: "impact", style: Haptics.ImpactFeedbackStyle.Medium },
      false,
      reducedMotion
    );

    setAppState("SHAKING");
    soundManager.playSound("shake");

    shakeTimerRef.current = setTimeout(async () => {
      await drawFortune();
      setAppState("DRAWING");
      triggerHaptic(
        { type: "impact", style: Haptics.ImpactFeedbackStyle.Light },
        false,
        reducedMotion
      );
    }, SHAKING_DURATION_MS);
  }, [appState, drawFortune, hasDrawnToday, reducedMotion]);

  useEffect(() => {
    if (appState === "IDLE") {
      const totalForce = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
      if (totalForce > SHAKE_THRESHOLD) {
        handleShakeStart();
      }
    }
  }, [appState, data, handleShakeStart]);

  useEffect(() => {
    return () => {
      if (shakeTimerRef.current) {
        clearTimeout(shakeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (appState === "DRAWING") {
      const timer = setTimeout(() => {
        setAppState("REVEALING");
        triggerHaptic(
          { type: "notification", style: Haptics.NotificationFeedbackType.Success },
          true
        );
      }, drawingDuration);
      return () => clearTimeout(timer);
    }

    if (appState === "REVEALING") {
      const timer = setTimeout(() => {
        setAppState("RESULT");
        triggerHaptic({ type: "impact", style: Haptics.ImpactFeedbackStyle.Heavy }, true);
        soundManager.playSound("result");
      }, revealingDuration);
      return () => clearTimeout(timer);
    }
  }, [appState, drawingDuration, revealingDuration]);

  const handleReset = useCallback(() => {
    resetFortune();
    setAppState("IDLE");
  }, [resetFortune]);

  const header = (
    <PageHeader
      title="新春デジタルおみくじ"
      subtitle="静かに引き、丁寧に受け取るための一枚"
      tone="experience"
      leadingAction={<MuteToggle isMuted={isMuted} onToggle={toggleMute} />}
    />
  );

  const historyAction = (
    <Button
      label="履歴"
      onPress={() => router.push("/history")}
      variant="secondaryQuiet"
      accessibilityLabel="履歴を見る"
      accessibilityHint="これまでに引いたおみくじの履歴を表示します"
    />
  );

  const debugAction = showDebug ? (
    <Button
      label="デバッグ"
      onPress={handleShakeStart}
      variant="utilityWarm"
      accessibilityLabel="デバッグ用に強制実行"
    />
  ) : null;

  return (
    <ExperienceScreenTemplate
      topBar={header}
      bottomLeftAction={appState === "IDLE" ? historyAction : undefined}
      bottomRightAction={appState === "IDLE" ? debugAction : undefined}
      footer={appState === "IDLE" && !isCompactLayout ? <VersionDisplay /> : undefined}
      overlayLabel={
        appState === "DRAWING"
          ? "運命を紐解いています"
          : appState === "REVEALING"
            ? "おみくじを開いています"
            : appState === "RESULT" && fortune
              ? "おみくじ結果"
              : undefined
      }
      overlay={
        appState === "DRAWING" ? (
          <RitualProgressOverlay reducedMotion={reducedMotion} />
        ) : appState === "REVEALING" ? (
          <RevealStickStage reducedMotion={reducedMotion} />
        ) : appState === "RESULT" && fortune ? (
          <ResultPattern fortune={fortune} onReset={handleReset} reducedMotion={reducedMotion} />
        ) : null
      }
    >
      {appState === "IDLE" ? (
        <IdleRitualPattern
          hasDrawnToday={hasDrawnToday}
          onDraw={handleShakeStart}
          onShowResult={handleResultView}
        />
      ) : null}

      {appState === "SHAKING" ? <ShakingPattern reducedMotion={reducedMotion} /> : null}
    </ExperienceScreenTemplate>
  );
}
