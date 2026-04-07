import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { Accelerometer } from "expo-sensors";

const ACCELEROMETER_UPDATE_INTERVAL_MS = 100;

interface Subscription {
  remove: () => void;
}

interface UseShakeDetectionOptions {
  enabled: boolean;
  threshold: number;
  onShake: () => void;
}

export function useShakeDetection({ enabled, threshold, onShake }: UseShakeDetectionOptions) {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const subscription = useRef<Subscription | null>(null);
  const onShakeRef = useRef(onShake);
  onShakeRef.current = onShake;

  useEffect(() => {
    if (Platform.OS === "web") return;

    async function setupSensor() {
      try {
        const available = await Accelerometer.isAvailableAsync();
        if (available) {
          Accelerometer.setUpdateInterval(ACCELEROMETER_UPDATE_INTERVAL_MS);
          subscription.current = Accelerometer.addListener(setData);
        }
      } catch (error) {
        console.warn("Accelerometer initialization failed:", error);
      }
    }

    setupSensor();

    return () => {
      subscription.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const totalForce = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
    if (totalForce > threshold) {
      onShakeRef.current();
    }
  }, [enabled, data, threshold]);
}
