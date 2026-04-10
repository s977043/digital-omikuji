import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { triggerHaptic } from "../haptics";

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "LIGHT", Medium: "MEDIUM", Heavy: "HEAVY" },
  NotificationFeedbackType: { Success: "SUCCESS", Warning: "WARNING", Error: "ERROR" },
}));

describe("triggerHaptic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Platform as { OS: string }).OS = "ios";
  });

  it("does nothing on web", () => {
    (Platform as { OS: string }).OS = "web";
    triggerHaptic({ type: "impact", style: Haptics.ImpactFeedbackStyle.Medium });
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it("does nothing when reducedMotion is true and force is false", () => {
    triggerHaptic({ type: "impact", style: Haptics.ImpactFeedbackStyle.Medium }, false, true);
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it("triggers haptic when reducedMotion is true but force is true", () => {
    triggerHaptic({ type: "impact", style: Haptics.ImpactFeedbackStyle.Medium }, true, true);
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
  });

  it("triggers impactAsync for impact type", () => {
    triggerHaptic({ type: "impact", style: Haptics.ImpactFeedbackStyle.Heavy });
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Heavy);
  });

  it("triggers notificationAsync for notification type", () => {
    triggerHaptic({ type: "notification", style: Haptics.NotificationFeedbackType.Success });
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success
    );
  });
});
