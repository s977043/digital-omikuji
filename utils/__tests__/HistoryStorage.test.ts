import { getHistory, addHistoryEntry, clearHistory, HistoryEntry, getLastDrawDate, setLastDrawDate } from "../HistoryStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const HISTORY_KEY = "omikuji_history_v2";
const LAST_DRAW_DATE_KEY = "omikuji_last_draw_date";

const mockHistoryData: HistoryEntry[] = [
  {
    id: "1",
    level: "daikichi",
    fortuneParams: { title: "大吉", description: "Great" },
    image: { uri: "image" },
    color: "red",
    createdAt: 1234567890,
  },
];

describe("HistoryStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getHistory returns empty array if storage is empty", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const result = await getHistory();
    expect(result).toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(HISTORY_KEY);
  });

  it("getHistory returns parsed data", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockHistoryData));
    const result = await getHistory();
    expect(result).toEqual(mockHistoryData);
  });

  it("getHistory handles parse error", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("invalid json");
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const result = await getHistory();
    expect(result).toEqual([]);
    consoleSpy.mockRestore();
  });

  it("addHistoryEntry saves new entry", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockHistoryData));
    const newEntry: HistoryEntry = {
        id: "2",
        level: "kichi",
        fortuneParams: { title: "吉", description: "Good" },
        image: { uri: "image2" },
        color: "blue",
        createdAt: 1234567891,
    };

    await addHistoryEntry(newEntry);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        HISTORY_KEY,
        expect.any(String)
    );

    // Verify the saved data contains both old and new
    const setItemCalls = (AsyncStorage.setItem as jest.Mock).mock.calls;
    const historyCall = setItemCalls.find((call) => call[0] === HISTORY_KEY);
    const savedData = JSON.parse(historyCall[1]);
    expect(savedData).toHaveLength(2);
    expect(savedData[0]).toEqual(newEntry); // Newest first
    expect(savedData[1]).toEqual(mockHistoryData[0]);
  });

  it("clearHistory clears storage", async () => {
    await clearHistory();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(HISTORY_KEY);
  });

  it("limits history to 50 items", async () => {
    // Create 50 items
    const largeHistory = Array.from({ length: 50 }, (_, i) => ({
      ...mockHistoryData[0],
      id: `existing-${i}`,
      createdAt: 1000 + i,
    }));

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(largeHistory));

    const newEntry: HistoryEntry = {
      ...mockHistoryData[0],
      id: "new-entry",
      createdAt: 2000,
    };

    await addHistoryEntry(newEntry);

    const setItemCalls = (AsyncStorage.setItem as jest.Mock).mock.calls;
    const historyCall = setItemCalls.find((call) => call[0] === HISTORY_KEY);
    const savedData = JSON.parse(historyCall[1]);

    expect(savedData).toHaveLength(50);
    expect(savedData[0].id).toBe("new-entry");
    // The last item from original list should be dropped (was index 0? no, we prepend. so last item is index 49)
    // Original list: [existing-0, ..., existing-49]
    // New list: [new, existing-0, ..., existing-48]
    expect(savedData[1].id).toBe("existing-0");
    expect(savedData[49].id).toBe("existing-48");
  });

  it("manages last draw date", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    expect(await getLastDrawDate()).toBeNull();

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("2025-01-01");
    expect(await getLastDrawDate()).toBe("2025-01-01");

    await setLastDrawDate("2025-01-02");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(LAST_DRAW_DATE_KEY, "2025-01-02");
  });
});
