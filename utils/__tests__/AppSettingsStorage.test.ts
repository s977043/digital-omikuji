import { getAppSettings, setAppSettings, DEFAULT_APP_SETTINGS } from "../AppSettingsStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const STORAGE_KEY = "app_settings_v1";

describe("AppSettingsStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns defaults when storage is empty", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const result = await getAppSettings();
    expect(result).toEqual(DEFAULT_APP_SETTINGS);
  });

  it("returns defaults when stored payload is malformed JSON", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("not json");
    const result = await getAppSettings();
    expect(result).toEqual(DEFAULT_APP_SETTINGS);
  });

  it("returns defaults when payload is missing required fields", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ shakeEnabled: false }));
    const result = await getAppSettings();
    expect(result).toEqual(DEFAULT_APP_SETTINGS);
  });

  it("returns parsed settings when stored payload is valid", async () => {
    const stored = { shakeEnabled: false, forceReducedMotion: true };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(stored));
    const result = await getAppSettings();
    expect(result).toEqual(stored);
  });

  it("persists settings via AsyncStorage.setItem", async () => {
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    const settings = { shakeEnabled: false, forceReducedMotion: true };
    await setAppSettings(settings);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(settings));
  });

  it("swallows AsyncStorage errors silently and returns defaults", async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error("disk full"));
    const result = await getAppSettings();
    expect(result).toEqual(DEFAULT_APP_SETTINGS);
  });
});
