import React from "react";
import { View, Text } from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";

export const DrawingOverlay = () => {
  return (
    <View
      className="absolute inset-0 bg-black/80 z-50 items-center justify-center"
      pointerEvents="auto"
      accessibilityRole="progressbar"
      accessibilityLabel="運命を紐解いています"
      accessibilityLiveRegion="polite"
    >
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        className="items-center"
      >
        {/* Breathing Circle Core */}
        <MotiView
          from={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{
            type: "timing",
            duration: 800,
            loop: true,
            repeatReverse: true,
          }}
          className="w-32 h-32 rounded-full bg-red-600/30 items-center justify-center mb-8 border border-red-500/50 shadow-2xl shadow-red-500"
        >
          <MotiView
            from={{ rotate: "0deg" }}
            animate={{ rotate: "360deg" }}
            transition={{
              type: "timing",
              duration: 4000,
              loop: true,
              repeatReverse: false,
              easing: Easing.linear,
            }}
            className="w-24 h-24 border-t-2 border-l-2 border-white/40 rounded-full"
          />
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
        >
          <Text
            className="text-white font-shippori-bold text-xl tracking-[0.2em] text-center"
            accessibilityRole="text"
          >
            運命を紐解いています...
          </Text>
        </MotiView>
      </MotiView>
    </View>
  );
};
