import { Platform, Share } from "react-native";
import { captureRef } from "react-native-view-shot";
import { executeShare, internal } from "../shareUtils";

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

    describe("web success / fallback paths", () => {
      const fakeElement = { _: "card" } as unknown as HTMLElement;

      type NavigatorLike = {
        share?: jest.Mock;
        canShare?: jest.Mock;
      };
      let navigatorMock: NavigatorLike;
      let clickSpy: jest.Mock;
      let linkEl: { download: string; href: string; click: jest.Mock };

      let captureSpy: jest.SpyInstance;

      beforeEach(() => {
        captureSpy = jest
          .spyOn(internal, "captureWebImage")
          .mockResolvedValue("data:image/png;base64,iVBORw0K");

        clickSpy = jest.fn();
        linkEl = { download: "", href: "", click: clickSpy };

        globalThis.document = {
          querySelector: jest.fn().mockReturnValue(fakeElement),
          createElement: jest.fn().mockReturnValue(linkEl),
        } as unknown as Document;

        globalThis.fetch = jest.fn().mockResolvedValue({
          blob: jest.fn().mockResolvedValue(new Blob(["x"], { type: "image/png" })),
        }) as unknown as typeof fetch;

        // File のフル実装は不要なので最低限の shim を用意する
        (globalThis as unknown as { File: unknown }).File = class {
          name: string;
          type: string;
          constructor(_parts: unknown[], name: string, opts: { type: string }) {
            this.name = name;
            this.type = opts.type;
          }
        };

        navigatorMock = {};
        Object.defineProperty(globalThis, "navigator", {
          value: navigatorMock,
          writable: true,
          configurable: true,
        });
      });

      it("calls navigator.share with files when canShare returns true", async () => {
        navigatorMock.share = jest.fn().mockResolvedValue(undefined);
        navigatorMock.canShare = jest.fn().mockReturnValue(true);

        await executeShare({ shareText: "text", shareTitle: "title" });

        expect(captureSpy).toHaveBeenCalledWith(fakeElement, undefined);
        expect(navigatorMock.share).toHaveBeenCalledWith(
          expect.objectContaining({
            files: expect.any(Array),
            title: "title",
            text: "text",
          })
        );
        expect(clickSpy).not.toHaveBeenCalled();
      });

      it("falls back to download link when canShare returns false", async () => {
        navigatorMock.share = jest.fn();
        navigatorMock.canShare = jest.fn().mockReturnValue(false);

        await executeShare({ shareText: "text" });

        expect(navigatorMock.share).not.toHaveBeenCalled();
        expect(linkEl.download).toBe("omikuji.png");
        expect(linkEl.href).toBe("data:image/png;base64,iVBORw0K");
        expect(clickSpy).toHaveBeenCalledTimes(1);
      });

      it("falls back to download link when navigator.share is unavailable", async () => {
        // navigator.share も canShare も未定義なブラウザ相当
        await executeShare({ shareText: "text" });

        expect(clickSpy).toHaveBeenCalledTimes(1);
      });

      it("swallows AbortError silently when user cancels the share dialog", async () => {
        const abortError = new DOMException("cancel", "AbortError");
        navigatorMock.share = jest.fn().mockRejectedValue(abortError);
        navigatorMock.canShare = jest.fn().mockReturnValue(true);

        await expect(executeShare({ shareText: "text" })).resolves.toBeUndefined();

        expect(navigatorMock.share).toHaveBeenCalled();
        // AbortError は正常扱いなので console.error は呼ばれない
        expect(consoleErrorSpy).not.toHaveBeenCalled();
        expect(clickSpy).not.toHaveBeenCalled();
      });

      it("logs a warning through reportSilentError when share throws non-Abort error", async () => {
        navigatorMock.share = jest.fn().mockRejectedValue(new Error("NotAllowed"));
        navigatorMock.canShare = jest.fn().mockReturnValue(true);

        await executeShare({ shareText: "text" });

        expect(consoleErrorSpy).toHaveBeenCalledWith("Web sharing failed", expect.any(Error));
      });
    });
  });
});
