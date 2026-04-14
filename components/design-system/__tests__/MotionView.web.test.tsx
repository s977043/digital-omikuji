/**
 * MotionView.web の style マッピングの単体テスト。
 * jest-expo 配下のため、通常の import では .native.tsx が解決される。
 * Web 実装を直接テストするために絶対パスで .web.tsx を import する。
 */
import React from "react";
import { render } from "@testing-library/react-native";

import { MotionView } from "../MotionView.web";

function flattenStyle(style: unknown): Record<string, unknown> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce<Record<string, unknown>>(
      (acc, item) => ({ ...acc, ...flattenStyle(item) }),
      {}
    );
  }
  return style as Record<string, unknown>;
}

function getRootStyle(testIDElement: ReturnType<typeof render>): Record<string, unknown> {
  const root = testIDElement.root;
  // root は最上位ホストコンポーネント。MotionView 自身が単一の View を返すため
  // root.findByType 不要で root.props.style を直接読む。
  return flattenStyle(root.props.style as unknown);
}

describe("MotionView (web)", () => {
  it("animate の opacity を style.opacity に反映する", () => {
    const result = render(<MotionView animate={{ opacity: 0.5 }} />);
    const style = getRootStyle(result);
    expect(style.opacity).toBe(0.5);
    result.unmount();
  });

  it("animate の translateX / scale を transform 文字列に合成する", () => {
    const result = render(<MotionView animate={{ translateX: 10, scale: 1.2 }} />);
    const style = getRootStyle(result);
    expect(style.transform).toBe("translateX(10px) scale(1.2)");
    result.unmount();
  });

  it("transition.duration を style.transitionDuration に反映する", () => {
    const result = render(<MotionView animate={{ opacity: 1 }} transition={{ duration: 300 }} />);
    const style = getRootStyle(result);
    expect(style.transitionDuration).toBe("300ms");
    result.unmount();
  });

  it("配列（キーフレーム）が渡された場合は末尾の値を使用する", () => {
    const result = render(<MotionView animate={{ translateX: [-10, 10, 0] }} />);
    const style = getRootStyle(result);
    expect(style.transform).toBe("translateX(0px)");
    result.unmount();
  });

  it("from が指定されていれば初回レンダーは from 値を使う", () => {
    const result = render(
      <MotionView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 100 }} />
    );
    const style = getRootStyle(result);
    // useEffect の requestAnimationFrame 発火前なので from が反映される
    expect(style.opacity).toBe(0);
    result.unmount();
  });
});
