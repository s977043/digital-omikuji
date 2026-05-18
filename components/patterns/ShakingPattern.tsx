import React from "react";
import { Text, View } from "react-native";
import { MotionView } from "../design-system/MotionView";
import { getStringToken } from "../../design-system";

interface ShakingPatternProps {
  reducedMotion?: boolean;
}

const SPARKLE_CONFIGS = [
  { x: -60, y: -50, delay: 0, size: 6 },
  { x: 55, y: -40, delay: 120, size: 8 },
  { x: -45, y: 30, delay: 240, size: 5 },
  { x: 50, y: 45, delay: 360, size: 7 },
  { x: 0, y: -65, delay: 180, size: 6 },
];

export function ShakingPattern({ reducedMotion = false }: ShakingPatternProps) {
  const accentColor = getStringToken("semantic.text.accent");
  return (
    <View
      style={{ alignItems: "center" }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="念を込めてシェイクしています"
      accessibilityLiveRegion="polite"
    >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {!reducedMotion && (
          <MotionView
            from={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.35, scale: 1.3 }}
            transition={{ type: "timing", duration: 800, loop: true, repeatReverse: true }}
            style={{
              position: "absolute",
              width: 180,
              height: 180,
              borderRadius: 90,
              backgroundColor: accentColor,
            }}
          />
        )}

        {!reducedMotion &&
          SPARKLE_CONFIGS.map((spark, i) => (
            <MotionView
              key={i}
              from={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0.3] }}
              transition={{
                type: "timing",
                duration: 600,
                delay: spark.delay,
                loop: true,
              }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                marginLeft: spark.x - spark.size / 2,
                marginTop: spark.y - spark.size / 2,
                width: spark.size,
                height: spark.size,
                borderRadius: spark.size / 2,
                backgroundColor: accentColor,
              }}
            />
          ))}

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
        </MotionView>
      </View>

      <MotionView
        from={{ opacity: 0.65, scale: 1 }}
        animate={{ opacity: 1, scale: 1.08 }}
        transition={{ type: "timing", duration: 500, loop: true, repeatReverse: true }}
        style={{
          marginTop: 28,
          backgroundColor: "rgba(0,0,0,0.45)",
          borderWidth: 1,
          borderColor: `${accentColor}75`,
          borderRadius: 999,
          paddingHorizontal: 24,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            color: accentColor,
            fontSize: 18,
            letterSpacing: 2.2,
            fontFamily: getStringToken("primitive.typography.family.ritual"),
          }}
        >
          念を込めて...
        </Text>
      </MotionView>
    </View>
  );
}
