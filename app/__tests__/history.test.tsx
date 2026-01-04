import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import HistoryScreen from "../history";
import { getHistory, clearHistory } from "../../utils/HistoryStorage";

// Mocks
jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
  useFocusEffect: (callback: () => void) => {
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

jest.mock("../../utils/HistoryStorage");
jest.mock("../../components/VersionDisplay", () => ({
  VersionDisplay: () => <></>,
  __esModule: true, // Fix for default export if any, though VersionDisplay is named export
}));

const mockHistoryData = [
  {
    id: "1",
    level: "daikichi",
    fortuneParams: { title: "大吉", description: "最高" },
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
        expect(getByText("最高")).toBeTruthy();
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

    await deleteButton.onPress();

    expect(clearHistory).toHaveBeenCalled();
  });
});
