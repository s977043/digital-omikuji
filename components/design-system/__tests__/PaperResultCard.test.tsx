import React from "react";
import { Share } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { PaperResultCard } from "../PaperResultCard";
import { OmikujiResult } from "../../../types/omikuji";

jest.mock("react-native-view-shot", () => ({
  captureRef: jest.fn(() => Promise.reject(new Error("capture failed"))),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { returnObjects?: boolean }) => {
      const translations: Record<string, string | string[]> = {
        "common.share": "シェア",
        "common.close": "閉じる",
        "fortune.shareTitle": "おみくじをシェア",
        "fortune.tie": "結ぶ",
        "fortune.keep": "持ち帰る",
        "fortune.toastTie": "運勢を結びました",
        "fortune.toastKeep": "運勢を持ち帰りました",
        "fortune.tiedTitle": "結びました",
        "fortune.tiedMessage": "ありがとうございました",
        "fortune.levels.daikichi": "大吉",
        "fortune.messages.daikichi": ["最高の運気です。新しいことに挑戦するチャンス！"],
        "fortune.detailLabels.wish": "願望",
        "fortune.detailLabels.waitingPerson": "待人",
        "fortune.detailLabels.lostItem": "失物",
        "fortune.detailLabels.business": "商売",
        "fortune.detailLabels.study": "学問",
        "fortune.detailLabels.health": "健康",
        "fortune.detailLabels.love": "恋愛",
        "fortune.details.daikichi.wish": "思うがままに叶うでしょう。",
        "fortune.details.daikichi.waitingPerson": "音信あり。すぐに来ます。",
        "fortune.details.daikichi.lostItem": "出ます。高い所を探してみて。",
        "fortune.details.daikichi.business": "利益あり。進んで吉。",
        "fortune.details.daikichi.study": "安心して勉学に励みなさい。",
        "fortune.details.daikichi.health": "絶好調。何をしても体がついてきます。",
        "fortune.details.daikichi.love": "運命の出会いの予感。積極的に。",
      };

      const value = translations[key];
      if (options?.returnObjects && Array.isArray(value)) {
        return value;
      }
      return value || key;
    },
  }),
}));

jest.mock("../MotionView", () => {
  const { View } = require("react-native");
  return {
    MotionView: View,
  };
});

jest.spyOn(Share, "share").mockImplementation(() => Promise.resolve({ action: "sharedAction" }));

describe("PaperResultCard", () => {
  const mockFortune: OmikujiResult = {
    id: "test-id",
    type: "omikuji",
    level: "daikichi",
    messageIndex: 0,
    image: { uri: "test.png" },
    color: "#FFD700",
    createdAt: 1234567890,
  };

  const mockDetailEntries = [
    { key: "wish", label: "願望", value: "思うがままに叶うでしょう。" },
    { key: "waitingPerson", label: "待人", value: "音信あり。すぐに来ます。" },
  ];

  const renderCard = (overrides: Partial<React.ComponentProps<typeof PaperResultCard>> = {}) =>
    render(
      <PaperResultCard
        fortune={mockFortune}
        fortuneTitle="大吉"
        fortuneMessage="最高の運気です。新しいことに挑戦するチャンス！"
        detailEntries={mockDetailEntries}
        shareText="シェアテキスト：大吉"
        onReset={jest.fn()}
        reducedMotion
        {...overrides}
      />
    );

  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("handleTie sets exit animation and shows tied complete after timeout", async () => {
    jest.useFakeTimers();
    const { getByText, queryByText } = renderCard();

    fireEvent.press(getByText("結ぶ"));

    expect(queryByText("結びました")).toBeNull();

    jest.advanceTimersByTime(1200);

    await waitFor(() => {
      expect(getByText("結びました")).toBeTruthy();
    });

    jest.useRealTimers();
  });

  it("handleKeep calls onReset after animation", () => {
    jest.useFakeTimers();
    const onReset = jest.fn();
    const { getByText } = renderCard({ onReset });

    fireEvent.press(getByText("持ち帰る"));

    expect(onReset).not.toHaveBeenCalled();

    jest.advanceTimersByTime(800);

    expect(onReset).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it("falls back to text sharing when image capture fails", async () => {
    const { getByText } = renderCard();

    fireEvent.press(getByText("シェア"));

    await waitFor(() => {
      expect(Share.share).toHaveBeenCalledTimes(1);
      expect(Share.share).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("大吉"),
        }),
        expect.any(Object)
      );
    });
  });

  it("Share.share が例外を投げても outer catch で swallow し crash しない", async () => {
    const shareSpy = jest.spyOn(Share, "share").mockRejectedValueOnce(new Error("share boom"));
    const { getByText } = renderCard();

    fireEvent.press(getByText("シェア"));

    await waitFor(() => {
      expect(shareSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith("Sharing failed", expect.any(Error));
    });
  });
});
