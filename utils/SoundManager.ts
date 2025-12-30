import { Audio } from 'expo-av';

class SoundManager {
  private sounds: Map<string, Audio.Sound> = new Map();

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  }

  async loadSound(key: string, source: any) {
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
