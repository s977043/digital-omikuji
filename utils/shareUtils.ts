import { Platform, Share, View } from "react-native";
import { captureRef } from "react-native-view-shot";
import type React from "react";

/**
 * `executeShare` の呼び出しオプション。
 *
 * - `shareText`: シェア時のメッセージ本文（必須）
 * - `cardRef`: ネイティブ環境で `captureRef` に渡す View ref
 * - `webCardSelector`: Web 環境で HTML 要素を取得する CSS セレクタ
 * - `shareTitle`: Web の `navigator.share` や Android ダイアログのタイトル
 * - `backgroundColor`: Web の `html-to-image` に渡す背景色
 */
export interface ExecuteShareOptions {
  shareText: string;
  cardRef?: React.RefObject<View | null>;
  webCardSelector?: string;
  shareTitle?: string;
  backgroundColor?: string;
}

const DEFAULT_WEB_CARD_SELECTOR = '[data-testid="share-card"], [testID="share-card"]';

/**
 * プラットフォーム別にシェア処理を実行する。
 *
 * - **Web**: `html-to-image` で画面をキャプチャし、`navigator.share` または
 *   ダウンロードリンクでフォールバック。
 * - **iOS / Android**: `captureRef` でネイティブスクリーンショットを生成し、
 *   `Share.share` を呼び出す（iOS は url、Android は dialogTitle を渡す）。
 *
 * 個々のエラーは `console.error` で記録しつつテキストのみの共有にフォールバックし、
 * ユーザー体験を阻害しないように設計されている。
 */
export async function executeShare(options: ExecuteShareOptions): Promise<void> {
  const {
    shareText,
    cardRef,
    webCardSelector = DEFAULT_WEB_CARD_SELECTOR,
    shareTitle,
    backgroundColor,
  } = options;

  try {
    if (Platform.OS === "web") {
      // Web では Share.share (React Native API) が使えないため、
      // tryWebShare のみで完結する。失敗してもネイティブにフォールバックしない。
      await tryWebShare(shareText, webCardSelector, shareTitle, backgroundColor);
      return;
    }

    const imageUri = cardRef?.current ? await tryCaptureNative(cardRef) : undefined;

    await Share.share(
      {
        message: shareText,
        ...(imageUri && Platform.OS === "ios" ? { url: imageUri } : {}),
      },
      {
        ...(imageUri && Platform.OS === "android" && shareTitle ? { dialogTitle: shareTitle } : {}),
      }
    );
  } catch (error) {
    console.error("Sharing failed", error);
  }
}

/**
 * Web 環境で `html-to-image` を使って画像を生成し、`navigator.share` または
 * ダウンロードリンクで共有する。成功したかどうかを返す。
 */
async function tryWebShare(
  shareText: string,
  webCardSelector: string,
  shareTitle: string | undefined,
  backgroundColor: string | undefined
): Promise<boolean> {
  try {
    // 要素を先にチェックすることで、対象が存在しない/document が無い場合は
    // 重い html-to-image モジュールの dynamic import を回避する
    const element = globalThis.document?.querySelector?.(webCardSelector) as HTMLElement | null;
    if (!element) return false;

    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(element, {
      ...(backgroundColor ? { backgroundColor } : {}),
    });

    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], "omikuji.png", { type: "image/png" });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        ...(shareTitle ? { title: shareTitle } : {}),
        text: shareText,
      });
    } else {
      const link = document.createElement("a");
      link.download = "omikuji.png";
      link.href = dataUrl;
      link.click();
    }
    return true;
  } catch (webShareError) {
    // ユーザーが Web Share ダイアログをキャンセルした場合は AbortError が投げられるが、
    // これは正常動作でありエラーログする必要はない。
    if (webShareError instanceof DOMException && webShareError.name === "AbortError") {
      return true; // ダイアログは表示されたのでシェア処理自体は成功扱い
    }
    console.error("Web sharing failed", webShareError);
    return false;
  }
}

/**
 * `captureRef` でネイティブ画像キャプチャを試みる。失敗した場合は undefined を返し、
 * テキストのみのシェアにフォールバックできるようにする。
 */
async function tryCaptureNative(
  cardRef: React.RefObject<View | null>
): Promise<string | undefined> {
  try {
    return await captureRef(cardRef, { format: "png", quality: 0.8 });
  } catch (captureError) {
    console.error("Image capture failed", captureError);
    return undefined;
  }
}
