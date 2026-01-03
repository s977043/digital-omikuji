import React, { forwardRef } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { OmikujiResult } from "../types/omikuji";

interface ShareImageCardProps {
  fortune: OmikujiResult;
}

// シェア用の固定サイズ（Instagram Stories向け 1080x1920 の縮小版）
const SHARE_IMAGE_WIDTH = 540;
const SHARE_IMAGE_HEIGHT = 960;

/**
 * シェア用に最適化された結果カード
 * - 固定サイズで端末解像度に依存しない
 * - 画像・運勢名・一言の3点セットを1枚に合成
 * - 装飾的なデザインでSNS映えを意識
 */
const ShareImageCard = forwardRef<View, ShareImageCardProps>(
  ({ fortune }, ref) => {
    return (
      <View
        ref={ref}
        style={[
          styles.container,
          { backgroundColor: getBackgroundColor(fortune.color) },
        ]}
      >
        {/* 背景装飾 */}
        <View style={styles.decorTop} />
        <View style={styles.decorBottom} />

        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.headerText}>🎍 2026年 新春おみくじ 🎍</Text>
        </View>

        {/* メインコンテンツ */}
        <View style={styles.content}>
          {/* おみくじ画像 */}
          <View style={[styles.imageContainer, { borderColor: fortune.color }]}>
            <Image
              source={fortune.image}
              style={styles.fortuneImage}
              resizeMode="cover"
            />
          </View>

          {/* 運勢タイトル */}
          <View style={[styles.titleContainer, { backgroundColor: fortune.color }]}>
            <Text style={styles.titleText}>{fortune.fortuneParams.title}</Text>
          </View>

          {/* 一言メッセージ */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              「{fortune.fortuneParams.description}」
            </Text>
          </View>
        </View>

        {/* フッター */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>#おみくじ2026 #新春</Text>
        </View>
      </View>
    );
  }
);

ShareImageCard.displayName = "ShareImageCard";

/**
 * 運勢の色に基づいて背景色を決定
 */
function getBackgroundColor(color: string): string {
  // 運勢色を薄くした背景色を生成
  const colorMap: Record<string, string> = {
    "#FFD700": "#FFF9E6", // 大吉 - クリーム
    "#FF8C00": "#FFF3E6", // 中吉 - 薄オレンジ
    "#32CD32": "#F0FFF0", // 小吉 - 薄緑
    "#4169E1": "#F0F4FF", // 吉 - 薄青
    "#9370DB": "#F5F0FF", // 末吉 - 薄紫
    "#808080": "#F5F5F5", // 凶 - 薄灰
    "#2F4F4F": "#F0F0F0", // 大凶 - 灰白
  };
  return colorMap[color] || "#FFFFFF";
}

const styles = StyleSheet.create({
  container: {
    width: SHARE_IMAGE_WIDTH,
    height: SHARE_IMAGE_HEIGHT,
    padding: 40,
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },
  decorTop: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  decorBottom: {
    position: "absolute",
    bottom: -80,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  header: {
    marginTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  imageContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    overflow: "hidden",
    marginBottom: 30,
    backgroundColor: "#FFF",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fortuneImage: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  titleText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  messageContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 20,
    maxWidth: "90%",
  },
  messageText: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
    lineHeight: 32,
  },
  footer: {
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default ShareImageCard;
