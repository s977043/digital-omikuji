declare module "expo-av" {
  export type AVPlaybackSource = number | { uri: string };

  export type AVPlaybackStatus = {
    isLoaded: boolean;
    isPlaying?: boolean;
    positionMillis?: number;
  };

  export namespace Audio {
    export class Sound {
      static createAsync(
        source: AVPlaybackSource,
        initialStatus?: Record<string, unknown>
      ): Promise<{
        sound: Sound;
        status: AVPlaybackStatus;
      }>;

      replayAsync(): Promise<void>;
      unloadAsync(): Promise<void>;
      setVolumeAsync(volume: number): Promise<void>;
      setIsMutedAsync(muted: boolean): Promise<void>;
      getStatusAsync(): Promise<AVPlaybackStatus>;
    }

    export function setAudioModeAsync(mode: Record<string, unknown>): Promise<void>;
  }
}
