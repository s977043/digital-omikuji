import { Audio, AVPlaybackSource } from "expo-av";
import { reportSilentError } from "./errorReporter";

class SoundManager {
  private sounds: Map<string, Audio.Sound> = new Map();
  private sources: Map<string, AVPlaybackSource> = new Map();
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
      reportSilentError("Audio initialization failed:", error, {
        source: "SoundManager",
        operation: "initialize",
        severity: "warning",
      });
      this.isReady = false;
    }
  }

  async loadSound(key: string, source: AVPlaybackSource): Promise<Audio.Sound | null> {
    if (!this.isReady) {
      return null;
    }
    try {
      const { sound, status } = await Audio.Sound.createAsync(source, {
        shouldPlay: false,
        isMuted: this.isMuted,
        volume: this.volume,
      });

      if (status.isLoaded) {
        this.sounds.set(key, sound);
        this.sources.set(key, source);
        return sound;
      } else {
        // Sound object created but not loaded; do not add to map
        return null;
      }
    } catch (error) {
      reportSilentError(`Failed to load sound ${key}:`, error, {
        source: "SoundManager",
        operation: "loadSound",
        severity: "warning",
        metadata: { key },
      });
      return null;
    }
  }

  async playSound(key: string) {
    if (!this.isReady) {
      console.warn(`SoundManager not ready for playSound: ${key}`);
      return;
    }
    if (this.isMuted) return;

    const sound = this.sounds.get(key);
    if (!sound) {
      console.warn(`Sound ${key} is not loaded (not in map).`);
      return;
    }

    try {
      await sound.replayAsync();
    } catch (error) {
      // 再生失敗時は一度だけ再ロード → replay を試みる。
      // iOS のバックグラウンド復帰後など Sound オブジェクトが無効化されるケースを救済する。
      const source = this.sources.get(key);
      if (!source) {
        reportSilentError(`Failed to play sound ${key}:`, error, {
          source: "SoundManager",
          operation: "playSound",
          severity: "warning",
          metadata: { key, stage: "no_source" },
        });
        return;
      }
      try {
        // 古い Sound オブジェクトを明示的にアンロードしてから再ロードする（リソースリーク防止）。
        // unloadAsync 自体の失敗は致命的でないため握りつぶす。
        try {
          await sound.unloadAsync();
        } catch {
          /* noop */
        }
        this.sounds.delete(key);
        const reloaded = await this.loadSound(key, source);
        if (reloaded) {
          await reloaded.replayAsync();
        } else {
          reportSilentError(`Failed to play sound ${key}:`, error, {
            source: "SoundManager",
            operation: "playSound",
            severity: "warning",
            metadata: { key, stage: "reload_failed" },
          });
        }
      } catch (retryError) {
        reportSilentError(`Failed to play sound ${key} after retry:`, retryError, {
          source: "SoundManager",
          operation: "playSound",
          severity: "warning",
          metadata: { key, stage: "retry_failed" },
        });
      }
    }
  }

  async setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    for (const sound of this.sounds.values()) {
      try {
        await sound.setVolumeAsync(this.volume);
      } catch (e) {
        reportSilentError("Failed to set volume for a sound:", e, {
          source: "SoundManager",
          operation: "setVolume",
          severity: "warning",
        });
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
        reportSilentError("Failed to set mute for a sound:", e, {
          source: "SoundManager",
          operation: "setMute",
          severity: "warning",
        });
      }
    }
  }

  async unloadAll() {
    for (const [key, sound] of this.sounds.entries()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        reportSilentError(`Failed to unload sound ${key}:`, error, {
          source: "SoundManager",
          operation: "unloadAll",
          severity: "warning",
          metadata: { key },
        });
      }
    }
    this.sounds.clear();
    this.sources.clear();
  }
}

export const soundManager = new SoundManager();
