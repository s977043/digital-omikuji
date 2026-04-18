import { act, renderHook, waitFor } from "@testing-library/react-native";
import { soundManager } from "../../utils/SoundManager";
import { useSoundEffects } from "../useSoundEffects";

describe("useSoundEffects", () => {
  let initializeSpy: jest.SpyInstance;
  let loadSoundSpy: jest.SpyInstance;
  let playSoundSpy: jest.SpyInstance;
  let setMuteSpy: jest.SpyInstance;
  let unloadAllSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    initializeSpy = jest.spyOn(soundManager, "initialize").mockResolvedValue(undefined);
    loadSoundSpy = jest.spyOn(soundManager, "loadSound").mockResolvedValue(null);
    playSoundSpy = jest.spyOn(soundManager, "playSound").mockResolvedValue(undefined);
    setMuteSpy = jest.spyOn(soundManager, "setMute").mockResolvedValue(undefined);
    unloadAllSpy = jest.spyOn(soundManager, "unloadAll").mockResolvedValue(undefined);
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("initializes the sound manager and loads shake/result assets on mount", async () => {
    renderHook(() => useSoundEffects());
    await waitFor(() => {
      expect(initializeSpy).toHaveBeenCalledTimes(1);
      expect(loadSoundSpy).toHaveBeenCalledTimes(2);
    });
    const keys = loadSoundSpy.mock.calls.map((call) => call[0]);
    expect(keys).toEqual(expect.arrayContaining(["shake", "result"]));
  });

  it("warns with the sound key when loadSound throws", async () => {
    loadSoundSpy.mockRejectedValueOnce(new Error("bad asset"));
    renderHook(() => useSoundEffects());
    await waitFor(() => expect(warnSpy).toHaveBeenCalled());
    expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching(/sound not found/));
  });

  it("toggles mute state and forwards to soundManager.setMute", async () => {
    const { result } = renderHook(() => useSoundEffects());
    await waitFor(() => expect(initializeSpy).toHaveBeenCalled());

    expect(result.current.isMuted).toBe(false);

    act(() => {
      result.current.toggleMute();
    });
    expect(result.current.isMuted).toBe(true);
    expect(setMuteSpy).toHaveBeenLastCalledWith(true);

    act(() => {
      result.current.toggleMute();
    });
    expect(result.current.isMuted).toBe(false);
    expect(setMuteSpy).toHaveBeenLastCalledWith(false);
  });

  it("delegates playSound to soundManager", async () => {
    const { result } = renderHook(() => useSoundEffects());
    await waitFor(() => expect(initializeSpy).toHaveBeenCalled());

    act(() => {
      result.current.playSound("shake");
    });
    expect(playSoundSpy).toHaveBeenCalledWith("shake");
  });

  it("calls unloadAll on unmount", async () => {
    const { unmount } = renderHook(() => useSoundEffects());
    await waitFor(() => expect(initializeSpy).toHaveBeenCalled());
    unmount();
    expect(unloadAllSpy).toHaveBeenCalledTimes(1);
  });
});
