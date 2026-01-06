import { buildShareText } from "../buildShareText";
import { OmikujiResult } from "../../types/omikuji";

describe("buildShareText", () => {
  const mockFortune: OmikujiResult = {
    id: "test",
    level: "daikichi",
    fortuneParams: {
      title: "大吉",
      description: "Awesome description",
    },
    image: { uri: "test" },
    color: "#000",
    createdAt: 1234567890,
  };

  it("generates correct share text", () => {
    const text = buildShareText(mockFortune);

    expect(text).toContain("2026年のエンジニア運勢は");
    expect(text).toContain("『大吉』");
    expect(text).toContain("#エンジニアおみくじ2026");
    expect(text).toContain("#令和七年");
    expect(text).toContain("あなたも占ってみよう👇");
    expect(text).toContain(
      "https://digital-omikuji.vercel.app?utm_source=share&utm_campaign=omikuji2026"
    );
  });

  it("handles different fortune titles", () => {
    const kyoFortune = {
      ...mockFortune,
      fortuneParams: { title: "凶", description: "Bad luck" },
    };
    const text = buildShareText(kyoFortune as OmikujiResult);
    expect(text).toContain("『凶』");
  });
});
