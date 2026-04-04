import React from "react";
import { Platform, Text, View } from "react-native";
import { MotionView } from "./MotionView";
import { getStringToken } from "../../design-system";

interface RevealStickStageProps {
  reducedMotion?: boolean;
}

export function RevealStickStage({ reducedMotion = false }: RevealStickStageProps) {
  const containerShadowStyle =
    Platform.OS === "web"
      ? { boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.25)" }
      : {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.25,
          shadowRadius: 24,
          elevation: 12,
        };

  const stickShadowStyle =
    Platform.OS === "web"
      ? { boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.18)" }
      : {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.18,
          shadowRadius: 16,
          elevation: 6,
        };

  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          width: "100%",
          minHeight: 320,
        }}
      >
        <MotionView
          from={{ translateY: 180, rotate: "180deg" }}
          animate={{ translateY: 0, rotate: "0deg" }}
          transition={
            reducedMotion ? { type: "timing", duration: 320 } : { type: "spring", damping: 15 }
          }
          style={{
            width: 176,
            height: 208,
            backgroundColor: "#7F1D1D",
            borderRadius: 28,
            borderWidth: 4,
            borderColor: "#D4A017",
            alignItems: "center",
            justifyContent: "center",
            ...containerShadowStyle,
          }}
        >
          <View
            style={{
              width: 92,
              height: 8,
              borderRadius: 999,
              backgroundColor: "rgba(251, 191, 36, 0.24)",
              marginBottom: 10,
            }}
          />
          <View
            style={{
              width: 72,
              height: 8,
              borderRadius: 999,
              backgroundColor: "rgba(251, 191, 36, 0.24)",
            }}
          />
        </MotionView>

        <MotionView
          from={{ translateY: 110, opacity: 0 }}
          animate={{ translateY: -110, opacity: 1 }}
          transition={
            reducedMotion
              ? { type: "timing", duration: 380, delay: 260 }
              : { type: "spring", delay: 260, damping: 12, stiffness: 100 }
          }
          style={{
            position: "absolute",
            width: 68,
            height: 196,
            backgroundColor: "#FEF3C7",
            bottom: 44,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            borderLeftWidth: 2,
            borderRightWidth: 2,
            borderTopWidth: 2,
            borderColor: "#FDE68A",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: 18,
            ...stickShadowStyle,
          }}
        >
          <Text
            style={{
              color: "#B91C1C",
              fontSize: 15,
              lineHeight: 18,
              textAlign: "center",
              fontFamily: getStringToken("primitive.typography.family.ritual"),
            }}
          >
            {"新春\n奉納"}
          </Text>
        </MotionView>

        <MotionView
          from={{ opacity: 0, scale: 0 }}
          animate={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1.4 }}
          transition={
            reducedMotion
              ? { delay: 180, type: "timing", duration: 180 }
              : { delay: 600, type: "timing", duration: 450 }
          }
          style={{
            position: "absolute",
            top: 18,
            width: 172,
            height: 172,
            borderRadius: 86,
            backgroundColor: "rgba(251, 191, 36, 0.22)",
          }}
        />
      </View>
    </View>
  );
}
