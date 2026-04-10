import { renderHook, act } from "@testing-library/react-native";
import { Alert, Platform, ToastAndroid } from "react-native";
import { AppError } from "../../utils/AppError";
import { useErrorHandler } from "../useErrorHandler";

const mockCaptureException = jest.fn();
const mockCaptureMessage = jest.fn();

jest.mock("../../utils/sentry", () => ({
  captureException: (...args: unknown[]) => mockCaptureException(...args),
  captureMessage: (...args: unknown[]) => mockCaptureMessage(...args),
}));

describe("useErrorHandler", () => {
  let consoleErrorSpy: jest.SpyInstance;
  let toastSpy: jest.SpyInstance;
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    toastSpy = jest.spyOn(ToastAndroid, "show").mockImplementation();
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation();
    (Platform as { OS: string }).OS = "ios";
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    toastSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it("logs error to console for any category", () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new AppError("test error", {
      category: "silent",
      severity: "warning",
      context: { source: "Test", operation: "run" },
    });

    act(() => {
      result.current.handleError(error);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Test:run"),
      "test error",
      expect.anything()
    );
  });

  it("does not send silent errors to Sentry", () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new AppError("silent", {
      category: "silent",
      severity: "warning",
      context: { source: "Test", operation: "run" },
    });

    act(() => {
      result.current.handleError(error);
    });

    expect(mockCaptureException).not.toHaveBeenCalled();
    expect(mockCaptureMessage).not.toHaveBeenCalled();
  });

  it("sends userVisible errors with Error cause via captureException", () => {
    const { result } = renderHook(() => useErrorHandler());
    const cause = new Error("cause");
    const error = new AppError("visible", {
      category: "userVisible",
      severity: "error",
      context: { source: "Test", operation: "run" },
      cause,
    });

    act(() => {
      result.current.handleError(error);
    });

    expect(mockCaptureException).toHaveBeenCalledWith(
      cause,
      expect.objectContaining({
        source: "Test",
        operation: "run",
      })
    );
  });

  it("sends recoverable errors without Error cause via captureMessage", () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new AppError("recover", {
      category: "recoverable",
      severity: "warning",
      context: { source: "Test", operation: "run" },
    });

    act(() => {
      result.current.handleError(error);
    });

    expect(mockCaptureMessage).toHaveBeenCalledWith("recover", "warning");
  });

  it("shows user notification for userVisible errors on iOS via Alert", () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new AppError("show me", {
      category: "userVisible",
      severity: "error",
      context: { source: "Test", operation: "run" },
    });

    act(() => {
      result.current.handleError(error);
    });

    expect(alertSpy).toHaveBeenCalledWith("お知らせ", "show me");
  });

  it("shows user notification on Android via ToastAndroid", () => {
    (Platform as { OS: string }).OS = "android";
    const { result } = renderHook(() => useErrorHandler());
    const error = new AppError("android msg", {
      category: "userVisible",
      severity: "error",
      context: { source: "Test", operation: "run" },
    });

    act(() => {
      result.current.handleError(error);
    });

    expect(toastSpy).toHaveBeenCalledWith("android msg", ToastAndroid.SHORT);
  });

  it("suppresses notification for silent errors even with Error cause", () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new AppError("silent", {
      category: "silent",
      severity: "error",
      context: { source: "Test", operation: "run" },
      cause: new Error("cause"),
    });

    act(() => {
      result.current.handleError(error);
    });

    expect(alertSpy).not.toHaveBeenCalled();
    expect(toastSpy).not.toHaveBeenCalled();
  });

  it("shows user notification when userMessage is explicitly provided", () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new AppError("internal", {
      category: "silent",
      severity: "warning",
      context: { source: "Test", operation: "run" },
    });

    act(() => {
      result.current.handleError(error, { userMessage: "ユーザー向けメッセージ" });
    });

    expect(alertSpy).toHaveBeenCalledWith("お知らせ", "ユーザー向けメッセージ");
  });

  it("wraps plain Error with fallback context", () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError(new Error("plain"), {
        fallbackContext: { source: "Fallback", operation: "wrap" },
      });
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Fallback:wrap"),
      "plain",
      expect.anything()
    );
  });
});
