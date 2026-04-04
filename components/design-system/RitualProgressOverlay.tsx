import React from "react";
import { Text, View } from "react-native";
import { Easing } from "react-native-reanimated";
import { MotionView } from "./MotionView";
import { getComponentTokens, getStringToken } from "../../design-system";

interface RitualProgressOverlayProps {
  label?: string;
  reducedMotion?: boolean;
}

export function RitualProgressOverlay({
  label = "運命を紐解いています...",
  reducedMotion = false,
}: RitualProgressOverlayProps) {
  const tokens = getComponentTokens<{
    backgroundColor: string;
    accentColor: string;
    ringColor: string;
    haloColor: string;
    haloBorderColor: string;
    innerRingColor: string;
    outerRingColor: string;
    subtitleColor: string;
  }>("overlay.ritualProgress");

  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: tokens.backgroundColor,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
      accessibilityRole="progressbar"
      accessibilityLabel={label.replace(/\.\.\.$/, "")}
      accessibilityLiveRegion="polite"
    >
      <MotionView
        from={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="items-center"
      >
        <View
          style={{
            width: 168,
            height: 168,
            borderRadius: 84,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: tokens.haloColor,
            borderWidth: 1,
            borderColor: tokens.haloBorderColor,
            marginBottom: 28,
          }}
        >
          <MotionView
            from={{ scale: 1, opacity: 0.65 }}
            animate={reducedMotion ? { scale: 1, opacity: 1 } : { scale: 1.18, opacity: 1 }}
            transition={
              reducedMotion
                ? { type: "timing", duration: 180 }
                : {
                    type: "timing",
                    duration: 850,
                    loop: true,
                    repeatReverse: true,
                  }
            }
            style={{
              width: 108,
              height: 108,
              borderRadius: 54,
              borderTopWidth: 2,
              borderLeftWidth: 2,
              borderColor: tokens.innerRingColor,
            }}
          />
          <MotionView
            from={{ rotate: "0deg" }}
            animate={reducedMotion ? { rotate: "0deg" } : { rotate: "360deg" }}
            transition={
              reducedMotion
                ? { type: "timing", duration: 180 }
                : {
                    type: "timing",
                    duration: 3800,
                    loop: true,
                    easing: Easing.linear,
                  }
            }
            style={{
              position: "absolute",
              width: 136,
              height: 136,
              borderRadius: 68,
              borderWidth: 1,
              borderColor: tokens.outerRingColor,
            }}
          />
        </View>
        <Text
          style={{
            color: tokens.ringColor,
            fontSize: 22,
            letterSpacing: 2,
            textAlign: "center",
            fontFamily: getStringToken("primitive.typography.family.ritual"),
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: tokens.subtitleColor,
            fontSize: 14,
            marginTop: 10,
            textAlign: "center",
            fontFamily: getStringToken("primitive.typography.family.ritualBody"),
          }}
        >
          新しい年の運を静かに選び取っています
        </Text>
      </MotionView>
    </View>
  );
}
