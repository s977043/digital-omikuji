import React from "react";
import { Platform } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";
import { IdleRitualPattern } from "../IdleRitualPattern";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const { home } = require("../../../i18n/locales/ja.json");
      return home[key.replace("home.", "")] ?? key;
    },
  }),
}));

describe("IdleRitualPattern", () => {
  afterEach(() => jest.restoreAllMocks());

  it.each([
    ["android", true, "タップでも、スマホを振っても始められます。"],
    ["android", false, "ボタンをタップして始めます。"],
    ["web", true, "ボタンをタップして始めます。"],
    ["web", false, "ボタンをタップして始めます。"],
  ] as const)(
    "matches guidance and accessible hint to %s / shake=%s",
    (platform, shakeEnabled, instruction) => {
      jest.replaceProperty(Platform, "OS", platform);
      const guide = `1日1回。今日の結果は何度でも読み返せます。\n${instruction}`;
      const { getByText, getByRole } = render(
        <IdleRitualPattern
          hasDrawnToday={false}
          shakeEnabled={shakeEnabled}
          onDraw={jest.fn()}
          onShowResult={jest.fn()}
        />
      );
      expect(getByText(guide)).toBeTruthy();
      expect(getByRole("button", { name: "おみくじを引く" }).props.accessibilityHint).toBe(guide);
    }
  );

  it("shows the 'draw' copy and CTA when the user has not drawn today", () => {
    const onDraw = jest.fn();
    const onShowResult = jest.fn();
    const { getByText, getByRole, queryByRole } = render(
      <IdleRitualPattern hasDrawnToday={false} onDraw={onDraw} onShowResult={onShowResult} />
    );

    expect(getByText(/静かに息を整えて/)).toBeTruthy();
    expect(getByRole("button", { name: "おみくじを引く" })).toBeTruthy();
    expect(queryByRole("button", { name: "結果をもう一度見る" })).toBeNull();
  });

  it("invokes onDraw when the draw CTA is pressed", () => {
    const onDraw = jest.fn();
    const onShowResult = jest.fn();
    const { getByRole } = render(
      <IdleRitualPattern hasDrawnToday={false} onDraw={onDraw} onShowResult={onShowResult} />
    );

    fireEvent.press(getByRole("button", { name: "おみくじを引く" }));

    expect(onDraw).toHaveBeenCalledTimes(1);
    expect(onShowResult).not.toHaveBeenCalled();
  });

  it("switches to the 'review' copy and CTA once drawn today", () => {
    const onDraw = jest.fn();
    const onShowResult = jest.fn();
    const { getByText, getByRole, queryByRole } = render(
      <IdleRitualPattern hasDrawnToday={true} onDraw={onDraw} onShowResult={onShowResult} />
    );

    expect(getByText(/本日の運勢はすでに授かっています/)).toBeTruthy();
    expect(getByRole("button", { name: "結果をもう一度見る" })).toBeTruthy();
    expect(queryByRole("button", { name: "おみくじを引く" })).toBeNull();
  });

  it("invokes onShowResult when the review CTA is pressed", () => {
    const onDraw = jest.fn();
    const onShowResult = jest.fn();
    const { getByRole } = render(
      <IdleRitualPattern hasDrawnToday={true} onDraw={onDraw} onShowResult={onShowResult} />
    );

    fireEvent.press(getByRole("button", { name: "結果をもう一度見る" }));

    expect(onShowResult).toHaveBeenCalledTimes(1);
    expect(onDraw).not.toHaveBeenCalled();
  });
});
