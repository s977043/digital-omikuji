import { drawOmikuji } from '../omikujiLogic';
import { ACQUIRED_FORTUNES } from '../../data/omikujiData';

describe('omikujiLogic', () => {
  describe('drawOmikuji', () => {
    it('should return a valid OmikujiResult structure', () => {
      const result = drawOmikuji();

      expect(result).toHaveProperty('id');
      expect(typeof result.id).toBe('string');

      expect(result).toHaveProperty('level');
      expect(typeof result.level).toBe('string');

      expect(result).toHaveProperty('fortuneParams');
      expect(result.fortuneParams).toHaveProperty('title');
      expect(result.fortuneParams).toHaveProperty('description');

      expect(result).toHaveProperty('createdAt');
      expect(typeof result.createdAt).toBe('number');

      // Verification of details pass-through
      expect(result).toHaveProperty('details');
    });

    it('should select a fortune based on random weight', () => {
      // Mock Math.random to return 0 (Always the first item)
      jest.spyOn(Math, 'random').mockReturnValue(0);

      const firstFortune = ACQUIRED_FORTUNES[0];
      const result = drawOmikuji();

      expect(result.level).toBe(firstFortune.level);
      expect(result.fortuneParams.title).toBeDefined();

      jest.restoreAllMocks();
    });

    it('should fallback to the last fortune if random value is high (0.99)', () => {
      // Mock Math.random to return 0.999 (Likely the last item)
      jest.spyOn(Math, 'random').mockReturnValue(0.9999);

      const lastFortune = ACQUIRED_FORTUNES[ACQUIRED_FORTUNES.length - 1];
      const result = drawOmikuji();

      // Note: This assumes logic handles 0.9999 mapping to last item correctly
      expect(result.level).toBe(lastFortune.level);

      jest.restoreAllMocks();
    });
  });
});
