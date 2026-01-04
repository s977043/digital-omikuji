import { soundManager } from "../SoundManager";
import { Audio } from "expo-av";

// Mock Expo AV
const mockSound = {
  playAsync: jest.fn(),
  replayAsync: jest.fn(),
  unloadAsync: jest.fn(),
  setPositionAsync: jest.fn(),
  setVolumeAsync: jest.fn(),
  setIsMutedAsync: jest.fn(),
  getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: true }),
};

jest.mock("expo-av", () => {
  return {
    Audio: {
      Sound: {
        createAsync: jest.fn(() =>
          Promise.resolve({ sound: mockSound, status: { isLoaded: true } })
        ),
      },
      setAudioModeAsync: jest.fn(),
    },
  };
});

describe("SoundManager", () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    // Reset internal state of the singleton
    await soundManager.unloadAll();
    await soundManager.setMute(false);
    await soundManager.setVolume(1.0);

    // Reset mocks default behavior
    (Audio.Sound.createAsync as jest.Mock).mockResolvedValue({
      sound: mockSound,
      status: { isLoaded: true },
    });
    mockSound.getStatusAsync.mockResolvedValue({ isLoaded: true });
    mockSound.replayAsync.mockResolvedValue(undefined); // Default success
  });

  it("initializes audio mode", async () => {
    await soundManager.initialize();
    expect(Audio.setAudioModeAsync).toHaveBeenCalled();
  });

  it("handles initialization failure", async () => {
    (Audio.setAudioModeAsync as jest.Mock).mockRejectedValueOnce(new Error("Init failed"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    await soundManager.initialize();
    expect(consoleSpy).toHaveBeenCalledWith("Audio initialization failed:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("returns null when loading sound if not ready", async () => {
    // Force not ready by failing init or just not calling it?
    // Since singleton might be ready from previous tests if not reset (but we don't expose resetReady).
    // We can simulate fail init to set isReady=false.
    (Audio.setAudioModeAsync as jest.Mock).mockRejectedValueOnce(new Error("Init failed"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    await soundManager.initialize();

    const result = await soundManager.loadSound("test", { uri: "test" });
    expect(result).toBeNull();
    consoleSpy.mockRestore();
  });

  it("loads a sound", async () => {
    await soundManager.initialize();
    const result = await soundManager.loadSound("test", { uri: "test" });
    expect(Audio.Sound.createAsync).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it("handles load sound failure", async () => {
    await soundManager.initialize();
    (Audio.Sound.createAsync as jest.Mock).mockRejectedValueOnce(new Error("Load failed"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const result = await soundManager.loadSound("fail", { uri: "fail" });

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith("Failed to load sound fail:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("handles load sound when status is not loaded", async () => {
    await soundManager.initialize();
    (Audio.Sound.createAsync as jest.Mock).mockResolvedValueOnce({
      sound: mockSound,
      status: { isLoaded: false },
    });

    const result = await soundManager.loadSound("notloaded", { uri: "test" });
    expect(result).toBeNull();
  });

  it("does not play sound if not initialized", async () => {
     // Force not ready
    (Audio.setAudioModeAsync as jest.Mock).mockRejectedValueOnce(new Error("Init failed"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    await soundManager.initialize(); // isReady = false
    consoleSpy.mockRestore(); // restore error spy

    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    await soundManager.playSound("test");
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("SoundManager not ready"));
    consoleWarnSpy.mockRestore();
  });

  it("plays a sound", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    await soundManager.playSound("test");
    expect(mockSound.replayAsync).toHaveBeenCalled();
  });

  it("does not play sound if muted", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    await soundManager.setMute(true);
    await soundManager.playSound("test");
    expect(mockSound.replayAsync).not.toHaveBeenCalled();
  });

  it("warns if playing non-existent sound", async () => {
    await soundManager.initialize();
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    await soundManager.playSound("nonexistent");
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Sound nonexistent is not loaded"));
    consoleSpy.mockRestore();
  });

  it("warns if playing unloaded sound", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });

    mockSound.getStatusAsync.mockResolvedValueOnce({ isLoaded: false });
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    await soundManager.playSound("test");

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Cannot play sound test"),
      expect.anything()
    );
    consoleSpy.mockRestore();
  });

  it("handles play sound error", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });

    mockSound.replayAsync.mockRejectedValueOnce(new Error("Play error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await soundManager.playSound("test");

    expect(consoleSpy).toHaveBeenCalledWith("Failed to play sound test:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("sets volume", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    await soundManager.setVolume(0.5);
    expect(mockSound.setVolumeAsync).toHaveBeenCalledWith(0.5);
  });

  it("handles set volume error", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    mockSound.setVolumeAsync.mockRejectedValueOnce(new Error("Volume error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await soundManager.setVolume(0.5);

    expect(consoleSpy).toHaveBeenCalledWith("Failed to set volume for a sound:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("sets mute", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    await soundManager.setMute(true);
    expect(mockSound.setIsMutedAsync).toHaveBeenCalledWith(true);
  });

  it("handles set mute error", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    mockSound.setIsMutedAsync.mockRejectedValueOnce(new Error("Mute error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await soundManager.setMute(true);

    expect(consoleSpy).toHaveBeenCalledWith("Failed to set mute for a sound:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("unloads all sounds", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    await soundManager.unloadAll();
    expect(mockSound.unloadAsync).toHaveBeenCalled();
  });

  it("handles unload error", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    mockSound.unloadAsync.mockRejectedValueOnce(new Error("Unload error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await soundManager.unloadAll();

    expect(consoleSpy).toHaveBeenCalledWith("Failed to unload sound test:", expect.any(Error));
    consoleSpy.mockRestore();
  });
});
