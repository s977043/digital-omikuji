import React from "react";
import { View, Text, Platform, Image } from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";

interface DrawingOverlayProps {
  reducedMotion?: boolean;
}

const CYLINDER_SIZE = 140;
const STICK_WIDTH = 24;
const STICK_HEIGHT = 180;

// 光の輪のエフェクト設定
const LIGHT_RINGS = [
  { delay: 0, size: 160, duration: 2000 },
  { delay: 400, size: 200, duration: 2200 },
  { delay: 800, size: 240, duration: 2400 },
];

export const DrawingOverlay = ({ reducedMotion = false }: DrawingOverlayProps) => {
  return (
    <View
      className="absolute inset-0 bg-black/85 z-50 items-center justify-center"
      pointerEvents="auto"
      accessibilityRole="progressbar"
      accessibilityLabel="運命を紐解いています"
      accessibilityLiveRegion="polite"
    >
      {/* 背景の神聖な光 */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 500 }}
        className="absolute inset-0 items-center justify-center"
      >
        {/* 放射状の光 */}
        <MotiView
          from={{ rotate: "0deg", opacity: 0.3 }}
          animate={{ rotate: "360deg", opacity: 0.6 }}
          transition={{
            type: "timing",
            duration: 20000,
            loop: true,
            easing: Easing.linear,
          }}
          className="absolute"
          style={{
            width: 400,
            height: 400,
            ...(Platform.OS === "web"
              ? {
                background:
                  "conic-gradient(from 0deg, transparent 0%, rgba(253, 224, 71, 0.15) 25%, transparent 50%, rgba(253, 224, 71, 0.15) 75%, transparent 100%)",
              }
              : {}),
          }}
        />

        {/* 拡大する光の輪 */}
        {!reducedMotion &&
          LIGHT_RINGS.map((ring, index) => (
            <MotiView
              key={index}
              from={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{
                type: "timing",
                duration: ring.duration,
                delay: ring.delay,
                loop: true,
                easing: Easing.out(Easing.ease),
              }}
              className="absolute rounded-full border-2 border-yellow-400/50"
              style={{
                width: ring.size,
                height: ring.size,
              }}
            />
          ))}
      </MotiView>

      {/* メインコンテンツエリア */}
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="items-center"
      >
        {/* 筒と棒のコンテナ */}
        <View className="items-center justify-center relative" style={{ height: 280 }}>
          {/* 筒の後ろの光のオーラ */}
          <MotiView
            from={{ scale: 0.9, opacity: 0.2 }}
            animate={{ scale: 1.2, opacity: 0.5 }}
            transition={{
              type: "timing",
              duration: 1500,
              loop: true,
              repeatReverse: true,
              easing: Easing.inOut(Easing.ease),
            }}
            className="absolute rounded-full"
            style={{
              width: CYLINDER_SIZE + 80,
              height: CYLINDER_SIZE + 80,
              backgroundColor: "rgba(220, 38, 38, 0.25)",
              top: 60,
              ...(Platform.OS === "web"
                ? { boxShadow: "0px 0px 50px 25px rgba(220, 38, 38, 0.3)" }
                : {
                  shadowColor: "#dc2626",
                  shadowOpacity: 0.3,
                  shadowRadius: 50,
                }),
            }}
          />

          {/* おみくじ棒（上昇アニメーション） */}
          <MotiView
            from={{ translateY: 80, opacity: 0 }}
            animate={{ translateY: -60, opacity: 1 }}
            transition={
              reducedMotion
                ? { type: "timing", duration: 2500, easing: Easing.out(Easing.ease) }
                : {
                  type: "timing",
                  duration: 2800,
                  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                }
            }
            className="absolute z-10 items-center"
            style={{ top: 20 }}
          >
            {/* 棒の光エフェクト */}
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.8, 0.4, 0.8], scale: [0.8, 1.2, 1, 1.1] }}
              transition={{
                type: "timing",
                duration: 1000,
                delay: 1800,
                loop: true,
              }}
              className="absolute rounded-full"
              style={{
                width: STICK_WIDTH + 30,
                height: STICK_HEIGHT + 10,
                backgroundColor: "rgba(253, 224, 71, 0.2)",
                ...(Platform.OS === "web"
                  ? { boxShadow: "0px 0px 20px 10px rgba(253, 224, 71, 0.4)" }
                  : {
                    shadowColor: "#fde047",
                    shadowOpacity: 0.4,
                    shadowRadius: 20,
                  }),
              }}
            />

            {/* 実際の棒 - 画像を使用 */}
            <Image
              source={require("../assets/omikuji_stick.png")}
              style={{
                width: STICK_WIDTH + 20,
                height: STICK_HEIGHT,
                ...(Platform.OS === "web"
                  ? { boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)" }
                  : {
                    shadowColor: "#000",
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 4 },
                  }),
              }}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </MotiView>

          {/* 筒 */}
          <MotiView
            from={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12, delay: 100 }}
            className="absolute items-center justify-center"
            style={{ top: 80 }}
          >
            <View
              className="rounded-full border-2 border-red-700/50 overflow-hidden items-center justify-center"
              style={{
                width: CYLINDER_SIZE,
                height: CYLINDER_SIZE,
                backgroundColor: "rgba(139, 11, 11, 0.9)",
                ...(Platform.OS === "web"
                  ? { boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.4)" }
                  : {
                    shadowColor: "#000",
                    shadowOpacity: 0.4,
                    shadowRadius: 20,
                    shadowOffset: { width: 0, height: 8 },
                  }),
              }}
            >
              <Image
                source={require("../assets/omikuji_cylinder.png")}
                style={{ width: CYLINDER_SIZE, height: CYLINDER_SIZE }}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
            </View>

            {/* 筒の揺れエフェクト（棒が出る時） */}
            <MotiView
              from={{ rotate: "0deg" }}
              animate={
                reducedMotion
                  ? { rotate: "0deg" }
                  : { rotate: ["-2deg", "2deg", "-1deg", "1deg", "0deg"] }
              }
              transition={{
                type: "timing",
                duration: 500,
                delay: 2000,
                loop: false,
              }}
              className="absolute inset-0"
            />
          </MotiView>
        </View>

        {/* テキストエリア */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", delay: 400, damping: 15 }}
          className="mt-6 items-center"
        >
          <MotiView
            from={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{
              type: "timing",
              duration: 800,
              loop: true,
              repeatReverse: true,
            }}
          >
            <Text
              className="text-white font-shippori-bold text-xl text-center"
              style={{
                letterSpacing: 2,
                textShadowColor: "rgba(255, 255, 255, 0.3)",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              }}
            >
              運命を紐解いています...
            </Text>
          </MotiView>

          {/* プログレス的なドットアニメーション */}
          <View className="flex-row mt-4 space-x-2">
            {[0, 1, 2].map((i) => (
              <MotiView
                key={i}
                from={{ opacity: 0.3, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.2 }}
                transition={{
                  type: "timing",
                  duration: 500,
                  delay: i * 200,
                  loop: true,
                  repeatReverse: true,
                }}
                className="w-2 h-2 rounded-full bg-yellow-400 mx-1"
              />
            ))}
          </View>
        </MotiView>
      </MotiView>

      {/* 光のバースト（後半で発動） */}
      <MotiView
        from={{ scale: 0, opacity: 0 }}
        animate={{ scale: 2, opacity: [0, 0.6, 0] }}
        transition={{
          type: "timing",
          duration: 800,
          delay: 2500,
          easing: Easing.out(Easing.ease),
        }}
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          backgroundColor: "rgba(253, 224, 71, 0.3)",
          ...(Platform.OS === "web"
            ? { boxShadow: "0px 0px 60px 30px rgba(253, 224, 71, 0.5)" }
            : {
              shadowColor: "#fde047",
              shadowOpacity: 0.5,
              shadowRadius: 60,
            }),
        }}
      />
    </View>
  );
};
