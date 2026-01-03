import { Share, Platform } from "react-native";
import { captureRef } from "react-native-view-shot";
import { OmikujiResult } from "../types/omikuji";

/**
 * シェア用の一時画像を生成
 * @param viewRef - キャプチャ対象のViewのref
 * @returns 生成した画像のURI、失敗時はnull
 */
export async function captureShareImage(
  viewRef: React.RefObject<any>
): Promise<string | null> {
  if (Platform.OS === "web" || !viewRef.current) {
    return null;
  }

  try {
    // react-native-view-shot は一時ファイルを自動生成
    const uri = await captureRef(viewRef, {
      format: "png",
      quality: 1,
      result: "tmpfile",
    });

    return uri;
  } catch (error) {
    console.error("Failed to capture share image:", error);
    return null;
  }
}

/**
 * おみくじ結果をシェア
 * 画像があれば画像付き、なければテキストのみ
 */
export async function shareOmikujiResult(
  fortune: OmikujiResult,
  imageUri: string | null
): Promise<{ success: boolean; method: "image" | "text" }> {
  const message = buildShareMessage(fortune);

  try {
    if (imageUri && Platform.OS !== "web") {
      // 画像付きシェア
      if (Platform.OS === "ios") {
        await Share.share({
          message,
          url: imageUri,
        });
        return { success: true, method: "image" };
      } else {
        // Android: React Native の Share API は画像URLを直接サポートしないため
        // メッセージのみシェア（expo-sharing を使えば画像も可能）
        await Share.share(
          { message },
          { dialogTitle: "おみくじをシェア" }
        );
        return { success: true, method: "text" };
      }
    } else {
      // テキストのみシェア（フォールバック）
      await Share.share({ message });
      return { success: true, method: "text" };
    }
  } catch (error) {
    console.error("Share failed:", error);

    // 最終フォールバック: テキストのみ
    try {
      await Share.share({ message });
      return { success: true, method: "text" };
    } catch (fallbackError) {
      console.error("Fallback share also failed:", fallbackError);
      return { success: false, method: "text" };
    }
  }
}

/**
 * シェア用メッセージを生成
 */
export function buildShareMessage(fortune: OmikujiResult): string {
  return `🎍 2026年 新春おみくじ 🎍

私の運勢は… ✨ ${fortune.fortuneParams.title} ✨

「${fortune.fortuneParams.description}」

#おみくじ2026 #新春`;
}

/**
 * 古い一時ファイルをクリーンアップ
 * Note: react-native-view-shot の tmpfile は OS が自動管理するため
 * 明示的なクリーンアップは不要だが、将来の拡張用にスタブを残す
 */
export async function cleanupOldShareFiles(): Promise<void> {
  // react-native-view-shot の一時ファイルは
  // OS のキャッシュディレクトリに作成され、自動的にクリーンアップされる
  // expo-file-system を使う場合は手動クリーンアップが必要
}
