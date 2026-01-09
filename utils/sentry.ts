import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || "";

/**
 * Initialize Sentry for error tracking and performance monitoring.
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
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    // Ignore common network errors
    ignoreErrors: ["Network request failed", "TypeError: Network request failed"],
  });
}

/**
 * Capture an exception manually.
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  if (context) {
    Sentry.setContext("additional", context);
  }
  Sentry.captureException(error);
}

/**
 * Capture a message manually.
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = "info"): void {
  Sentry.captureMessage(message, level);
}

export { Sentry };
