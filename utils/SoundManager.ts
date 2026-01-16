import { AudioPlayer, AudioSource, createAudioPlayer, setAudioModeAsync } from "expo-audio";

class SoundManager {
  private sounds: Map<string, AudioPlayer> = new Map();
  private isReady: boolean = false;
  private volume: number = 1.0;
  private isMuted: boolean = false;

  async initialize() {
    try {
      await setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      this.isReady = true;
    } catch (error) {
      console.error("Audio initialization failed:", error);
      this.isReady = false;
    }
  }

  async loadSound(key: string, source: AudioSource): Promise<AudioPlayer | null> {
    if (!this.isReady) {
      return null;
    }
    try {
      const player = createAudioPlayer(source, { keepAudioSessionActive: false });
      player.volume = this.volume;
      player.muted = this.isMuted;
      this.sounds.set(key, player);
      return player;
    } catch (error) {
      console.error(`Failed to load sound ${key}:`, error);
      return null;
    }
  }

  async playSound(key: string) {
    if (!this.isReady) {
      console.warn(`SoundManager not ready for playSound: ${key}`);
      return;
    }
    if (this.isMuted) return;

    try {
      const sound = this.sounds.get(key);
      if (!sound) {
        console.warn(`Sound ${key} is not loaded (not in map).`);
        return;
      }

      if (!sound.isLoaded) {
        console.warn(`Cannot play sound ${key}: it is in the map but not loaded.`);
        return;
      }

      await sound.seekTo(0);
      sound.play();
    } catch (error) {
      console.error(`Failed to play sound ${key}:`, error);
    }
  }

  async setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    for (const sound of this.sounds.values()) {
      try {
        sound.volume = this.volume;
      } catch (e) {
        console.error("Failed to set volume for a sound:", e);
      }
    }
  }

  async setMute(mute: boolean) {
    this.isMuted = mute;
    for (const sound of this.sounds.values()) {
      try {
        sound.muted = mute;
      } catch (e) {
        console.error("Failed to set mute for a sound:", e);
      }
    }
  }

  async unloadAll() {
    for (const [key, sound] of this.sounds.entries()) {
      try {
        sound.remove();
      } catch (error) {
        console.error(`Failed to unload sound ${key}:`, error);
      }
    }
    this.sounds.clear();
  }
}

export const soundManager = new SoundManager();
