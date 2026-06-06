// Jest manual mock for html-to-image.
// shareUtils は `await import("html-to-image")` で動的ロードしているが、
// Jest の通常変換では dynamic import が ESM として処理されてしまい
// 「A dynamic import callback was invoked without --experimental-vm-modules」
// が発生するため、ルート __mocks__ 配下の manual mock で常時差し替える。

// デフォルトでダミーの data URL を解決する。これにより、internal.captureWebImage を
// スパイせず tryWebShare を直接通す統合テストでも、後続の fetch(dataUrl) が
// fetch(undefined) にならず安定する（1x1 透明 PNG）。
export const toPng = jest
  .fn()
  .mockResolvedValue(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
  );

export default { toPng };
