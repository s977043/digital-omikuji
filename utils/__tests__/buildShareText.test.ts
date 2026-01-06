import { buildShareText } from "../buildShareText";

describe("buildShareText", () => {
  it("generates correct share text", () => {
    const text = buildShareText({
      level: "daikichi",
      title: "大吉",
      description: "Awesome description",
    });

    expect(text).toContain("2026年のエンジニア運勢は");
    expect(text).toContain("『大吉』");
    expect(text).toContain("#エンジニアおみくじ2026");
    expect(text).toContain("#令和八年");
    expect(text).toContain("あなたも占ってみよう👇");
    expect(text).toContain(
      "https://digital-omikuji.vercel.app?utm_source=share&utm_campaign=omikuji2026"
    );
  });

  it("handles different fortune titles", () => {
    const text = buildShareText({
      level: "kyo",
      title: "凶",
      description: "Bad luck",
    });
    expect(text).toContain("『凶』");
  });
});
