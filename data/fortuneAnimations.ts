import { FortuneLevel } from "../types/omikuji";

/**
 * 運勢別アニメーション設定
 */
export interface FortuneAnimationConfig {
    /** 登場アニメーションの持続時間 (ms) */
    entranceDuration: number;
    /** スプリングのダンピング値 (低いほど弾む) */
    springDamping: number;
    /** パルスアニメーションを有効にするか */
    enablePulse: boolean;
    /** パルスの色 */
    pulseColor: string;
    /** 背景のグラデーション開始色 */
    gradientStart: string;
    /** 背景のグラデーション終了色 */
    gradientEnd: string;
    /** エントリーアニメーションのスケール開始値 */
    entryScale: number;
}

/**
 * 運勢別のアニメーション設定マップ
 */
export const FORTUNE_ANIMATIONS: Record<FortuneLevel, FortuneAnimationConfig> =
{
    daikichi: {
        entranceDuration: 800,
        springDamping: 10,
        enablePulse: true,
        pulseColor: "rgba(255, 215, 0, 0.4)", // Gold
        gradientStart: "#FFF8DC",
        gradientEnd: "#FFD700",
        entryScale: 0.6,
    },
    chukichi: {
        entranceDuration: 700,
        springDamping: 12,
        enablePulse: true,
        pulseColor: "rgba(255, 140, 0, 0.3)", // DarkOrange
        gradientStart: "#FFF5E6",
        gradientEnd: "#FF8C00",
        entryScale: 0.7,
    },
    shokichi: {
        entranceDuration: 600,
        springDamping: 14,
        enablePulse: false,
        pulseColor: "rgba(50, 205, 50, 0.2)",
        gradientStart: "#F0FFF0",
        gradientEnd: "#32CD32",
        entryScale: 0.75,
    },
    kichi: {
        entranceDuration: 500,
        springDamping: 15,
        enablePulse: false,
        pulseColor: "rgba(65, 105, 225, 0.2)",
        gradientStart: "#F0F8FF",
        gradientEnd: "#4169E1",
        entryScale: 0.8,
    },
    suekichi: {
        entranceDuration: 500,
        springDamping: 15,
        enablePulse: false,
        pulseColor: "rgba(147, 112, 219, 0.2)",
        gradientStart: "#FAF0FF",
        gradientEnd: "#9370DB",
        entryScale: 0.8,
    },
    kyo: {
        entranceDuration: 600,
        springDamping: 18,
        enablePulse: false,
        pulseColor: "rgba(128, 128, 128, 0.2)",
        gradientStart: "#F5F5F5",
        gradientEnd: "#808080",
        entryScale: 0.85,
    },
    daikyo: {
        entranceDuration: 700,
        springDamping: 20,
        enablePulse: true,
        pulseColor: "rgba(47, 79, 79, 0.3)", // DarkSlateGray
        gradientStart: "#E8E8E8",
        gradientEnd: "#2F4F4F",
        entryScale: 0.9,
    },
};
