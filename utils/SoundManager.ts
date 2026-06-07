import {
  setAudioModeAsync,
  createAudioPlayer,
  type AudioPlayer,
  type AudioSource,
} from "expo-audio";
import { reportSilentError } from "./errorReporter";

class SoundManager {
  private sounds: Map<string, AudioPlayer> = new Map();
  private sources: Map<string, AudioSource> = new Map();
  private isReady: boolean = false;
  private volume: number = 1.0;
  private isMuted: boolean = false;

  async initialize() {
    try {
      // expo-av の playsInSilentModeIOS / staysActiveInBackground / shouldDuckAndroid は
      // expo-audio で playsInSilentMode / shouldPlayInBackground / interruptionMode に統合された。
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: false,
        interruptionMode: "duckOthers",
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

  async loadSound(key: string, source: AudioSource): Promise<AudioPlayer | null> {
    if (!this.isReady) {
      return null;
    }
    try {
      // createAudioPlayer は同期。expo-av の createAsync のような {sound,status} は返さず、
      // ロードはバックグラウンドで進むため「生成成功＝登録」とする（isLoaded ゲートは設けない）。
      const player = createAudioPlayer(source);
      player.volume = this.volume;
      player.muted = this.isMuted;
      this.sounds.set(key, player);
      this.sources.set(key, source);
      return player;
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

    const player = this.sounds.get(key);
    if (!player) {
      console.warn(`Sound ${key} is not loaded (not in map).`);
      return;
    }

    try {
      // replayAsync 相当: 先頭へシークしてから再生する。
      await player.seekTo(0);
      player.play();
    } catch (error) {
      // 再生失敗時は一度だけ再ロード → 再生を試みる。
      // バックグラウンド復帰後など player が無効化されるケースを救済する。
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
        // 古い player を破棄してから作り直す（remove 後の player は再利用不可）。
        // remove 自体の失敗は致命的でないため握りつぶす。
        try {
          player.remove();
        } catch {
          /* noop */
        }
        this.sounds.delete(key);
        const reloaded = await this.loadSound(key, source);
        if (reloaded) {
          await reloaded.seekTo(0);
          reloaded.play();
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
    for (const player of this.sounds.values()) {
      try {
        // expo-audio の volume は同期セッター。
        player.volume = this.volume;
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
    for (const player of this.sounds.values()) {
      try {
        // expo-audio の muted は同期セッター。
        player.muted = mute;
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
    for (const [key, player] of this.sounds.entries()) {
      try {
        player.remove();
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
