import { FortuneLevel } from "../types/omikuji";

/**
 * 特別演出設定（大吉専用など）
 */
export interface SpecialEffectConfig {
    /** 追加パルスの色 */
    pulseColor: string;
    /** 追加パルスの持続時間 (ms) */
    pulseDuration: number;
    /** 回転ボーダーの色 */
    rotatingBorderColor: string;
    /** 回転ボーダーの太さ */
    rotatingBorderWidth: number;
    /** 回転の持続時間 (ms) */
    rotatingDuration: number;
}

/**
 * 運勢別アニメーション設定
 */
export interface FortuneAnimationConfig {
    /** スプリングのダンピング値 (低いほど弾む) */
    springDamping: number;
    /** パルスアニメーションを有効にするか */
    enablePulse: boolean;
    /** パルスの色 */
    pulseColor: string;
    /** エントリーアニメーションのスケール開始値 */
    entryScale: number;
    /** 段階的アニメーションの基本遅延 (ms) */
    staggerDelay: number;
    /** 特別演出設定（大吉など） */
    specialEffect?: SpecialEffectConfig;
}

/**
 * 運勢別のアニメーション設定マップ
 */
export const FORTUNE_ANIMATIONS: Record<FortuneLevel, FortuneAnimationConfig> =
{
    daikichi: {
        springDamping: 10,
        enablePulse: true,
        pulseColor: "rgba(255, 215, 0, 0.4)", // Gold
        entryScale: 0.6,
        staggerDelay: 200,
        specialEffect: {
            pulseColor: "rgba(255, 215, 0, 0.2)",
            pulseDuration: 1500,
            rotatingBorderColor: "rgba(250, 204, 21, 0.3)",
            rotatingBorderWidth: 2,
            rotatingDuration: 8000,
        },
    },
    chukichi: {
        springDamping: 12,
        enablePulse: true,
        pulseColor: "rgba(255, 140, 0, 0.3)", // DarkOrange
        entryScale: 0.7,
        staggerDelay: 180,
    },
    shokichi: {
        springDamping: 14,
        enablePulse: false,
        pulseColor: "rgba(50, 205, 50, 0.2)",
        entryScale: 0.75,
        staggerDelay: 160,
    },
    kichi: {
        springDamping: 15,
        enablePulse: false,
        pulseColor: "rgba(65, 105, 225, 0.2)",
        entryScale: 0.8,
        staggerDelay: 150,
    },
    suekichi: {
        springDamping: 15,
        enablePulse: false,
        pulseColor: "rgba(147, 112, 219, 0.2)",
        entryScale: 0.8,
        staggerDelay: 150,
    },
    kyo: {
        springDamping: 18,
        enablePulse: false,
        pulseColor: "rgba(128, 128, 128, 0.2)",
        entryScale: 0.85,
        staggerDelay: 140,
    },
    daikyo: {
        springDamping: 20,
        enablePulse: true,
        pulseColor: "rgba(47, 79, 79, 0.3)", // DarkSlateGray
        entryScale: 0.9,
        staggerDelay: 140,
    },
};

