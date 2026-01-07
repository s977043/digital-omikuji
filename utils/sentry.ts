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
        // Set environment based on app variant
        environment: appVariant,
        // Set release version for tracking
        release: `digital-omikuji@${appVersion}`,
        // Enable performance monitoring (free tier: 10,000 transactions/month)
        tracesSampleRate: appVariant === "production" ? 0.2 : 1.0, // 20% in production, 100% in dev
        // Attach user session replays (optional, can be disabled for privacy)
        attachScreenshot: true,
        // Don't send events in development by default
        enabled: appVariant !== "development" || !!SENTRY_DSN,
        // Ignore certain errors
        ignoreErrors: [
            // Network errors that are expected
            "Network request failed",
            "TypeError: Network request failed",
        ],
        // Before sending event, you can modify or filter
        beforeSend(event) {
            // Add custom tags
            event.tags = {
                ...event.tags,
                appVariant,
            };
            return event;
        },
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

/**
 * Set user context for error tracking.
 */
export function setUser(user: { id?: string; email?: string; username?: string } | null): void {
    Sentry.setUser(user);
}

/**
 * Add breadcrumb for debugging.
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
    Sentry.addBreadcrumb(breadcrumb);
}

export { Sentry };
