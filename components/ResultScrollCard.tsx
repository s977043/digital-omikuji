import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    Share,
} from "react-native";
import { MotiView } from "moti";
import { OmikujiResult } from "../types/omikuji";
import { captureRef } from "react-native-view-shot";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

interface ResultScrollCardProps {
    fortune: OmikujiResult;
    onReset: () => void;
}

export const ResultScrollCard = ({
    fortune,
    onReset,
}: ResultScrollCardProps) => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const scrollRef = useRef<View>(null);

    const handleShare = async () => {
        try {
            if (Platform.OS !== "web") {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }

            const message = `🎍 2026年 新春おみくじ 🎍\n\n私の運勢は… ✨ ${fortune.fortuneParams.title} ✨\n「${fortune.fortuneParams.description}」\n\n#おみくじ2026 #新春`;

            // Capture logic
            let imageUri: string | undefined;
            // We capture the whole scroll card (or just the visible part if preferred, but usually whole card is better)
            // Note: Capturing a scrollview with content offscreen can be tricky.
            // For MVP, we capture what's visible or the reference to the container.
            if (Platform.OS !== "web" && scrollRef.current) {
                try {
                    imageUri = await captureRef(scrollRef, {
                        format: "png",
                        quality: 0.8,
                    });
                } catch (captureError) {
                    console.error("Image capture failed", captureError);
                }
            }

            await Share.share(
                {
                    message,
                    ...(imageUri && Platform.OS === "ios" ? { url: imageUri } : {}),
                },
                {
                    ...(imageUri && Platform.OS === "android"
                        ? { dialogTitle: "おみくじをシェア" }
                        : {}),
                }
            );

            // Unlock after share attempt (we assume success or intent)
            if (!isUnlocked) {
                setIsUnlocked(true);
                if (Platform.OS !== "web") {
                    await Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success
                    );
                }
            }
        } catch (error) {
            console.error("Sharing failed", error);
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-black/80 px-4 py-8 w-full h-full absolute inset-0 z-50">
            <MotiView
                from={{ opacity: 0, scale: 0.9, translateY: 20 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                transition={{ type: "spring", damping: 20 }}
                className="w-full max-w-md h-[85%] bg-[#FDF5E6] rounded-sm overflow-hidden flex-col shadow-2xl relative"
                ref={scrollRef}
            >
                {/* Scroll Header Decoration */}
                <View className="h-4 bg-amber-800 w-full" />
                <View className="h-2 bg-amber-600 w-full mb-4" />

                <ScrollView
                    className="flex-1 px-6"
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Main Result (Top) */}
                    <View className="items-center mt-8 mb-8 border-b-2 border-dashed border-slate-300 pb-8">
                        <Text className="text-xl text-slate-500 font-shippori tracking-widest mb-4">
                            令和八年 丙午
                        </Text>

                        {/* Fortune Title (Vertical-ish via large font or narrow width logic if needed, but horizontal is safe) */}
                        <Text
                            className="text-7xl font-shippori-bold mb-6 text-center"
                            style={{ color: fortune.color }}
                        >
                            {fortune.fortuneParams.title}
                        </Text>

                        <Text className="text-lg text-slate-700 font-shippori text-center leading-loose px-4">
                            {fortune.fortuneParams.description}
                        </Text>
                    </View>

                    {/* Detailed Section (Locked/Unlocked) */}
                    <View className="relative min-h-[200px]">
                        <Text className="text-center text-slate-400 font-bold mb-6 text-sm tracking-widest">
                            ── 運勢詳細 ──
                        </Text>

                        {isUnlocked ? (
                            // Unlocked Content
                            <MotiView
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 500 }}
                                className="space-y-4"
                            >
                                {fortune.details?.map((detail, index) => (
                                    <View
                                        key={index}
                                        className="flex-row border-b border-slate-200 pb-2 mb-2"
                                    >
                                        <Text className="text-slate-500 w-16 font-shippori-bold">{detail.label}</Text>
                                        <Text className="text-slate-800 flex-1 font-shippori">{detail.text}</Text>
                                    </View>
                                ))}
                                {!fortune.details && <Text>詳細情報はありません。</Text>}
                            </MotiView>
                        ) : (
                            // Locked Content (Blurred/Hidden)
                            <View className="relative items-center justify-center py-8">
                                {/* Simulated blurred text */}
                                <View className="w-full opacity-30 blur-sm space-y-4">
                                    <View className="h-4 bg-slate-400 rounded w-3/4 self-center" />
                                    <View className="h-4 bg-slate-400 rounded w-5/6 self-center" />
                                    <View className="h-4 bg-slate-400 rounded w-2/3 self-center" />
                                    <View className="h-4 bg-slate-400 rounded w-4/5 self-center" />
                                </View>

                                {/* Unlock Action Overlay */}
                                <View className="absolute inset-0 items-center justify-center">
                                    <TouchableOpacity
                                        onPress={handleShare}
                                        className="bg-black/80 px-6 py-3 rounded-full flex-row items-center space-x-2 shadow-lg active:scale-95 transition-transform"
                                    >
                                        <Ionicons name="lock-closed" size={16} color="white" style={{ marginRight: 8 }} />
                                        <Text className="text-white font-bold text-sm">
                                            シェアして詳細を見る
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>

                {/* Footer Actions (Sticky) */}
                {!isUnlocked && (
                    <View className="p-4 bg-[#FDF5E6]/95 border-t border-amber-100 flex-row gap-4">
                        <TouchableOpacity
                            onPress={onReset}
                            className="flex-1 py-3 rounded-full border border-slate-300 items-center"
                        >
                            <Text className="text-slate-600 font-bold">閉じる</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {isUnlocked && (
                    <View className="p-4 bg-[#FDF5E6]/95 border-t border-amber-100 flex-row gap-4">
                        <TouchableOpacity
                            onPress={handleShare}
                            className="flex-1 py-3 bg-slate-100 rounded-full items-center border border-slate-200"
                        >
                            <Text className="text-slate-800 font-bold">再シェア</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onReset}
                            className="flex-1 py-3 bg-slate-900 rounded-full items-center"
                        >
                            <Text className="text-white font-bold">閉じる</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Scroll Footer Decoration */}
                <View className="h-2 bg-amber-600 w-full mt-auto" />
                <View className="h-4 bg-amber-800 w-full" />
            </MotiView>
        </View>
    );
};
