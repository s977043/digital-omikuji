import { Sentry } from "./sentry";
import { AppError, ErrorCategory, ErrorSeverity, isAppError, wrapError } from "./AppError";

interface ReportOptions {
  source: string;
  operation: string;
  category?: ErrorCategory;
  severity?: ErrorSeverity;
  metadata?: Record<string, unknown>;
}

/**
 * Report a silent failure: log to console for local visibility and forward to
 * Sentry with a scoped context. Intended for non-user-visible failures such as
 * sound playback, share fallback, or storage read errors.
 *
 * The existing `console.error(logMessage, error)` format is preserved so tests
 * that assert on specific log messages continue to pass.
 */
export function reportSilentError(
  logMessage: string,
  error: unknown,
  options: ReportOptions
): void {
  console.error(logMessage, error);

  const appError: AppError = isAppError(error)
    ? error
    : wrapError(error, {
        category: options.category ?? "silent",
        severity: options.severity ?? "error",
        context: {
          source: options.source,
          operation: options.operation,
          metadata: options.metadata,
        },
      });

  Sentry.withScope((scope) => {
    scope.setContext("app", {
      source: appError.context.source,
      operation: appError.context.operation,
      category: appError.category,
      ...(appError.context.metadata ?? {}),
    });
    scope.setLevel(appError.severity);
    const reportable = appError.cause instanceof Error ? appError.cause : appError;
    Sentry.captureException(reportable);
  });
}
