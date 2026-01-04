import { getVersionInfo, getVersionDisplay, getDetailedVersionInfo } from "../VersionInfo";

// expo-constants をモック
jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: {
      version: "0.1.1",
    },
  },
}));

describe("VersionInfo", () => {
  describe("getVersionInfo", () => {
    it("should return version info object with required properties", () => {
      const versionInfo = getVersionInfo();

      expect(versionInfo).toHaveProperty("packageVersion");
      expect(versionInfo).toHaveProperty("buildTime");
      expect(versionInfo).toHaveProperty("environment");
    });

    it("should return a valid package version", () => {
      const versionInfo = getVersionInfo();
      // expo-constants からの取得または unknown
      expect(versionInfo.packageVersion).toMatch(/^\d+\.\d+\.\d+$|^unknown$/);
    });

    it("should return a valid ISO date string for buildTime in development", () => {
      const versionInfo = getVersionInfo();
      // 開発環境では ISO 文字列、本番環境では BUILD_TIME_NOT_SET の可能性もある
      if (versionInfo.buildTime !== "BUILD_TIME_NOT_SET") {
        const date = new Date(versionInfo.buildTime);
        expect(date.getTime()).toBeGreaterThan(0);
      } else {
        expect(versionInfo.buildTime).toBe("BUILD_TIME_NOT_SET");
      }
    });

    it("should have a valid environment", () => {
      const versionInfo = getVersionInfo();
      expect(["development", "production", "unknown"]).toContain(versionInfo.environment);
    });
  });

  describe("getVersionDisplay", () => {
    it("should return a short version string", () => {
      const display = getVersionDisplay();
      // バージョン形式または vunknown
      expect(display).toMatch(/^v\d+\.\d+\.\d+$|^vunknown$/);
    });
  });

  describe("getDetailedVersionInfo", () => {
    it("should return a detailed version string", () => {
      const detailed = getDetailedVersionInfo();
      expect(detailed).toContain("v");
      expect(detailed).toBeTruthy();
    });
  });
});
