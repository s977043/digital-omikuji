import { AppError, isAppError, wrapError } from "../AppError";

describe("AppError", () => {
  const defaultContext = {
    source: "TestModule",
    operation: "testOperation",
  };

  it("creates an AppError with all required fields", () => {
    const error = new AppError("test message", {
      category: "userVisible",
      severity: "error",
      context: defaultContext,
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("AppError");
    expect(error.message).toBe("test message");
    expect(error.category).toBe("userVisible");
    expect(error.severity).toBe("error");
    expect(error.context).toEqual(defaultContext);
  });

  it("preserves cause when provided", () => {
    const cause = new Error("original error");
    const error = new AppError("wrapped", {
      category: "silent",
      severity: "warning",
      context: defaultContext,
      cause,
    });

    expect(error.cause).toBe(cause);
  });
});

describe("isAppError", () => {
  it("returns true for AppError instances", () => {
    const error = new AppError("test", {
      category: "silent",
      severity: "info",
      context: { source: "x", operation: "y" },
    });
    expect(isAppError(error)).toBe(true);
  });

  it("returns false for plain Error", () => {
    expect(isAppError(new Error("plain"))).toBe(false);
  });

  it("returns false for non-error values", () => {
    expect(isAppError("string")).toBe(false);
    expect(isAppError(null)).toBe(false);
    expect(isAppError(undefined)).toBe(false);
    expect(isAppError({ message: "fake" })).toBe(false);
  });
});

describe("wrapError", () => {
  const context = { source: "TestModule", operation: "wrap" };

  it("returns the same instance if already AppError", () => {
    const original = new AppError("original", {
      category: "silent",
      severity: "info",
      context,
    });
    const wrapped = wrapError(original, { context });
    expect(wrapped).toBe(original);
  });

  it("wraps a regular Error into AppError with cause", () => {
    const original = new Error("regular error");
    const wrapped = wrapError(original, { context });

    expect(isAppError(wrapped)).toBe(true);
    expect(wrapped.message).toBe("regular error");
    expect(wrapped.cause).toBe(original);
    expect(wrapped.category).toBe("silent");
    expect(wrapped.severity).toBe("error");
  });

  it("uses fallback message for non-Error values", () => {
    const wrapped = wrapError("string error", { context });
    expect(wrapped.message).toBe("An unexpected error occurred");
    expect(wrapped.cause).toBe("string error");
  });

  it("overrides category and severity when specified", () => {
    const wrapped = wrapError(new Error("test"), {
      context,
      category: "userVisible",
      severity: "fatal",
    });
    expect(wrapped.category).toBe("userVisible");
    expect(wrapped.severity).toBe("fatal");
  });
});
