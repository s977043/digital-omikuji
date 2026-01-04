import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHistory, addHistoryEntry, clearHistory } from "../HistoryStorage";
import { OmikujiResult } from "../../types/omikuji";

const mockResult: OmikujiResult = {
    id: "test-id",
    level: "daikichi",
    fortuneParams: {
        title: "大吉",
        description: "Great luck!",
    },
    image: { uri: "mock-image" },
    color: "red",
    createdAt: 1672531200000,
};

describe("HistoryStorage", () => {
    beforeEach(async () => {
        await AsyncStorage.clear();
        jest.clearAllMocks();
    });

    it("adds history entry correctly", async () => {
        await addHistoryEntry(mockResult);
        const history = await getHistory();
        expect(history).toHaveLength(1);
        expect(history[0]).toEqual(mockResult);
    });

    it("limits history to 50 items", async () => {
        // Add 55 items
        for (let i = 0; i < 55; i++) {
            await addHistoryEntry({ ...mockResult, fortuneParams: { title: "大吉", description: `Item ${i}` } });
        }

        const history = await getHistory();
        expect(history).toHaveLength(50);

        // The last added item (Item 54) should be at index 0 (LIFO)
        expect(history[0].fortuneParams.description).toBe("Item 54");
    });

    it("clears history", async () => {
        await addHistoryEntry(mockResult);
        await clearHistory();
        const history = await getHistory();
        expect(history).toHaveLength(0);
    });

    it("handles getHistory failure gracefully", async () => {
        (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error("Failed"));
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });
        const history = await getHistory();
        expect(history).toEqual([]);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it("handles addHistoryEntry failure gracefully", async () => {
        (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error("Failed"));
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });
        await addHistoryEntry(mockResult);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it("handles clearHistory failure gracefully", async () => {
        (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error("Failed"));
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });
        await clearHistory();
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
