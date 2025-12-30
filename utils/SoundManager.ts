import { Audio } from 'expo-av';

class SoundManager {
  private sounds: Map<string, Audio.Sound> = new Map();
  private isReady: boolean = false;
  private volume: number = 1.0;
  private isMuted: boolean = false;

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      this.isReady = true;
    } catch (error) {
      console.error('Audio initialization failed:', error);
      this.isReady = false;
    }
  }

  async loadSound(key: string, source: any) {
    if (!this.isReady) {
      console.warn('SoundManager is not initialized yet. Cannot load sound.');
      return null;
    }
    try {
      const { sound } = await Audio.Sound.createAsync(
        source,
        { shouldPlay: false, isMuted: this.isMuted, volume: this.volume }
      );
      this.sounds.set(key, sound);
      return sound;
    } catch (error) {
      console.error(`Failed to load sound ${key}:`, error);
      return null;
    }
  }

  async playSound(key: string) {
    if (!this.isReady || this.isMuted) return;
    try {
      const sound = this.sounds.get(key);
      if (sound) {
        await sound.replayAsync();
      } else {
        console.warn(`Sound ${key} is not loaded.`);
      }
    } catch (error) {
      console.error(`Failed to play sound ${key}:`, error);
    }
  }

  async setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    for (const sound of this.sounds.values()) {
      try {
        await sound.setVolumeAsync(this.volume);
      } catch (e) {
        console.error('Failed to set volume for a sound:', e);
      }
    }
  }

  async setMute(mute: boolean) {
    this.isMuted = mute;
    for (const sound of this.sounds.values()) {
      try {
        await sound.setIsMutedAsync(mute);
      } catch (e) {
        console.error('Failed to set mute for a sound:', e);
      }
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
