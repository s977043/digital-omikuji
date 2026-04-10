import { useCallback } from "react";
import { Alert, Platform, ToastAndroid } from "react-native";
import { AppError, AppErrorContext, wrapError } from "../utils/AppError";
import { captureException, captureMessage } from "../utils/sentry";

/**
 * クロスプラットフォームでユーザー通知を表示する。
 * - Android: ToastAndroid
 * - iOS: Alert.alert
 * - Web: window.alert（利用可能時）または console
 */
function showUserNotification(message: string, title?: string): void {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }

  if (Platform.OS === "ios") {
    Alert.alert(title ?? "お知らせ", message);
    return;
  }

  // Web
  if (typeof globalThis !== "undefined" && typeof globalThis.alert === "function") {
    globalThis.alert(`${title ? `${title}\n\n` : ""}${message}`);
    return;
  }

  console.warn("[Notification]", title ?? "", message);
}

interface HandleErrorOptions {
  /** ユーザーに表示するメッセージ（指定時は AppError.category に関わらず表示） */
  userMessage?: string;
  /** 通知のタイトル（iOS のみ使用） */
  userMessageTitle?: string;
  /** AppError に変換する際のデフォルトコンテキスト */
  fallbackContext?: AppErrorContext;
}

/**
 * 統一されたエラーハンドリングフック。
 *
 * 役割:
 * - エラーを AppError に正規化
 * - Sentry への送信（silent 以外）
 * - ユーザー通知（userVisible または userMessage 明示時）
 * - console.error への出力（開発時の可視性維持）
 */
export function useErrorHandler() {
  const handleError = useCallback((error: unknown, options: HandleErrorOptions = {}) => {
    const appError =
      error instanceof AppError
        ? error
        : wrapError(error, {
            context: options.fallbackContext ?? {
              source: "unknown",
              operation: "unknown",
            },
          });

    // 開発時の可視性維持
    console.error(
      `[${appError.context.source}:${appError.context.operation}]`,
      appError.message,
      appError.cause ?? ""
    );

    // Sentry への送信（silent 以外）
    if (appError.category !== "silent") {
      if (appError.cause instanceof Error) {
        captureException(appError.cause, {
          message: appError.message,
          category: appError.category,
          severity: appError.severity,
          ...appError.context,
        });
      } else {
        captureMessage(appError.message, appError.severity);
      }
    }

    // ユーザー通知
    const shouldNotify = options.userMessage || appError.category === "userVisible";
    if (shouldNotify) {
      const message = options.userMessage ?? appError.message;
      showUserNotification(message, options.userMessageTitle);
    }

    return appError;
  }, []);

  return { handleError, showUserNotification };
}
