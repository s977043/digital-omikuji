import { getComponentTokens, getStringToken, getTokenByPath } from "../../design-system";

const componentMap = require("../../docs/design-system/component-map.json") as {
  designName: string;
  implementationName: string;
  tokens: string[];
  variants: string[];
  slots: string[];
  status: string;
}[];

describe("design system contracts", () => {
  it("semantic token alias を解決できる", () => {
    expect(getStringToken("semantic.surface.experience.canvas")).toBe("#08111F");
    expect(getStringToken("semantic.fortune.level.daikichi")).toBe("#FFD700");
  });

  it("component token をオブジェクトとして解決できる", () => {
    const buttonTokens = getComponentTokens<{
      backgroundColor: string;
      borderColor: string;
      textColor: string;
      minHeight: number;
    }>("button.primaryRitual");

    expect(buttonTokens.backgroundColor).toBe("#DC2626");
    expect(buttonTokens.borderColor).toBe("#FCD34D");
    expect(buttonTokens.textColor).toBe("#FFFFFF");
    expect(buttonTokens.minHeight).toBe(56);
  });

  it("component-map の token 参照先がすべて存在する", () => {
    for (const entry of componentMap) {
      expect(entry.designName).toBeTruthy();
      expect(entry.implementationName).toBeTruthy();
      expect(Array.isArray(entry.tokens)).toBe(true);
      expect(Array.isArray(entry.variants)).toBe(true);
      expect(Array.isArray(entry.slots)).toBe(true);
      expect(entry.status).toBe("active");

      for (const tokenPath of entry.tokens) {
        expect(() => getTokenByPath(tokenPath)).not.toThrow();
      }
    }
  });
});
