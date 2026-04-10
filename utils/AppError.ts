/**
 * アプリケーション全体で使用する標準エラー型。
 * エラーの分類・重要度・発生源を統一フォーマットで扱うための型定義。
 */

/**
 * エラーの分類。
 * - silent: ユーザー通知不要。ログ・Sentry のみ。
 * - recoverable: 自動リトライ/フォールバック可能。通常はユーザー通知不要。
 * - userVisible: ユーザーに通知する必要がある。
 */
export type ErrorCategory = "silent" | "recoverable" | "userVisible";

/**
 * エラーの重要度。Sentry の SeverityLevel と整合。
 */
export type ErrorSeverity = "info" | "warning" | "error" | "fatal";

/**
 * エラー発生のコンテキスト情報。
 */
export interface AppErrorContext {
  /** エラーの発生元モジュール名（例: "HistoryStorage", "PaperResultCard"） */
  source: string;
  /** 発生した操作名（例: "loadHistory", "shareImage"） */
  operation: string;
  /** 追加のメタデータ */
  metadata?: Record<string, unknown>;
}

/**
 * アプリケーション標準エラー。
 * 通常の Error を拡張し、分類・コンテキスト情報を保持する。
 */
export class AppError extends Error {
  readonly category: ErrorCategory;
  readonly severity: ErrorSeverity;
  readonly context: AppErrorContext;
  readonly cause?: unknown;

  constructor(
    message: string,
    options: {
      category: ErrorCategory;
      severity: ErrorSeverity;
      context: AppErrorContext;
      cause?: unknown;
    }
  ) {
    super(message);
    this.name = "AppError";
    this.category = options.category;
    this.severity = options.severity;
    this.context = options.context;
    this.cause = options.cause;
  }
}

/**
 * 型ガード: 値が AppError インスタンスかを判定する。
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * 任意のエラー値を AppError にラップする。
 * 既に AppError の場合はそのまま返す。
 */
export function wrapError(
  error: unknown,
  options: {
    message?: string;
    category?: ErrorCategory;
    severity?: ErrorSeverity;
    context: AppErrorContext;
  }
): AppError {
  if (isAppError(error)) return error;

  const message =
    options.message ?? (error instanceof Error ? error.message : "An unexpected error occurred");

  return new AppError(message, {
    category: options.category ?? "silent",
    severity: options.severity ?? "error",
    context: options.context,
    cause: error,
  });
}
