import { Platform, Share } from "react-native";
import { captureRef } from "react-native-view-shot";
import { executeShare } from "../shareUtils";

describe("executeShare", () => {
  let consoleErrorSpy: jest.SpyInstance;
  let shareSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    shareSpy = jest.spyOn(Share, "share").mockResolvedValue({ action: "sharedAction" });
    (Platform as { OS: string }).OS = "ios";
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    shareSpy.mockRestore();
  });

  describe("native (iOS/Android)", () => {
    it("iOS: calls captureRef and Share.share with url when capture succeeds", async () => {
      (captureRef as jest.Mock).mockResolvedValueOnce("file:///tmp/omikuji.png");
      const cardRef = { current: {} as never };

      await executeShare({ shareText: "share text", cardRef });

      expect(captureRef).toHaveBeenCalledWith(cardRef, { format: "png", quality: 0.8 });
      expect(shareSpy).toHaveBeenCalledWith(
        { message: "share text", url: "file:///tmp/omikuji.png" },
        {}
      );
    });

    it("Android: calls Share.share with dialogTitle when shareTitle is provided", async () => {
      (Platform as { OS: string }).OS = "android";
      (captureRef as jest.Mock).mockResolvedValueOnce("file:///tmp/omikuji.png");
      const cardRef = { current: {} as never };

      await executeShare({ shareText: "share text", cardRef, shareTitle: "Share Omikuji" });

      expect(shareSpy).toHaveBeenCalledWith(
        { message: "share text" }, // url は Android では渡さない
        { dialogTitle: "Share Omikuji" }
      );
    });

    it("falls back to text-only share when captureRef fails", async () => {
      (captureRef as jest.Mock).mockRejectedValueOnce(new Error("capture failed"));
      const cardRef = { current: {} as never };

      await executeShare({ shareText: "share text", cardRef });

      expect(consoleErrorSpy).toHaveBeenCalledWith("Image capture failed", expect.any(Error));
      expect(shareSpy).toHaveBeenCalledWith({ message: "share text" }, {});
    });

    it("skips captureRef when cardRef.current is null", async () => {
      const cardRef = { current: null };

      await executeShare({ shareText: "share text", cardRef });

      expect(captureRef).not.toHaveBeenCalled();
      expect(shareSpy).toHaveBeenCalledWith({ message: "share text" }, {});
    });

    it("logs error and swallows exception if Share.share throws", async () => {
      shareSpy.mockRejectedValueOnce(new Error("share failed"));
      (captureRef as jest.Mock).mockResolvedValueOnce("file:///tmp/omikuji.png");
      const cardRef = { current: {} as never };

      await expect(executeShare({ shareText: "share text", cardRef })).resolves.toBeUndefined();

      expect(consoleErrorSpy).toHaveBeenCalledWith("Sharing failed", expect.any(Error));
    });
  });

  describe("web", () => {
    const originalDocument = globalThis.document;
    const originalNavigator = globalThis.navigator;
    const originalFetch = globalThis.fetch;
    const originalFile = globalThis.File;

    beforeEach(() => {
      (Platform as { OS: string }).OS = "web";
    });

    afterEach(() => {
      globalThis.document = originalDocument;
      Object.defineProperty(globalThis, "navigator", {
        value: originalNavigator,
        writable: true,
        configurable: true,
      });
      globalThis.fetch = originalFetch;
      globalThis.File = originalFile;
    });

    it("does not call Share.share on web (RN Share API is unsupported)", async () => {
      globalThis.document = {
        querySelector: jest.fn().mockReturnValue(null),
      } as unknown as Document;

      await executeShare({ shareText: "share text" });

      // Web では tryWebShare のみで完結し、Share.share にフォールバックしない
      expect(shareSpy).not.toHaveBeenCalled();
    });

    it("returns without error when document is unavailable", async () => {
      globalThis.document = undefined as unknown as Document;

      await expect(executeShare({ shareText: "share text" })).resolves.toBeUndefined();
      expect(shareSpy).not.toHaveBeenCalled();
    });
  });
});
