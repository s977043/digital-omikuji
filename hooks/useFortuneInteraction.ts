import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, ToastAndroid } from "react-native";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { triggerHaptic } from "../utils/haptics";

export const FORTUNE_ANIMATION_TIMING = {
  tie: 1200,
  keep: 800,
} as const;

export type FortuneExitAnimation = "tie" | "keep" | null;

interface UseFortuneInteractionOptions {
  reducedMotion: boolean;
  onReset: () => void;
}

interface UseFortuneInteractionReturn {
  exitAnimation: FortuneExitAnimation;
  showTiedComplete: boolean;
  handleTie: () => void;
  handleKeep: () => void;
}

/**
 * おみくじ結果画面の Tie/Keep インタラクションを扱うカスタムフック。
 *
 * - Tie: 結果を「結ぶ」（お守りとして残す）→ アニメーション後に完了画面を表示
 * - Keep: 結果を「持ち帰る」→ アニメーション後に `onReset` を呼び出し、元の画面に戻る
 *
 * 内部で以下を管理する:
 * - アニメーション状態（`exitAnimation`）と完了状態（`showTiedComplete`）
 * - 各アクションの setTimeout 参照とアンマウント時のクリーンアップ
 * - `triggerHaptic` による通知ハプティクス（`reducedMotion` を尊重）
 * - Android の `ToastAndroid` による確認フィードバック
 *
 * 二重実行ガード（`exitAnimation != null` の場合は無視）により、
 * 既にアニメーション中にもう一度ボタンが押されても副作用が発生しない。
 */
export function useFortuneInteraction({
  reducedMotion,
  onReset,
}: UseFortuneInteractionOptions): UseFortuneInteractionReturn {
  const { t } = useTranslation();
  const tieTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 二重実行ガードを useRef で実装。state ベースだと同期的な連続呼び出し
  // （連打、プログラム的トリガー）に対して setState の非同期更新が間に合わず
  // 副作用が複数回走る可能性があるため、ref で即座にロックする。
  const lockedRef = useRef(false);
  const [exitAnimation, setExitAnimation] = useState<FortuneExitAnimation>(null);
  const [showTiedComplete, setShowTiedComplete] = useState(false);

  useEffect(() => {
    return () => {
      if (tieTimerRef.current) clearTimeout(tieTimerRef.current);
      if (keepTimerRef.current) clearTimeout(keepTimerRef.current);
      // unmount 時にロックを解除。再マウント時に新規 ref で初期化されるため通常は
      // 冗長だが、StrictMode 下の double-invoke や HMR で同一インスタンスが
      // 再利用されるケースに備え明示的に false に戻す。
      lockedRef.current = false;
    };
  }, []);

  const handleTie = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;

    triggerHaptic(
      { type: "notification", style: Haptics.NotificationFeedbackType.Success },
      false,
      reducedMotion
    );
    setExitAnimation("tie");

    if (Platform.OS === "android") {
      ToastAndroid.show(t("fortune.toastTie"), ToastAndroid.SHORT);
    }

    tieTimerRef.current = setTimeout(() => {
      setShowTiedComplete(true);
    }, FORTUNE_ANIMATION_TIMING.tie);
  }, [reducedMotion, t]);

  const handleKeep = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;

    triggerHaptic(
      { type: "notification", style: Haptics.NotificationFeedbackType.Success },
      false,
      reducedMotion
    );
    setExitAnimation("keep");

    if (Platform.OS === "android") {
      ToastAndroid.show(t("fortune.toastKeep"), ToastAndroid.SHORT);
    }

    keepTimerRef.current = setTimeout(onReset, FORTUNE_ANIMATION_TIMING.keep);
  }, [onReset, reducedMotion, t]);

  return {
    exitAnimation,
    showTiedComplete,
    handleTie,
    handleKeep,
  };
}
