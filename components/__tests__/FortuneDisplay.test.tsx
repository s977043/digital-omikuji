import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Share } from "react-native";
import FortuneDisplay from "../FortuneDisplay";
import { OmikujiResult } from "../../types/omikuji";

// Mock react-native-view-shot
jest.mock("react-native-view-shot", () => ({
  captureRef: jest.fn(),
}));

// Mock react-i18next with translation data
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { returnObjects?: boolean }) => {
      const translations: Record<string, string | string[]> = {
        "common.share": "シェア",
        "common.close": "閉じる",
        "fortune.shareTitle": "おみくじをシェア",
        "fortune.levels.daikichi": "大吉",
        "fortune.levels.kyo": "凶",
        "fortune.messages.daikichi": [
          "最高の運気です。新しいことに挑戦するチャンス！",
          "願望は叶います。迷わず進みましょう。",
          "待ち人来ます。素敵な出会いが期待できそう。",
          "金運上昇中。思わぬ臨時収入があるかも。",
          "健康運良好。エネルギッシュに活動できます。",
        ],
        "fortune.messages.kyo": [
          "無理は禁物。今は静観しましょう。",
          "言葉遣いに注意が必要です。",
          "忘れ物に気をつけて。",
          "予期せぬ出費があるかも。財布の紐は固く。",
          "疲れが溜まりやすいです。早めの休息を。",
        ],
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
        "fortune.details.kyo.wish": "今は叶いません。",
        "fortune.details.kyo.waitingPerson": "来ません。",
        "fortune.details.kyo.lostItem": "出ません。",
        "fortune.details.kyo.business": "損をしないように注意。",
        "fortune.details.kyo.study": "スランプ気味。気分転換を。",
        "fortune.details.kyo.health": "体調不良に注意。早めの対処を。",
        "fortune.details.kyo.love": "今は静観が吉。",
      };
      const value = translations[key];
      if (options?.returnObjects && Array.isArray(value)) {
        return value;
      }
      return value || key;
    },
  }),
}));

// Mock moti
jest.mock("moti", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require("react-native");
  return {
    MotiView: View,
  };
});

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

// Mock expo-haptics
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
  NotificationFeedbackType: {
    Success: "success",
  },
}));

// Mock Share.share
jest.spyOn(Share, "share").mockImplementation(() => Promise.resolve({ action: "sharedAction" }));

describe("FortuneDisplay", () => {
  const mockOnReset = jest.fn();

  const mockFortune: OmikujiResult = {
    id: "test-id",
    level: "daikichi",
    messageIndex: 0,
    image: { uri: "test.png" },
    color: "#FFD700",
    createdAt: 1234567890,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fortune が渡された時に結果とメッセージが表示される", () => {
    const { getByText } = render(<FortuneDisplay fortune={mockFortune} onReset={mockOnReset} />);

    expect(getByText("大吉")).toBeTruthy();
    expect(getByText("最高の運気です。新しいことに挑戦するチャンス！")).toBeTruthy();
  });

  it("閉じるボタンを押すと onReset が呼ばれる", () => {
    const { getByText } = render(<FortuneDisplay fortune={mockFortune} onReset={mockOnReset} />);

    fireEvent.press(getByText("閉じる"));

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it("詳細が表示され、シェアボタンを押すと Share.share が呼ばれる", async () => {
    const { getByText } = render(<FortuneDisplay fortune={mockFortune} onReset={mockOnReset} />);

    // Details are visible from the start
    expect(getByText("思うがままに叶うでしょう。")).toBeTruthy();
    expect(getByText("音信あり。すぐに来ます。")).toBeTruthy();

    // Click optional Share button
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

  it("異なる運勢結果が正しく表示される", () => {
    const kyoFortune: OmikujiResult = {
      id: "kyo-id",
      level: "kyo",
      messageIndex: 0,
      image: { uri: "test.png" },
      color: "#808080",
      createdAt: 1234567890,
    };

    const { getByText } = render(<FortuneDisplay fortune={kyoFortune} onReset={mockOnReset} />);

    expect(getByText("凶")).toBeTruthy();
    expect(getByText("無理は禁物。今は静観しましょう。")).toBeTruthy();
  });
});
