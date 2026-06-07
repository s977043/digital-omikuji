import React, { forwardRef, useEffect } from "react";
import { View, type ViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  cancelAnimation,
  type SharedValue,
} from "react-native-reanimated";

/**
 * Native 版 MotionView — moti(MotiView) を Reanimated で置換した実装。
 *
 * moti@0.30 は Reanimated 4 未対応（nandorojo/moti#391 未解決）のため、
 * from/animate/transition の宣言的 API を Reanimated の
 * useSharedValue / useAnimatedStyle で再現する。Web 版（MotionView.web.tsx）と
 * 同じ props シグネチャを維持し、呼び出し側（ShakingPattern 等）は無改修。
 *
 * サポート:
 * - animate/from: opacity / translateX / translateY / scale / rotateZ(rotate)
 *   数値 or 文字列（"-8deg" 等）/ 配列キーフレーム（withSequence で順次補間）
 * - transition: duration / delay / loop / repeatReverse（type は timing 固定扱い）
 */

type AnimValue = number | string | (number | string)[];
type AnimDict = {
  opacity?: AnimValue;
  translateX?: AnimValue;
  translateY?: AnimValue;
  scale?: AnimValue;
  rotateZ?: AnimValue;
  // moti は rotate と rotateZ を同義として受ける。既存コード互換のため両方許容。
  rotate?: AnimValue;
};

type TransitionDict = {
  type?: "timing" | "spring";
  duration?: number;
  delay?: number;
  loop?: boolean;
  repeatReverse?: boolean;
};

type MotionViewProps = ViewProps & {
  animate?: AnimDict;
  from?: AnimDict;
  transition?: TransitionDict;
  // exit / state は未サポート（Web 版と同様）
  exit?: unknown;
  state?: unknown;
};

const ANIM_KEYS = ["opacity", "translateX", "translateY", "scale", "rotate"] as const;
type AnimKey = (typeof ANIM_KEYS)[number];

const DEFAULTS: Record<AnimKey, number> = {
  opacity: 1,
  translateX: 0,
  translateY: 0,
  scale: 1,
  rotate: 0,
};

function toNum(v: number | string): number {
  if (typeof v === "number") return v;
  const n = parseFloat(v); // "180deg" -> 180, "-8deg" -> -8
  return Number.isNaN(n) ? 0 : n;
}

function getRaw(d: AnimDict | undefined, key: AnimKey): AnimValue | undefined {
  if (!d) return undefined;
  if (key === "rotate") return d.rotateZ ?? d.rotate;
  return d[key as keyof AnimDict];
}

// from の初期値（数値）。配列なら先頭。未指定なら animate の先頭 → default。
function initialValue(
  from: AnimDict | undefined,
  animate: AnimDict | undefined,
  key: AnimKey
): number {
  const raw = getRaw(from, key) ?? getRaw(animate, key);
  if (raw === undefined) return DEFAULTS[key];
  if (Array.isArray(raw)) return toNum(raw[0]);
  return toNum(raw);
}

export const MotionView = forwardRef<View, MotionViewProps>(function MotionView(
  { animate, from, transition, exit: _exit, state: _state, style, children, ...rest },
  ref
) {
  const duration = transition?.duration ?? 0;
  const delay = transition?.delay ?? 0;
  const loop = transition?.loop === true;
  const repeatReverse = transition?.repeatReverse === true;

  const opacity = useSharedValue(initialValue(from, animate, "opacity"));
  const translateX = useSharedValue(initialValue(from, animate, "translateX"));
  const translateY = useSharedValue(initialValue(from, animate, "translateY"));
  const scale = useSharedValue(initialValue(from, animate, "scale"));
  const rotate = useSharedValue(initialValue(from, animate, "rotate"));

  const shared: Record<AnimKey, SharedValue<number>> = {
    opacity,
    translateX,
    translateY,
    scale,
    rotate,
  };

  // animate / transition の差分でのみ再アニメーション。
  const animKey = JSON.stringify({ animate, from, duration, delay, loop, repeatReverse });

  useEffect(() => {
    for (const key of ANIM_KEYS) {
      const target = getRaw(animate, key);
      const sv = shared[key];
      if (target === undefined) continue;

      const ease = { duration, easing: Easing.bezier(0.22, 1, 0.36, 1) };

      let animation = Array.isArray(target)
        ? withSequence(...target.map((t) => withTiming(toNum(t), ease)))
        : withTiming(toNum(target), ease);

      if (loop) {
        animation = withRepeat(animation, -1, repeatReverse);
      }
      if (delay > 0) {
        animation = withDelay(delay, animation);
      }
      sv.value = animation;
    }
    return () => {
      for (const key of ANIM_KEYS) cancelAnimation(shared[key]);
    };
    // shared は毎レンダー同一 SharedValue を指すため依存に含めない。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animKey]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View ref={ref} style={[style, animatedStyle]} {...rest}>
      {children}
    </Animated.View>
  );
});
