import React from "react";
import { View, Text, Platform, Image } from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";

interface DrawingOverlayProps {
  reducedMotion?: boolean;
}

export const DrawingOverlay = ({ reducedMotion = false }: DrawingOverlayProps) => {
  return (
    <View
      className="absolute inset-0 bg-black/80 z-50 items-center justify-center"
      pointerEvents="auto"
      accessibilityRole="progressbar"
      accessibilityLabel="運命を紐解いています"
      accessibilityLiveRegion="polite"
    >
      <MotiView
        from={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        className="items-center"
      >
        <MotiView
          from={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={
            reducedMotion
              ? { type: "timing", duration: 200 }
              : { type: "spring", damping: 14 }
          }
          className="mb-8 items-center"
        >
          <View className="items-center justify-center mb-6">
            <MotiView
              from={{ scale: 1, opacity: 0.3 }}
              animate={{ scale: 1.1, opacity: 0.75 }}
              transition={{
                type: "timing",
                duration: 1200,
                loop: true,
                repeatReverse: true,
                easing: Easing.inOut(Easing.ease),
              }}
              className="w-40 h-40 rounded-full bg-red-700/30"
              style={
                Platform.OS === "web"
                  ? { boxShadow: "0px 8px 18px rgba(239,68,68,0.45)" }
                  : {
                      shadowColor: "#ef4444",
                      shadowOpacity: 0.45,
                      shadowRadius: 18,
                      shadowOffset: { width: 0, height: 8 },
                    }
              }
            />
            <View className="absolute w-30 h-30 rounded-full bg-[#2a0f0f] border border-red-900/40" />
            <View className="absolute w-26 h-26 rounded-full border-2 border-red-500/45" />
          </View>
          <MotiView
            from={{ translateY: 10, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ delay: 120 }}
          >
            <Image
              source={require("../assets/omikuji_cylinder.png")}
              style={{ width: 120, height: 120 }}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </MotiView>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 14 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
        >
          <Text
            className="text-white font-shippori-bold text-xl text-center"
            style={{ letterSpacing: 1.2 }}
            accessibilityRole="text"
          >
            運命を紐解いています...
          </Text>
        </MotiView>
      </MotiView>
    </View>
  );
};
