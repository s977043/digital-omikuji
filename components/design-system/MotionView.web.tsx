import React, { forwardRef, useEffect, useState } from "react";
import { View, ViewProps } from "react-native";

/**
 * Web 版 MotionView — CSS transition で Moti 相当の最小サブセットを実装する。
 *
 * サポート:
 * - animate / from: opacity / translateX / translateY / scale / rotateZ
 *   - 数値 or 文字列（"-8deg" など）を受け付ける
 *   - 配列（キーフレーム）が渡された場合は末尾の値のみ使用（ループ/中間値は未対応）
 * - transition: duration / delay（type/loop/repeatReverse は未対応、最終状態に即座に遷移）
 *
 * 未対応:
 * - exit / state（将来 framer-motion 等を採用する場合に拡張）
 * - loop / repeatReverse / keyframes の中間値
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

function buildAnimStyle(values: AnimDict | undefined): Record<string, string | number> {
  if (!values) return {};
  const style: Record<string, string | number> = {};

  const opacity = pickLastValue(values.opacity);
  if (opacity !== undefined) style.opacity = Number(opacity);

  const translateX = pickLastValue(values.translateX);
  const translateY = pickLastValue(values.translateY);
  const scale = pickLastValue(values.scale);
  // rotate / rotateZ を同義として扱う（rotateZ を優先）
  const rotateValue = pickLastValue(values.rotateZ) ?? pickLastValue(values.rotate);

  const transforms: string[] = [];
  if (translateX !== undefined) transforms.push(`translateX(${toPxOrValue(translateX)})`);
  if (translateY !== undefined) transforms.push(`translateY(${toPxOrValue(translateY)})`);
  if (scale !== undefined) transforms.push(`scale(${scale})`);
  if (rotateValue !== undefined) transforms.push(`rotate(${rotateValue})`);
  if (transforms.length > 0) style.transform = transforms.join(" ");

  return style;
}

export const MotionView = forwardRef<View, MotionViewProps>(function MotionView(
  { animate, from, transition, exit: _exit, state: _state, style, ...rest },
  ref
) {
  // from が指定された場合、初回レンダーは from 値、次フレームで animate 値へ遷移させる。
  const [started, setStarted] = useState<boolean>(!from);

  useEffect(() => {
    if (!from) return;
    const id = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(id);
  }, [from]);

  const activeValues = started ? animate : from;
  const animStyle = buildAnimStyle(activeValues);

  const duration = transition?.duration ?? 0;
  const delay = transition?.delay ?? 0;
  const transitionStyle = {
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
  } as Record<string, string | number>;

  return (
    <View ref={ref} style={[style, animStyle as object, transitionStyle as object]} {...rest} />
  );
});
