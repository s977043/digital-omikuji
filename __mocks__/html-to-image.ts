// Jest manual mock for html-to-image.
// shareUtils は `await import("html-to-image")` で動的ロードしているが、
// Jest の通常変換では dynamic import が ESM として処理されてしまい
// 「A dynamic import callback was invoked without --experimental-vm-modules」
// が発生するため、ルート __mocks__ 配下の manual mock で常時差し替える。

export const toPng = jest.fn();

export default { toPng };
