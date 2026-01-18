import React from "react";
import { View, Text, Image } from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";

interface ShakingOverlayProps {
  reducedMotion?: boolean;
}

const CYLINDER_SIZE = 160;

// パーティクル（光の粒）の設定
const PARTICLES = [
  { delay: 0, x: -80, y: -60, size: 8 },
  { delay: 200, x: 70, y: -40, size: 6 },
  { delay: 400, x: -50, y: 50, size: 10 },
  { delay: 100, x: 60, y: 70, size: 7 },
  { delay: 300, x: -30, y: -80, size: 5 },
  { delay: 500, x: 40, y: -70, size: 9 },
  { delay: 150, x: -70, y: 30, size: 6 },
  { delay: 350, x: 80, y: 20, size: 8 },
];

export const ShakingOverlay = ({ reducedMotion = false }: ShakingOverlayProps) => {
  return (
    <View
      className="absolute inset-0 bg-black/40 z-50 items-center justify-center backdrop-blur-sm"
      pointerEvents="auto"
      accessibilityRole="progressbar"
      accessibilityLabel="おみくじを振っています"
      accessibilityLiveRegion="polite"
    >
      {/* 背景のパルスオーラ（グロー効果）: boxShadowを廃止し、複数の円を重ねる */}
      <MotiView
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.8, opacity: 0.15 }}
        transition={{
          type: "timing",
          duration: 1200,
          loop: true,
          repeatReverse: true,
          easing: Easing.inOut(Easing.ease),
        }}
        className="absolute w-80 h-80 rounded-full bg-red-600/30"
      />
      <MotiView
        from={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.2 }}
        transition={{
          type: "timing",
          duration: 800,
          loop: true,
          repeatReverse: true,
          easing: Easing.inOut(Easing.ease),
        }}
        className="absolute w-64 h-64 rounded-full bg-red-500/20"
      />

      {/* 外側の光のリング */}
      <MotiView
        from={{ scale: 0.9, opacity: 0.4, rotate: "0deg" }}
        animate={{ scale: 1.2, opacity: 0.1, rotate: "360deg" }}
        transition={{
          type: "timing",
          duration: 3000,
          loop: true,
          easing: Easing.linear,
        }}
        className="absolute w-72 h-72 rounded-full border border-yellow-400/30"
      />

      {/* パーティクル（光の粒）: 以前より発光感を強調 */}
      {!reducedMotion &&
        PARTICLES.map((particle, index) => (
          <MotiView
            key={index}
            from={{
              translateX: 0,
              translateY: 0,
              opacity: 0,
              scale: 0.3,
            }}
            animate={{
              translateX: [0, particle.x * 0.5, particle.x, particle.x * 0.5, 0],
              translateY: [0, particle.y * 0.5, particle.y, particle.y * 0.5, 0],
              opacity: [0, 0.8, 1, 0.8, 0],
              scale: [0.3, 1, 1.3, 1, 0.3],
            }}
            transition={{
              type: "timing",
              duration: 1800,
              delay: particle.delay,
              loop: true,
              easing: Easing.inOut(Easing.ease),
            }}
            className="absolute rounded-full bg-yellow-200"
            style={{
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}

      {/* 筒の振動アニメーション */}
      <MotiView
        from={{
          translateX: 0,
          translateY: 0,
          rotate: "0deg",
          scale: 1,
        }}
        animate={
          reducedMotion
            ? {
                translateX: [-3, 3, -3],
                translateY: [-2, 2, -2],
                rotate: ["-2deg", "2deg", "-2deg"],
                scale: 1,
              }
            : {
                translateX: [-15, 15, -12, 18, -10, 14, -8, 0],
                translateY: [-8, 12, -10, 8, -12, 10, -6, 0],
                rotate: ["-12deg", "14deg", "-10deg", "12deg", "-8deg", "10deg", "-5deg", "0deg"],
                scale: [0.95, 1.05, 0.97, 1.03, 0.98, 1.02, 0.99, 1],
              }
        }
        transition={{
          type: "timing",
          duration: reducedMotion ? 300 : 150,
          loop: true,
          easing: Easing.linear,
        }}
        className="items-center"
      >
        {/* 筒の後ろの光のオーラ */}
        <MotiView
          from={{ opacity: 0.2, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1.15 }}
          transition={{
            type: "timing",
            duration: 400,
            loop: true,
            repeatReverse: true,
          }}
          className="absolute rounded-full"
          style={{
            width: CYLINDER_SIZE + 50,
            height: CYLINDER_SIZE + 50,
            backgroundColor: "rgba(253, 224, 71, 0.15)",
          }}
        />

        {/* 筒の画像：背景色を画像の背景色（#1e1b18）と一致させてチェッカーボードを隠す */}
        <View
          className="rounded-full border-2 border-yellow-500/40 overflow-hidden items-center justify-center"
          style={{
            width: CYLINDER_SIZE,
            height: CYLINDER_SIZE,
            backgroundColor: "#1e1b18", // 画像の背景色と同期
          }}
        >
          <Image
            source={require("../assets/omikuji_cylinder.png")}
            style={{ width: CYLINDER_SIZE + 2, height: CYLINDER_SIZE + 2 }}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        </View>

        {/* 筒から飛び出す光のエフェクト */}
        <MotiView
          from={{ translateY: 0, opacity: 0 }}
          animate={{ translateY: -30, opacity: [0, 1, 0] }}
          transition={{
            type: "timing",
            duration: 500,
            loop: true,
          }}
          className="absolute top-0 w-1.5 h-10 rounded-full bg-yellow-300/80"
        />
      </MotiView>

      {/* テキストアニメーション */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500, delay: 200 }}
        className="mt-12"
      >
        <MotiView
          from={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          transition={{
            type: "timing",
            duration: 600,
            loop: true,
            repeatReverse: true,
          }}
        >
          <Text
            className="text-yellow-400 font-shippori-bold text-3xl text-center tracking-[0.2em]"
            style={{
              textShadowColor: "rgba(0, 0, 0, 0.8)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
            }}
          >
            願いを込めて...
          </Text>
        </MotiView>

        {/* サブテキスト */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ type: "timing", duration: 1000, delay: 600 }}
        >
          <Text className="text-white/80 text-base text-center mt-3 tracking-widest font-shippori">
            心を静めて 筒を振りましょう
          </Text>
        </MotiView>
      </MotiView>
    </View>
  );
};
