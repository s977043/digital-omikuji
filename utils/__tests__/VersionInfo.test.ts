import { getVersionInfo, getVersionDisplay, getDetailedVersionInfo } from '../VersionInfo';

describe('VersionInfo', () => {
  describe('getVersionInfo', () => {
    it('should return version info object with required properties', () => {
      const versionInfo = getVersionInfo();

      expect(versionInfo).toHaveProperty('packageVersion');
      expect(versionInfo).toHaveProperty('buildTime');
      expect(versionInfo).toHaveProperty('environment');
    });

    it('should return a valid package version', () => {
      const versionInfo = getVersionInfo();
      expect(versionInfo.packageVersion).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should return a valid ISO date string for buildTime', () => {
      const versionInfo = getVersionInfo();
      const date = new Date(versionInfo.buildTime);
      expect(date.getTime()).toBeGreaterThan(0);
    });

    it('should have a valid environment', () => {
      const versionInfo = getVersionInfo();
      expect(['development', 'production', 'unknown']).toContain(versionInfo.environment);
    });
  });

  describe('getVersionDisplay', () => {
    it('should return a short version string', () => {
      const display = getVersionDisplay();
      expect(display).toMatch(/^v\d+\.\d+\.\d+$/);
    });
  });

  describe('getDetailedVersionInfo', () => {
    it('should return a detailed version string', () => {
      const detailed = getDetailedVersionInfo();
      expect(detailed).toContain('v');
      expect(detailed).toBeTruthy();
    });
  });
});
