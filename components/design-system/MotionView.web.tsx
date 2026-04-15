import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { View, ViewProps } from "react-native";

/**
 * Web 版 MotionView — CSS transition / animation で Moti 相当の最小サブセットを実装する。
 *
 * サポート:
 * - animate / from: opacity / translateX / translateY / scale / rotateZ
 *   - 数値 or 文字列（"-8deg" など）を受け付ける
 *   - 配列（キーフレーム）が渡された場合は末尾の値のみ使用（中間値は未対応）
 * - transition: duration / delay / loop / repeatReverse（type は timing 固定扱い）
 *   - loop: true のとき CSS animation + @keyframes でループ再生
 *   - repeatReverse: true のとき animation-direction: alternate
 *
 * 未対応:
 * - exit / state（将来 framer-motion 等を採用する場合に拡張）
 * - keyframes 配列の中間値
 *
 * ネイティブは Moti そのまま（MotionView.native.tsx 参照）。
 */

type AnimValue = number | string | (number | string)[];
type AnimDict = {
  opacity?: AnimValue;
  translateX?: AnimValue;
  translateY?: AnimValue;
  scale?: AnimValue;
  rotateZ?: AnimValue;
  // Moti は `rotate` と `rotateZ` を同義として受ける。既存コード互換のため両方許容する。
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
  // TODO: exit / state の Web サポートは framer-motion 採用時に追加する
  exit?: unknown;
  state?: unknown;
};

function pickLastValue(v: AnimValue | undefined): number | string | undefined {
  if (v === undefined) return undefined;
  if (Array.isArray(v)) return v[v.length - 1];
  return v;
}

function toPxOrValue(v: number | string): string {
  return typeof v === "number" ? `${v}px` : v;
}

function getRotate(values: AnimDict | undefined): number | string | undefined {
  // rotate / rotateZ を同義として扱う（rotateZ を優先）
  return pickLastValue(values?.rotateZ) ?? pickLastValue(values?.rotate);
}

function buildTransform(values: AnimDict | undefined): string | undefined {
  if (!values) return undefined;
  const translateX = pickLastValue(values.translateX);
  const translateY = pickLastValue(values.translateY);
  const scale = pickLastValue(values.scale);
  const rotateValue = getRotate(values);

  const transforms: string[] = [];
  if (translateX !== undefined) transforms.push(`translateX(${toPxOrValue(translateX)})`);
  if (translateY !== undefined) transforms.push(`translateY(${toPxOrValue(translateY)})`);
  if (scale !== undefined) transforms.push(`scale(${scale})`);
  if (rotateValue !== undefined) transforms.push(`rotate(${rotateValue})`);
  return transforms.length > 0 ? transforms.join(" ") : undefined;
}

function buildAnimStyle(values: AnimDict | undefined): Record<string, string | number> {
  if (!values) return {};
  const style: Record<string, string | number> = {};

  const opacity = pickLastValue(values.opacity);
  if (opacity !== undefined) style.opacity = Number(opacity);

  const transform = buildTransform(values);
  if (transform !== undefined) style.transform = transform;

  return style;
}

// loop 時の @keyframes を一意名でブラウザに注入する。既に注入済みなら no-op。
const injectedKeyframes = new Set<string>();
function ensureKeyframes(name: string, fromCss: string, toCss: string): void {
  if (typeof document === "undefined" || injectedKeyframes.has(name)) return;
  injectedKeyframes.add(name);
  const style = document.createElement("style");
  style.setAttribute("data-motionview", name);
  style.textContent = `@keyframes ${name}{from{${fromCss}}to{${toCss}}}`;
  document.head.appendChild(style);
}

function keyframeCss(anim: Record<string, string | number>): string {
  const parts: string[] = [];
  if (anim.opacity !== undefined) parts.push(`opacity:${anim.opacity}`);
  if (anim.transform !== undefined) parts.push(`transform:${anim.transform}`);
  return parts.join(";");
}

// from/animate の内容から安定したキーフレーム名を生成する（単純ハッシュ）。
function hashKey(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}

export const MotionView = forwardRef<View, MotionViewProps>(function MotionView(
  { animate, from, transition, exit: _exit, state: _state, style, ...rest },
  ref
) {
  const isLoop = transition?.loop === true;
  const duration = transition?.duration ?? 0;
  const delay = transition?.delay ?? 0;

  // loop 再生時は CSS animation を使う。from と animate のスタイル差分で keyframes を生成。
  const loopStyle = useMemo<Record<string, string | number> | null>(() => {
    if (!isLoop || !animate) return null;
    const fromAnim = buildAnimStyle(from ?? animate);
    const toAnim = buildAnimStyle(animate);
    const fromCss = keyframeCss(fromAnim);
    const toCss = keyframeCss(toAnim);
    if (!fromCss && !toCss) return null;
    const name = `mv-${hashKey(`${fromCss}|${toCss}`)}`;
    ensureKeyframes(name, fromCss, toCss);
    return {
      animationName: name,
      animationDuration: `${duration}ms`,
      animationDelay: `${delay}ms`,
      animationIterationCount: "infinite",
      animationTimingFunction: "linear",
      animationDirection: transition?.repeatReverse ? "alternate" : "normal",
    };
  }, [isLoop, animate, from, duration, delay, transition?.repeatReverse]);

  // from が指定された場合、初回レンダーは from 値、次フレームで animate 値へ遷移させる。
  // loop 時は CSS animation が from→to を補間するため started 切替は不要。
  const [started, setStarted] = useState<boolean>(!from || isLoop);

  useEffect(() => {
    if (!from || isLoop) return;
    const id = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(id);
  }, [from, isLoop]);

  const activeValues = started ? animate : from;
  const animStyle = loopStyle ? buildAnimStyle(animate) : buildAnimStyle(activeValues);

  const transitionStyle: Record<string, string | number> = loopStyle
    ? loopStyle
    : {
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      };

  return (
    <View ref={ref} style={[style, animStyle as object, transitionStyle as object]} {...rest} />
  );
});
