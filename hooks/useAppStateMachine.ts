import { useCallback, useEffect, useReducer, useRef } from "react";
import * as Haptics from "expo-haptics";
import { triggerHaptic } from "../utils/haptics";

export type AppState = "IDLE" | "SHAKING" | "DRAWING" | "REVEALING" | "RESULT";

type AppAction =
  | { type: "START_SHAKE" }
  | { type: "START_DRAWING" }
  | { type: "START_REVEALING" }
  | { type: "SHOW_RESULT" }
  | { type: "SHOW_STORED_RESULT" }
  | { type: "RESET" };

function appStateReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "START_SHAKE":
      return state === "IDLE" ? "SHAKING" : state;
    case "START_DRAWING":
      return state === "SHAKING" ? "DRAWING" : state;
    case "START_REVEALING":
      return state === "DRAWING" ? "REVEALING" : state;
    case "SHOW_RESULT":
      return state === "REVEALING" ? "RESULT" : state;
    case "SHOW_STORED_RESULT":
      return state === "IDLE" ? "RESULT" : state;
    case "RESET":
      return "IDLE";
    default:
      return state;
  }
}

const SHAKING_DURATION_MS = 1500;
const DRAWING_DURATION_MS = 3500;
const REVEALING_DURATION_MS = 2000;
const REDUCED_DRAWING_DURATION_MS = 600;
const REDUCED_REVEALING_DURATION_MS = 350;
const HAPTIC_INTERVAL_MS = 150;

interface UseAppStateMachineOptions {
  reducedMotion: boolean;
  drawFortune: () => Promise<unknown>;
  resetFortune: () => void;
  playSound: (key: string) => void;
  hasDrawnToday: boolean;
  hasFortune: boolean;
}

export function useAppStateMachine({
  reducedMotion,
  drawFortune,
  resetFortune,
  playSound,
  hasDrawnToday,
  hasFortune,
}: UseAppStateMachineOptions) {
  const [appState, dispatch] = useReducer(appStateReducer, "IDLE");

  // 同一フレーム内の多重発火（連打・センサー + タップ同時発火）を同期的に防ぐ。
  // useReducer の state 反映は非同期のため、appState ガードだけでは不十分。
  const shakeStartedRef = useRef(false);

  const drawingDuration = reducedMotion ? REDUCED_DRAWING_DURATION_MS : DRAWING_DURATION_MS;
  const revealingDuration = reducedMotion ? REDUCED_REVEALING_DURATION_MS : REVEALING_DURATION_MS;

  // --- Actions ---

  const handleShakeStart = useCallback(() => {
    if (appState !== "IDLE" || hasDrawnToday) return;
    if (shakeStartedRef.current) return;
    shakeStartedRef.current = true;

    triggerHaptic(
      { type: "impact", style: Haptics.ImpactFeedbackStyle.Medium },
      false,
      reducedMotion
    );

    dispatch({ type: "START_SHAKE" });
    playSound("shake");
  }, [appState, hasDrawnToday, playSound, reducedMotion]);

  const handleResultView = useCallback(() => {
    if (hasFortune) {
      dispatch({ type: "SHOW_STORED_RESULT" });
    }
  }, [hasFortune]);

  const handleReset = useCallback(() => {
    resetFortune();
    dispatch({ type: "RESET" });
  }, [resetFortune]);

  // --- Side effects driven by state ---

  // Reset the double-fire guard whenever we return to IDLE (enables re-draw after RESET).
  useEffect(() => {
    if (appState === "IDLE") {
      shakeStartedRef.current = false;
    }
  }, [appState]);

  // SHAKING: periodic haptic feedback
  useEffect(() => {
    if (appState !== "SHAKING") return;

    const intervalId = setInterval(() => {
      triggerHaptic(
        { type: "impact", style: Haptics.ImpactFeedbackStyle.Light },
        false,
        reducedMotion
      );
    }, HAPTIC_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [appState, reducedMotion]);

  // SHAKING → DRAWING (timer owns the drawFortune side effect)
  useEffect(() => {
    if (appState !== "SHAKING") return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      await drawFortune();
      if (cancelled) return;
      dispatch({ type: "START_DRAWING" });
      triggerHaptic(
        { type: "impact", style: Haptics.ImpactFeedbackStyle.Light },
        false,
        reducedMotion
      );
    }, SHAKING_DURATION_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [appState, drawFortune, reducedMotion]);

  // DRAWING → REVEALING (auto-advance)
  useEffect(() => {
    if (appState !== "DRAWING") return;

    const timer = setTimeout(() => {
      dispatch({ type: "START_REVEALING" });
      triggerHaptic(
        { type: "notification", style: Haptics.NotificationFeedbackType.Success },
        true
      );
    }, drawingDuration);

    return () => clearTimeout(timer);
  }, [appState, drawingDuration]);

  // REVEALING → RESULT (auto-advance)
  useEffect(() => {
    if (appState !== "REVEALING") return;

    const timer = setTimeout(() => {
      dispatch({ type: "SHOW_RESULT" });
      triggerHaptic({ type: "impact", style: Haptics.ImpactFeedbackStyle.Heavy }, true);
      playSound("result");
    }, revealingDuration);

    return () => clearTimeout(timer);
  }, [appState, playSound, revealingDuration]);

  return {
    appState,
    handleShakeStart,
    handleResultView,
    handleReset,
  };
}
