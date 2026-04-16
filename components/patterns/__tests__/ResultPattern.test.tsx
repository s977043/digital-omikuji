import React from "react";
import { Share } from "react-native";
import { render } from "@testing-library/react-native";
import { ResultPattern } from "../ResultPattern";
import { OmikujiResult } from "../../../types/omikuji";

jest.mock("react-native-view-shot", () => ({
  captureRef: jest.fn(() => Promise.reject(new Error("capture failed"))),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { returnObjects?: boolean }) => {
      const translations: Record<string, string | string[]> = {
        "fortune.shareTitle": "おみくじをシェア",
        "fortune.levels.daikichi": "大吉",
        "fortune.messages.daikichi": ["最高の運気です。新しいことに挑戦するチャンス！"],
        "fortune.detailLabels.wish": "願望",
        "fortune.details.daikichi.wish": "思うがままに叶うでしょう。",
      };
      const value = translations[key];
      if (options?.returnObjects && Array.isArray(value)) return value;
      return value ?? key;
    },
  }),
}));

jest.mock("../../design-system/MotionView", () => {
  const { View } = require("react-native");
  return { MotionView: View };
});

jest.spyOn(Share, "share").mockImplementation(() => Promise.resolve({ action: "sharedAction" }));

describe("ResultPattern", () => {
  const fortune: OmikujiResult = {
    id: "test-1",
    type: "omikuji",
    level: "daikichi",
    messageIndex: 0,
    image: { uri: "test.png" },
    color: "#FFD700",
    createdAt: 1234567890,
  };

  it("renders a fortune title derived from i18n", () => {
    const onReset = jest.fn();
    const { getByText } = render(<ResultPattern fortune={fortune} onReset={onReset} />);
    expect(getByText("大吉")).toBeTruthy();
  });

  it("renders without throwing when reducedMotion is enabled", () => {
    const onReset = jest.fn();
    expect(() =>
      render(<ResultPattern fortune={fortune} onReset={onReset} reducedMotion />)
    ).not.toThrow();
  });
});
