/**
 * MotionView.web の style マッピングの単体テスト。
 * jest-expo 配下のため、通常の import では .native.tsx が解決される。
 * Web 実装を直接テストするために絶対パスで .web.tsx を import する。
 */
import React from "react";
import { create, act } from "react-test-renderer";
// eslint-disable-next-line import/no-unresolved
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

describe("MotionView (web)", () => {
  it("animate の opacity を style.opacity に反映する", () => {
    let tree: ReturnType<typeof create>;
    act(() => {
      tree = create(<MotionView animate={{ opacity: 0.5 }} />);
    });
    const root = tree!.toJSON();
    const style = flattenStyle(
      Array.isArray(root) ? undefined : (root?.props as { style?: unknown })?.style
    );
    expect(style.opacity).toBe(0.5);
    act(() => {
      tree!.unmount();
    });
  });

  it("animate の translateX / scale を transform 文字列に合成する", () => {
    let tree: ReturnType<typeof create>;
    act(() => {
      tree = create(<MotionView animate={{ translateX: 10, scale: 1.2 }} />);
    });
    const root = tree!.toJSON();
    const style = flattenStyle(
      Array.isArray(root) ? undefined : (root?.props as { style?: unknown })?.style
    );
    act(() => {
      tree!.unmount();
    });
    expect(style.transform).toBe("translateX(10px) scale(1.2)");
  });

  it("transition.duration を style.transitionDuration に反映する", () => {
    let tree: ReturnType<typeof create>;
    act(() => {
      tree = create(<MotionView animate={{ opacity: 1 }} transition={{ duration: 300 }} />);
    });
    const root = tree!.toJSON();
    const style = flattenStyle(
      Array.isArray(root) ? undefined : (root?.props as { style?: unknown })?.style
    );
    act(() => {
      tree!.unmount();
    });
    expect(style.transitionDuration).toBe("300ms");
  });

  it("配列（キーフレーム）が渡された場合は末尾の値を使用する", () => {
    let tree: ReturnType<typeof create>;
    act(() => {
      tree = create(<MotionView animate={{ translateX: [-10, 10, 0] }} />);
    });
    const root = tree!.toJSON();
    const style = flattenStyle(
      Array.isArray(root) ? undefined : (root?.props as { style?: unknown })?.style
    );
    act(() => {
      tree!.unmount();
    });
    expect(style.transform).toBe("translateX(0px)");
  });

  it("from が指定されていれば初回レンダーは from 値を使う", () => {
    let tree: ReturnType<typeof create>;
    act(() => {
      tree = create(
        <MotionView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 100 }} />
      );
    });
    const root = tree!.toJSON();
    const style = flattenStyle(
      Array.isArray(root) ? undefined : (root?.props as { style?: unknown })?.style
    );
    act(() => {
      tree!.unmount();
    });
    // useEffect の requestAnimationFrame 発火前なので from が反映される
    expect(style.opacity).toBe(0);
  });
});
