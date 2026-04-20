import * as Sentry from "@sentry/react-native";
import { AppError } from "../AppError";
import { reportSilentError } from "../errorReporter";

describe("reportSilentError", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("logs to console with the provided message", () => {
    const error = new Error("boom");
    reportSilentError("something failed:", error, {
      source: "TestSource",
      operation: "testOp",
    });

    expect(consoleSpy).toHaveBeenCalledWith("something failed:", error);
  });

  it("captures the original Error through Sentry.withScope with scoped context", () => {
    const error = new Error("boom");
    reportSilentError("something failed:", error, {
      source: "TestSource",
      operation: "testOp",
      metadata: { key: "v" },
    });

    expect(Sentry.withScope).toHaveBeenCalledTimes(1);
    expect(Sentry.captureException).toHaveBeenCalledWith(error);

    // Scope mutators come from our withScope mock in jest.setup.js — inspect call args
    const [cb] = (Sentry.withScope as jest.Mock).mock.calls[0];
    const scope = {
      setContext: jest.fn(),
      setLevel: jest.fn(),
      setTag: jest.fn(),
      setExtra: jest.fn(),
    };
    cb(scope);
    expect(scope.setContext).toHaveBeenCalledWith(
      "app",
      expect.objectContaining({
        source: "TestSource",
        operation: "testOp",
        category: "silent",
        key: "v",
      })
    );
    expect(scope.setLevel).toHaveBeenCalledWith("error");
  });

  it("unwraps an AppError and forwards its underlying cause", () => {
    const cause = new Error("root cause");
    const appError = new AppError("wrapped", {
      category: "recoverable",
      severity: "warning",
      context: { source: "Inner", operation: "op" },
      cause,
    });

    reportSilentError("nested failure:", appError, {
      source: "Outer",
      operation: "outerOp",
    });

    // AppError branch: should forward the underlying cause (an Error)
    expect(Sentry.captureException).toHaveBeenCalledWith(cause);
  });

  it("honors explicit category and severity overrides", () => {
    reportSilentError("warn-level failure:", new Error("x"), {
      source: "X",
      operation: "y",
      category: "recoverable",
      severity: "warning",
    });

    const [cb] = (Sentry.withScope as jest.Mock).mock.calls[0];
    const scope = {
      setContext: jest.fn(),
      setLevel: jest.fn(),
      setTag: jest.fn(),
      setExtra: jest.fn(),
    };
    cb(scope);
    expect(scope.setLevel).toHaveBeenCalledWith("warning");
    expect(scope.setContext).toHaveBeenCalledWith(
      "app",
      expect.objectContaining({ category: "recoverable" })
    );
  });
});
