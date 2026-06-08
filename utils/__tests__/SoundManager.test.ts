import { soundManager } from "../SoundManager";
import { setAudioModeAsync, createAudioPlayer } from "expo-audio";

// expo-audio の AudioPlayer を模したモック。volume/muted は同期セッターのため
// スパイ(jest.fn)で代入値を検証する。createAudioPlayer は同期で同一 player を返す。
jest.mock("expo-audio", () => {
  const seekTo = jest.fn().mockResolvedValue(undefined);
  const play = jest.fn();
  const remove = jest.fn();
  const volumeSetter = jest.fn();
  const mutedSetter = jest.fn();
  const player = {
    play,
    seekTo,
    remove,
    get volume() {
      return 1;
    },
    set volume(v: number) {
      volumeSetter(v);
    },
    get muted() {
      return false;
    },
    set muted(m: boolean) {
      mutedSetter(m);
    },
    isLoaded: true,
  };
  return {
    setAudioModeAsync: jest.fn(),
    createAudioPlayer: jest.fn(() => player),
    __spies: { seekTo, play, remove, volumeSetter, mutedSetter },
  };
});

const mocked = jest.requireMock("expo-audio") as unknown as {
  __spies: {
    seekTo: jest.Mock;
    play: jest.Mock;
    remove: jest.Mock;
    volumeSetter: jest.Mock;
    mutedSetter: jest.Mock;
  };
};
const spies = mocked.__spies;

describe("SoundManager", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    // clearAllMocks 後も同期/非同期の既定挙動を再設定する。
    spies.seekTo.mockResolvedValue(undefined);
    (createAudioPlayer as jest.Mock).mockImplementation(() => {
      const m = jest.requireMock("expo-audio") as unknown as { __spies: typeof spies };
      return {
        play: m.__spies.play,
        seekTo: m.__spies.seekTo,
        remove: m.__spies.remove,
        get volume() {
          return 1;
        },
        set volume(v: number) {
          m.__spies.volumeSetter(v);
        },
        get muted() {
          return false;
        },
        set muted(mm: boolean) {
          m.__spies.mutedSetter(mm);
        },
        isLoaded: true,
      };
    });

    // Reset internal state of the singleton
    await soundManager.unloadAll();
    await soundManager.setMute(false);
    await soundManager.setVolume(1.0);
    jest.clearAllMocks();
    spies.seekTo.mockResolvedValue(undefined);
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

  it("does not play sound if not initialized", async () => {
    (setAudioModeAsync as jest.Mock).mockRejectedValueOnce(new Error("Init failed"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    await soundManager.initialize(); // isReady = false
    consoleSpy.mockRestore();

    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    await soundManager.playSound("test");
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("SoundManager not ready"));
    consoleWarnSpy.mockRestore();
  });

  it("plays a sound", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    await soundManager.playSound("test");
    expect(spies.seekTo).toHaveBeenCalledWith(0);
    expect(spies.play).toHaveBeenCalled();
  });

  it("does not play sound if muted", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    await soundManager.setMute(true);
    await soundManager.playSound("test");
    expect(spies.play).not.toHaveBeenCalled();
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

  it("recovers from play error by reloading once", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });

    // 1 回目の seekTo は失敗、フォールバックで createAudioPlayer + 再生が成功するパス
    spies.seekTo.mockRejectedValueOnce(new Error("Play error"));

    await soundManager.playSound("test");

    // 再生成(createAudioPlayer)→ seekTo の順で 2 回ずつ呼ばれる
    expect(createAudioPlayer).toHaveBeenCalledTimes(2);
    expect(spies.seekTo).toHaveBeenCalledTimes(2);
  });

  it("logs error when both initial play and retry fail", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });

    spies.seekTo
      .mockRejectedValueOnce(new Error("Play error"))
      .mockRejectedValueOnce(new Error("Retry error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await soundManager.playSound("test");

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to play sound test after retry:",
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  it("sets volume", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    await soundManager.setVolume(0.5);
    expect(spies.volumeSetter).toHaveBeenCalledWith(0.5);
  });

  it("handles set volume error", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    spies.volumeSetter.mockImplementationOnce(() => {
      throw new Error("Volume error");
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
    expect(spies.mutedSetter).toHaveBeenCalledWith(true);
  });

  it("handles set mute error", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    spies.mutedSetter.mockImplementationOnce(() => {
      throw new Error("Mute error");
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
    expect(spies.remove).toHaveBeenCalled();
  });

  it("handles unload error", async () => {
    await soundManager.initialize();
    await soundManager.loadSound("test", { uri: "test" });
    spies.remove.mockImplementationOnce(() => {
      throw new Error("Unload error");
    });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await soundManager.unloadAll();

    expect(consoleSpy).toHaveBeenCalledWith("Failed to unload sound test:", expect.any(Error));
    consoleSpy.mockRestore();
  });
});
