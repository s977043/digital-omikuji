import { buildShareText } from "../buildShareText";

describe("buildShareText", () => {
  it("generates correct share text", () => {
    const text = buildShareText({
      title: "大吉",
      description: "最高の運気です",
    });

    expect(text).toContain("2026年のエンジニア運勢は");
    expect(text).toContain("『大吉』");
    expect(text).toContain("最高の運気です");
    expect(text).toContain("#エンジニアおみくじ2026");
    expect(text).toContain("#令和八年");
    expect(text).toContain("あなたも占ってみよう👇");
    expect(text).toContain(
      "https://digital-omikuji.vercel.app?utm_source=share&utm_campaign=omikuji2026"
    );
  });

  it("handles different fortune titles", () => {
    const text = buildShareText({
      title: "凶",
      description: "注意が必要です",
    });
    expect(text).toContain("『凶』");
  });
});
