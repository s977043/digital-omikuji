import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useOmikujiLogic } from "../hooks/useOmikujiLogic";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useShakeDetection } from "../hooks/useShakeDetection";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { triggerHaptic } from "../utils/haptics";
import { COMPACT_HEIGHT_BREAKPOINT } from "../constants/layout";
import { VersionDisplay } from "../components/VersionDisplay";
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
const HAPTIC_INTERVAL_MS = 150;

export default function OmikujiApp() {
  const { t } = useTranslation();
  const { height: viewportHeight } = useWindowDimensions();
  const [appState, setAppState] = useState<AppState>("IDLE");
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { fortune, drawFortune, resetFortune, hasDrawnToday } = useOmikujiLogic();
  const reducedMotion = useReducedMotion();
  const { isMuted, toggleMute, playSound } = useSoundEffects();

  const appVariant =
    Constants.expoConfig?.extra?.appVariant ?? (__DEV__ ? "development" : "production");
  const showDebug = appVariant === "development";
  const isCompactLayout = viewportHeight < COMPACT_HEIGHT_BREAKPOINT;
  const drawingDuration = reducedMotion ? REDUCED_DRAWING_DURATION_MS : DRAWING_DURATION_MS;
  const revealingDuration = reducedMotion ? REDUCED_REVEALING_DURATION_MS : REVEALING_DURATION_MS;

  const handleShakeStart = useCallback(async () => {
    if (appState !== "IDLE" || hasDrawnToday) return;

    triggerHaptic(
      { type: "impact", style: Haptics.ImpactFeedbackStyle.Medium },
      false,
      reducedMotion
    );

    setAppState("SHAKING");
    playSound("shake");

    shakeTimerRef.current = setTimeout(async () => {
      await drawFortune();
      setAppState("DRAWING");
      triggerHaptic(
        { type: "impact", style: Haptics.ImpactFeedbackStyle.Light },
        false,
        reducedMotion
      );
    }, SHAKING_DURATION_MS);
  }, [appState, drawFortune, hasDrawnToday, playSound, reducedMotion]);

  useShakeDetection({
    enabled: appState === "IDLE" && !hasDrawnToday,
    threshold: SHAKE_THRESHOLD,
    onShake: handleShakeStart,
  });

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (appState === "SHAKING") {
      intervalId = setInterval(() => {
        triggerHaptic(
          { type: "impact", style: Haptics.ImpactFeedbackStyle.Light },
          false,
          reducedMotion
        );
      }, HAPTIC_INTERVAL_MS);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [appState, reducedMotion]);

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
        playSound("result");
      }, revealingDuration);
      return () => clearTimeout(timer);
    }
  }, [appState, drawingDuration, playSound, revealingDuration]);

  const handleResultView = useCallback(() => {
    if (fortune) {
      setAppState("RESULT");
    }
  }, [fortune]);

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
      footer={
        appState === "IDLE" && !isCompactLayout ? (
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textAlign: "center" }}>
              {t("disclaimer.inline")}
            </Text>
            <VersionDisplay />
          </View>
        ) : undefined
      }
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
