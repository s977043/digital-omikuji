import { Audio } from 'expo-av';

class SoundManager {
  private sounds: Map<string, Audio.Sound> = new Map();
  private isReady: boolean = false;

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
      this.isReady = true;
    } catch (error) {
      console.error('Audio initialization failed:', error);
      this.isReady = false;
    }
  }

  async loadSound(key: string, source: any) {
    if (!this.isReady) {
      console.warn('SoundManager is not initialized yet.');
    }
    try {
      const { sound } = await Audio.Sound.createAsync(source);
      this.sounds.set(key, sound);
      return sound;
    } catch (error) {
      console.error(`Failed to load sound ${key}:`, error);
      return null;
    }
  }

  async playSound(key: string) {
    if (!this.isReady) return;
    try {
      const sound = this.sounds.get(key);
      if (sound) {
        await sound.replayAsync();
      }
    } catch (error) {
      console.error(`Failed to play sound ${key}:`, error);
    }
  }

  async unloadAll() {
    for (const [key, sound] of this.sounds.entries()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.error(`Failed to unload sound ${key}:`, error);
      }
    }
    this.sounds.clear();
  }
}

export const soundManager = new SoundManager();
