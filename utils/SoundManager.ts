import { Audio, AVPlaybackSource } from 'expo-av';

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

  async loadSound(key: string, source: AVPlaybackSource): Promise<Audio.Sound | null> {
    if (!this.isReady) {
      return null;
    }
    try {
      const { sound, status } = await Audio.Sound.createAsync(
        source,
        { shouldPlay: false, isMuted: this.isMuted, volume: this.volume }
      );

      if (status.isLoaded) {
        this.sounds.set(key, sound);
        return sound;
      } else {
        // Sound object created but not loaded; do not add to map
        return null;
      }
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
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.replayAsync();
        } else {
          console.warn(`Cannot play sound ${key}: it is in the map but not loaded. status:`, status);
        }
      } else {
        console.warn(`Sound ${key} is not loaded (not in map).`);
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
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.setIsMutedAsync(mute);
        }
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
