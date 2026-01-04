import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Share } from "react-native";
import FortuneDisplay from "../FortuneDisplay";
import { OmikujiResult } from "../../types/omikuji";

// Mock react-native-view-shot
jest.mock("react-native-view-shot", () => ({
  captureRef: jest.fn(),
}));

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { title?: string; description?: string }) => {
      if (key === "common.share") return "シェア";
      if (key === "common.close") return "閉じる";
      if (key === "fortune.shareTitle") return "おみくじをシェア";
      if (key === "fortune.shareMessage") {
        const title = options?.title ?? "";
        const description = options?.description ?? "";
        return `🎍 2026年 新春おみくじ 🎍\n\n私の運勢は… ✨ ${title} ✨\n「${description}」\n\n#おみくじ2026 #新春`;
      }
      return key;
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
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock expo-haptics
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: "heavy"
  },
  NotificationFeedbackType: {
    Success: 'success',
  },
}));

// Mock Share.share
jest.spyOn(Share, "share").mockImplementation(() => Promise.resolve({ action: "sharedAction" }));

describe("FortuneDisplay", () => {
  const mockOnReset = jest.fn();

  const mockFortune: OmikujiResult = {
    id: "test-id",
    level: "daikichi",
    fortuneParams: {
      title: "大吉",
      description: "2026年はあなたの黄金イヤー！夢が叶う最高の年になるでしょう。",
    },
    image: { uri: "test.png" },
    color: "#FFD700",
    createdAt: 1234567890,
    details: [
      { label: "願望", text: "叶います" },
      { label: "待人", text: "来ます" }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fortune が渡された時に結果とメッセージが表示される", () => {
    const { getByText } = render(<FortuneDisplay fortune={mockFortune} onReset={mockOnReset} />);

    expect(getByText(mockFortune.fortuneParams.title)).toBeTruthy();
    expect(getByText(mockFortune.fortuneParams.description)).toBeTruthy();
  });

  it("閉じるボタンを押すと onReset が呼ばれる", () => {
    const { getByText } = render(<FortuneDisplay fortune={mockFortune} onReset={mockOnReset} />);

    // Initial locked state has a Close button
    fireEvent.press(getByText('閉じる'));

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('シェアボタンを押すと Share.share が呼ばれ、詳細が表示される (Unlock)', async () => {
    const { getByText, queryByText } = render(
      <FortuneDisplay fortune={mockFortune} onReset={mockOnReset} />
    );

    // Initially details are hidden
    expect(queryByText('叶います')).toBeNull();

    // Click Share to unlock
    fireEvent.press(getByText('シェアして詳細を見る'));

    await waitFor(() => {
      expect(Share.share).toHaveBeenCalledTimes(1);
      expect(Share.share).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining(mockFortune.fortuneParams.title),
        }),
        expect.any(Object)
      );
    });

    // Unlock transition might take time, or React state update happens.
    // In test environment, state updates should be quick but Moti might animate opacity.
    // However, Moti mock renders View, so it should be visible if conditional is true.
    await waitFor(() => {
      expect(getByText('叶います')).toBeTruthy();
      expect(getByText('再シェア')).toBeTruthy();
    });
  });

  it("異なる運勢結果が正しく表示される", () => {
    const kyoFortune: OmikujiResult = {
      id: "kyo-id",
      level: "kyo",
      fortuneParams: {
        title: "凶",
        description: "今は耐える時。慎重に行動すれば、災いは転じて福となります。",
      },
      image: { uri: "test.png" },
      color: "#808080",
      createdAt: 1234567890,
    };

    const { getByText } = render(<FortuneDisplay fortune={kyoFortune} onReset={mockOnReset} />);

    expect(getByText("凶")).toBeTruthy();
    expect(getByText(kyoFortune.fortuneParams.description)).toBeTruthy();
  });
});
