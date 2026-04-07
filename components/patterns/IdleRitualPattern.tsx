import React from "react";
import { Image, Text, useWindowDimensions, View } from "react-native";
import { Button } from "../design-system/Button";
import { getStringToken } from "../../design-system";
import { COMPACT_HEIGHT_BREAKPOINT } from "../../constants/layout";

interface IdleRitualPatternProps {
  hasDrawnToday: boolean;
  onDraw: () => void;
  onShowResult: () => void;
}

export function IdleRitualPattern({ hasDrawnToday, onDraw, onShowResult }: IdleRitualPatternProps) {
  const { height } = useWindowDimensions();
  const isCompactHeight = height < COMPACT_HEIGHT_BREAKPOINT;
  const circleSize = isCompactHeight ? 168 : 220;
  const imageSize = isCompactHeight ? 148 : 196;
  const titleFontSize = hasDrawnToday ? (isCompactHeight ? 22 : 26) : isCompactHeight ? 26 : 30;
  const titleLineHeight = hasDrawnToday ? (isCompactHeight ? 32 : 38) : isCompactHeight ? 34 : 42;

  return (
    <View style={{ alignItems: "center", paddingHorizontal: isCompactHeight ? 16 : 24 }}>
      <View
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          backgroundColor: "rgba(255, 255, 255, 0.10)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.20)",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: isCompactHeight ? 16 : 24,
        }}
      >
        <Image
          source={
            hasDrawnToday
              ? require("../../assets/omikuji_confirmed.png")
              : require("../../assets/omikuji_cylinder.png")
          }
          style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }}
          resizeMode="cover"
        />
      </View>

      <Text
        style={{
          color: "white",
          fontSize: titleFontSize,
          lineHeight: titleLineHeight,
          textAlign: "center",
          marginBottom: isCompactHeight ? 8 : 12,
          fontFamily: getStringToken("primitive.typography.family.ritual"),
        }}
      >
        {hasDrawnToday
          ? "本日の運勢はすでに授かっています"
          : "静かに息を整えて\nおみくじを引きましょう"}
      </Text>
      <Text
        style={{
          color: "rgba(255,255,255,0.74)",
          fontSize: isCompactHeight ? 14 : 15,
          lineHeight: isCompactHeight ? 22 : 24,
          textAlign: "center",
          marginBottom: isCompactHeight ? 16 : 24,
          fontFamily: getStringToken("primitive.typography.family.ritualBody"),
        }}
      >
        {hasDrawnToday
          ? "もう一度結果を読み返して、今日の過ごし方を確かめられます"
          : "シェイクでもタップでも始められます。気持ちが整ったら、そっと始めてください"}
      </Text>

      {hasDrawnToday ? (
        <Button
          label="結果をもう一度見る"
          onPress={onShowResult}
          variant="secondaryQuiet"
          accessibilityLabel="結果をもう一度見る"
          style={{ minWidth: isCompactHeight ? 220 : 240 }}
        />
      ) : (
        <>
          <Button
            label="おみくじを引く"
            onPress={onDraw}
            variant="primaryRitual"
            accessibilityLabel="おみくじを引く"
            accessibilityHint="スマートフォンを振るか、このボタンをタップしておみくじを引きます"
            style={{ minWidth: isCompactHeight ? 220 : 240 }}
          />
          <View
            style={{
              marginTop: isCompactHeight ? 12 : 18,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.18)",
              borderRadius: 999,
              paddingHorizontal: isCompactHeight ? 14 : 16,
              paddingVertical: isCompactHeight ? 6 : 8,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.82)",
                fontSize: isCompactHeight ? 11 : 12,
                letterSpacing: isCompactHeight ? 1.4 : 2,
                fontWeight: "700",
              }}
            >
              令和八年 丙午 デジタルおみくじ
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
