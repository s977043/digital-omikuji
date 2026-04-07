import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

type HapticFeedbackType =
  | { type: "impact"; style: Haptics.ImpactFeedbackStyle }
  | { type: "notification"; style: Haptics.NotificationFeedbackType };

export function triggerHaptic(feedback: HapticFeedbackType, force = false, reducedMotion = false) {
  if (Platform.OS === "web") return;
  if (reducedMotion && !force) return;

  if (feedback.type === "impact") {
    Haptics.impactAsync(feedback.style);
  } else {
    Haptics.notificationAsync(feedback.style);
  }
}
