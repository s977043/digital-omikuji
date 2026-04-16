import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { Accelerometer } from "expo-sensors";
import { reportSilentError } from "../utils/errorReporter";

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
  const onShakeRef = useRef(onShake);
  onShakeRef.current = onShake;

  useEffect(() => {
    if (Platform.OS === "web" || !enabled) return;

    let subscription: Subscription | null = null;

    async function setupSensor() {
      try {
        const available = await Accelerometer.isAvailableAsync();
        if (available) {
          Accelerometer.setUpdateInterval(ACCELEROMETER_UPDATE_INTERVAL_MS);
          subscription = Accelerometer.addListener((data) => {
            const totalForce = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
            if (totalForce > threshold) {
              onShakeRef.current();
            }
          });
        }
      } catch (error) {
        reportSilentError("Accelerometer initialization failed:", error, {
          source: "useShakeDetection",
          operation: "setupSensor",
          category: "recoverable",
          severity: "warning",
        });
      }
    }

    setupSensor();

    return () => {
      subscription?.remove();
    };
  }, [enabled, threshold]);
}
