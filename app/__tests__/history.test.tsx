import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import HistoryScreen from "../history";
import { getHistory, clearHistory } from "../../utils/HistoryStorage";

// Mocks
jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
  useFocusEffect: (callback: () => void) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useEffect } = require("react");
    useEffect(callback, []);
  },
}));

jest.mock("moti", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require("react-native");
  return {
    MotiView: View,
  };
});

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { returnObjects?: boolean }) => {
      const translations: Record<string, string | string[]> = {
        "history.title": "運勢手帳",
        "history.deleteAll": "全て削除",
        "history.deleteConfirmTitle": "履歴の削除",
        "history.deleteConfirmMessage": "本当に全ての履歴を削除しますか？",
        "history.empty": "まだ履歴がありません",
        "common.back": "← 戻る",
        "common.delete": "削除",
        "common.cancel": "キャンセル",
        "fortune.levels.daikichi": "大吉",
        "fortune.messages.daikichi": [
          "最高の運気です。新しいことに挑戦するチャンス！",
          "願望は叶います。迷わず進みましょう。",
        ],
      };
      const value = translations[key];
      if (options?.returnObjects && Array.isArray(value)) {
        return value;
      }
      return value || key;
    },
  }),
}));

jest.mock("../../utils/HistoryStorage");
jest.mock("../../components/VersionDisplay", () => ({
  VersionDisplay: () => <></>,
  __esModule: true,
}));

const mockHistoryData = [
  {
    id: "1",
    level: "daikichi",
    messageIndex: 0,
    image: { uri: "test" },
    color: "red",
    createdAt: 1700000000000,
  },
];

describe("HistoryScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getHistory as jest.Mock).mockResolvedValue([]);
    jest.spyOn(Alert, "alert");
  });

  it("renders empty state", async () => {
    const { getByText } = render(<HistoryScreen />);

    await waitFor(
      () => {
        expect(getByText("まだ履歴がありません")).toBeTruthy();
      },
      { timeout: 5000 }
    );
  }, 10000);

  it("renders history list", async () => {
    (getHistory as jest.Mock).mockResolvedValue(mockHistoryData);
    const { getByText } = render(<HistoryScreen />);

    await waitFor(
      () => {
        expect(getByText("大吉")).toBeTruthy();
        expect(getByText("最高の運気です。新しいことに挑戦するチャンス！")).toBeTruthy();
      },
      { timeout: 3000 }
    );
  }, 10000);

  it("calls clearHistory when delete button is pressed", async () => {
    (getHistory as jest.Mock).mockResolvedValue(mockHistoryData);
    const { getByText } = render(<HistoryScreen />);

    await waitFor(() => expect(getByText("全て削除")).toBeTruthy());

    fireEvent.press(getByText("全て削除"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "履歴の削除",
      "本当に全ての履歴を削除しますか？",
      expect.any(Array)
    );

    // Simulate pressing "Delete" in the alert
    const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
    const deleteButton = buttons.find((b: { text: string }) => b.text === "削除");

    await act(async () => {
      await deleteButton.onPress();
    });

    await waitFor(() => {
      expect(clearHistory).toHaveBeenCalled();
    });
  });
});
