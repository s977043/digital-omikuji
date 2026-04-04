import React from "react";
import { Text } from "react-native";
import { MotionView } from "../design-system/MotionView";
import { getStringToken } from "../../design-system";

interface ShakingPatternProps {
  reducedMotion?: boolean;
}

export function ShakingPattern({ reducedMotion = false }: ShakingPatternProps) {
  return (
    <MotionView
      from={{ translateX: -12, rotateZ: "-8deg", scale: 0.96 }}
      animate={{
        translateX: reducedMotion ? [-4, 4, -4] : [-16, 16, -16, 16, 0],
        rotateZ: reducedMotion ? "-2deg" : ["-10deg", "10deg", "0deg"],
        scale: reducedMotion ? 1 : [0.96, 1.06, 1],
      }}
      transition={{ type: "timing", duration: 90, loop: true }}
      style={{ alignItems: "center" }}
    >
      <Text style={{ fontSize: 92 }}>🫨</Text>
      <MotionView
        from={{ opacity: 0.65, scale: 1 }}
        animate={{ opacity: 1, scale: 1.08 }}
        transition={{ type: "timing", duration: 500, loop: true, repeatReverse: true }}
        style={{
          marginTop: 28,
          backgroundColor: "rgba(0,0,0,0.45)",
          borderWidth: 1,
          borderColor: "rgba(251, 191, 36, 0.46)",
          borderRadius: 999,
          paddingHorizontal: 24,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            color: "#FBBF24",
            fontSize: 18,
            letterSpacing: 2.2,
            fontFamily: getStringToken("primitive.typography.family.ritual"),
          }}
        >
          念を込めて...
        </Text>
      </MotionView>
    </MotionView>
  );
}
