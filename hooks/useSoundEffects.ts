import { useCallback, useEffect, useState } from "react";
import { soundManager } from "../utils/SoundManager";

const SOUNDS_TO_LOAD = [
  { key: "shake", loader: () => require("../assets/sounds/shake.wav") },
  { key: "result", loader: () => require("../assets/sounds/result.wav") },
];

export function useSoundEffects() {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    async function initSounds() {
      await soundManager.initialize();
      for (const sound of SOUNDS_TO_LOAD) {
        try {
          await soundManager.loadSound(sound.key, sound.loader());
        } catch {
          console.warn(`${sound.key} sound not found`);
        }
      }
    }

    initSounds();

    return () => {
      soundManager.unloadAll();
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundManager.setMute(next);
      return next;
    });
  }, []);

  const playSound = useCallback((key: string) => {
    soundManager.playSound(key);
  }, []);

  return { isMuted, toggleMute, playSound };
}
