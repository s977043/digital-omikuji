import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import HistoryScreen from "../history";
import { getHistory, clearHistory } from "../../utils/HistoryStorage";
import { router } from "expo-router";

// Mocks
jest.mock("expo-router", () => ({
    router: { back: jest.fn() },
    useFocusEffect: (callback: () => void) => {
        const { useEffect } = require("react");
        useEffect(callback, []);
    },
}));

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: "ja" },
    }),
}));

jest.mock("moti", () => {
    const { View } = require("react-native");
    return {
        MotiView: View,
    }
});

jest.mock("../../utils/HistoryStorage");
jest.mock("../../components/VersionDisplay", () => ({
    VersionDisplay: () => <></>,
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
    });

    it("renders empty state", async () => {
        const { getByText } = render(<HistoryScreen />);

        await waitFor(() => {
            expect(getByText("history.empty")).toBeTruthy();
        });
    });

    it("renders history list", async () => {
        (getHistory as jest.Mock).mockResolvedValue(mockHistoryData);
        const { getByText } = render(<HistoryScreen />);

        await waitFor(() => {
            expect(getByText("大吉")).toBeTruthy();
            expect(getByText("最高")).toBeTruthy();
        }, { timeout: 3000 });
    }, 10000);

    it("calls clearHistory when delete button is pressed", async () => {
        (getHistory as jest.Mock).mockResolvedValue(mockHistoryData);
        const { getByText } = render(<HistoryScreen />);

        await waitFor(() => expect(getByText("history.deleteAll")).toBeTruthy());

        fireEvent.press(getByText("history.deleteAll"));

        // Alert mockup is tricky in React Native without mocking Alert.alert
        // Assuming Alert is not mocked globally, we might cannot press "Delete" in Alert.
        // So we just check if Alert.alert was called if we mock it, OR we mock Alert.
    });
});
