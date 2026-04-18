const mockInit = jest.fn();
const mockCaptureException = jest.fn();
const mockCaptureMessage = jest.fn();
const mockSetContext = jest.fn();
const mockAddBreadcrumb = jest.fn();
const mockScopeSetContext = jest.fn();
const mockScopeSetLevel = jest.fn();
const mockWithScope = jest.fn((cb: (scope: unknown) => void) =>
  cb({
    setContext: mockScopeSetContext,
    setLevel: mockScopeSetLevel,
    setTag: jest.fn(),
    setExtra: jest.fn(),
  })
);

jest.mock("@sentry/react-native", () => ({
  init: mockInit,
  captureException: mockCaptureException,
  captureMessage: mockCaptureMessage,
  setContext: mockSetContext,
  addBreadcrumb: mockAddBreadcrumb,
  withScope: mockWithScope,
}));

jest.mock("expo-constants", () => ({
  expoConfig: {
    version: "1.1.0",
    extra: { appVariant: "development" },
  },
}));

describe("sentry", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("warns and skips init when DSN is not configured", () => {
    process.env.EXPO_PUBLIC_SENTRY_DSN = "";
    const warnSpy = jest.spyOn(console, "warn").mockImplementation();

    const { initializeSentry } = require("../sentry");
    initializeSentry();

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Sentry DSN not configured"));
    expect(mockInit).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it("initializes Sentry with correct config when DSN is set", () => {
    process.env.EXPO_PUBLIC_SENTRY_DSN = "https://test@sentry.io/123";

    const { initializeSentry } = require("../sentry");
    initializeSentry();

    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: "https://test@sentry.io/123",
        environment: "development",
        release: "digital-omikuji@1.1.0",
      })
    );
  });

  it("captureException sends error to Sentry through a scoped callback", () => {
    process.env.EXPO_PUBLIC_SENTRY_DSN = "";
    const { captureException } = require("../sentry");
    const error = new Error("test error");

    captureException(error);

    expect(mockWithScope).toHaveBeenCalledTimes(1);
    expect(mockCaptureException).toHaveBeenCalledWith(error);
    // No context provided, so scope.setContext is untouched
    expect(mockScopeSetContext).not.toHaveBeenCalled();
    // Global setContext must not be used — it pollutes concurrent events
    expect(mockSetContext).not.toHaveBeenCalled();
  });

  it("captureException sets scope context when provided (isolated per event)", () => {
    process.env.EXPO_PUBLIC_SENTRY_DSN = "";
    const { captureException } = require("../sentry");
    const error = new Error("test error");
    const context = { userId: "123" };

    captureException(error, context);

    expect(mockWithScope).toHaveBeenCalledTimes(1);
    expect(mockScopeSetContext).toHaveBeenCalledWith("additional", context);
    expect(mockCaptureException).toHaveBeenCalledWith(error);
    expect(mockSetContext).not.toHaveBeenCalled();
  });

  it("addBreadcrumb forwards to Sentry.addBreadcrumb", () => {
    process.env.EXPO_PUBLIC_SENTRY_DSN = "";
    const { addBreadcrumb } = require("../sentry");

    addBreadcrumb({ category: "test", message: "hello", data: { foo: 1 } });

    expect(mockAddBreadcrumb).toHaveBeenCalledWith({
      category: "test",
      message: "hello",
      data: { foo: 1 },
    });
  });

  it("captureMessage sends message to Sentry", () => {
    process.env.EXPO_PUBLIC_SENTRY_DSN = "";
    const { captureMessage } = require("../sentry");

    captureMessage("test message", "warning");

    expect(mockCaptureMessage).toHaveBeenCalledWith("test message", "warning");
  });

  it("captureMessage defaults to info level", () => {
    process.env.EXPO_PUBLIC_SENTRY_DSN = "";
    const { captureMessage } = require("../sentry");

    captureMessage("info message");

    expect(mockCaptureMessage).toHaveBeenCalledWith("info message", "info");
  });
});
