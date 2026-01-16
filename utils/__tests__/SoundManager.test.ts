import { soundManager } from "../SoundManager";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";

const mockPlayer = {
  play: jest.fn(),
  pause: jest.fn(),
  seekTo: jest.fn().mockResolvedValue(undefined),
  remove: jest.fn(),
  isLoaded: true,
  muted: false,
  volume: 1,
};

jest.mock(
  "expo-audio",
  () => ({
    createAudioPlayer: jest.fn(),
    setAudioModeAsync: jest.fn(),
  }),
  { virtual: true }
);

describe("SoundManager", () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    // Reset internal state of the singleton
    await soundManager.unloadAll();
    await soundManager.setMute(false);
    await soundManager.setVolume(1.0);

    // Reset mocks default behavior
    (createAudioPlayer as jest.Mock).mockReturnValue(mockPlayer);
    mockPlayer.isLoaded = true;
    Object.defineProperty(mockPlayer, "muted", { value: false, writable: true });
    Object.defineProperty(mockPlayer, "volume", { value: 1, writable: true });
  });

  it("initializes audio mode", async () => {
    await soundManager.initialize();
    expect(setAudioModeAsync).toHaveBeenCalled();
  });

  it("handles initialization failure", async () => {
    (setAudioModeAsync as jest.Mock).mockRejectedValueOnce(new Error("Init failed"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    await soundManager.initialize();
    expect(consoleSpy).toHaveBeenCalledWith("Audio initialization failed:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("returns null when loading sound if not ready", async () => {
    // Simulate failed initialization so the manager is not ready.
    (setAudioModeAsync as jest.Mock).mockRejectedValueOnce(new Error("Init failed"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    await soundManager.initialize();

    const result = await soundManager.loadSound("test", { uri: "test" });
    expect(result).toBeNull();
    consoleSpy.mockRestore();
  });

  it("loads a sound", async () => {
    await soundManager.initialize();
    const result = await soundManager.loadSound("test", { uri: "test" });
    expect(createAudioPlayer).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it("handles load sound failure", async () => {
    await soundManager.initialize();
    (createAudioPlayer as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Load failed");
    });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const result = await soundManager.loadSound("fail", { uri: "fail" });

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith("Failed to load sound fail:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("warns if playing unloaded sound", async () => {
    await soundManager.initialize();
    mockPlayer.isLoaded = false;
    await soundManager.loadSound("test", { uri: "test" });
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    await soundManager.playSound("test");

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Cannot play sound test: it is in the map but not loaded.")
    );
    consoleSpy.mockRestore();
  });

  it("does not play sound if not initialized", async () => {
    // Force not ready
    (setAudioModeAsync as jest.Mock).mockRejectedValueOnce(new Error("Init failed"));
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
    expect(mockPlayer.seekTo).toHaveBeenCalledWith(0);
    expect(mockPlayer.play).toHaveBeenCalled();
  });

  it("does not play sound if muted", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    await soundManager.setMute(true);
    await soundManager.playSound("test");
    expect(mockPlayer.play).not.toHaveBeenCalled();
  });

  it("warns if playing non-existent sound", async () => {
    await soundManager.initialize();
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    await soundManager.playSound("nonexistent");
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Sound nonexistent is not loaded")
    );
    consoleSpy.mockRestore();
  });

  it("handles play sound error", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });

    mockPlayer.seekTo.mockRejectedValueOnce(new Error("Play error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await soundManager.playSound("test");

    expect(consoleSpy).toHaveBeenCalledWith("Failed to play sound test:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("sets volume", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    await soundManager.setVolume(0.5);
    expect(mockPlayer.volume).toBe(0.5);
  });

  it("handles set volume error", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    Object.defineProperty(mockPlayer, "volume", {
      set: () => {
        throw new Error("Volume error");
      },
    });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await soundManager.setVolume(0.5);

    expect(consoleSpy).toHaveBeenCalledWith("Failed to set volume for a sound:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("sets mute", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    await soundManager.setMute(true);
    expect(mockPlayer.muted).toBe(true);
  });

  it("handles set mute error", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    Object.defineProperty(mockPlayer, "muted", {
      set: () => {
        throw new Error("Mute error");
      },
    });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await soundManager.setMute(true);

    expect(consoleSpy).toHaveBeenCalledWith("Failed to set mute for a sound:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("unloads all sounds", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    await soundManager.unloadAll();
    expect(mockPlayer.remove).toHaveBeenCalled();
  });

  it("handles unload error", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    mockPlayer.remove.mockImplementationOnce(() => {
      throw new Error("Unload error");
    });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await soundManager.unloadAll();

    expect(consoleSpy).toHaveBeenCalledWith("Failed to unload sound test:", expect.any(Error));
    consoleSpy.mockRestore();
  });
});
