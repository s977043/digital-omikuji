import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || "";

// This removes only these direct fields, not all potentially sensitive SDK data.
function stripDirectPersonalFields<T extends { user?: unknown; request?: unknown }>(event: T): T {
  return { ...event, user: undefined, request: undefined };
}

/**
 * Initialize Sentry for error diagnostics.
 * Call this function early in the app lifecycle (e.g., in _layout.tsx).
 */
export function initializeSentry(): void {
  if (!SENTRY_DSN) {
    console.warn(
      "Sentry DSN not configured. Error tracking is disabled. " +
        "Set EXPO_PUBLIC_SENTRY_DSN environment variable to enable."
    );
    return;
  }

  const appVersion = Constants.expoConfig?.version || "unknown";
  const appVariant = Constants.expoConfig?.extra?.appVariant || "production";

  Sentry.init({
    dsn: SENTRY_DSN,
    debug: __DEV__,
    environment: appVariant,
    release: `digital-omikuji@${appVersion}`,
    // Initial rollout is error-only; expanding telemetry requires a disclosure review.
    tracesSampleRate: 0,
    enableAutoPerformanceTracing: false,
    enableAutoSessionTracking: false,
    // Ignore common network errors
    ignoreErrors: ["Network request failed", "TypeError: Network request failed"],
    // Default PIIを無効化。全payloadやサーバー側での非収集を保証する設定ではない。
    sendDefaultPii: false,
    attachScreenshot: false,
    attachViewHierarchy: false,
    enableLogs: false,
    // console.error / console.warn のメッセージ本文には履歴 ID や運勢値が
    // 紛れ得るため、breadcrumb としての送信を抑制する。Sentry 本体の
    // captureException 経由は影響しない。
    beforeBreadcrumb: (breadcrumb) => {
      if (breadcrumb.category === "console") return null;
      return breadcrumb;
    },
    beforeSend: stripDirectPersonalFields,
    beforeSendTransaction: stripDirectPersonalFields,
  });
}

/**
 * Capture an exception manually. Uses `withScope` so concurrent events do not
 * overwrite each other's context (which was the case when using the global
 * `Sentry.setContext`).
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext("additional", context);
    }
    Sentry.captureException(error);
  });
}

/**
 * Capture a message manually.
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = "info"): void {
  Sentry.captureMessage(message, level);
}

/**
 * Add a breadcrumb that will be attached to subsequent Sentry events. Useful
 * for surfacing the path that led up to a crash without firing a full event.
 */
export function addBreadcrumb(breadcrumb: {
  category: string;
  message: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, unknown>;
}): void {
  Sentry.addBreadcrumb(breadcrumb);
}

export { Sentry };
