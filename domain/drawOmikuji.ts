import { ACQUIRED_FORTUNES, OmikujiMasterData } from "../data/omikujiData";
import { OmikujiResult } from "../types/omikuji";

const MESSAGES_PER_LEVEL = 5;

/**
 * Options for `drawOmikuji`. All fields are injectable so the function stays
 * pure and deterministic in tests.
 */
export interface DrawOmikujiOptions {
  /** Random number generator returning a value in `[0, 1)`. Defaults to `Math.random`. */
  rng?: () => number;
  /** Clock source for `createdAt`. Defaults to `Date.now`. */
  clockNow?: () => number;
  /** Identifier factory. Defaults to `globalThis.crypto.randomUUID` with a safe fallback. */
  idGenerator?: () => string;
  /** Weighted fortune table. Defaults to the shipped master data. */
  weights?: readonly OmikujiMasterData[];
}

function makeFallbackIdGenerator(rng: () => number, clockNow: () => number): () => string {
  return () => {
    const webCrypto = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
    if (webCrypto && typeof webCrypto.randomUUID === "function") {
      return webCrypto.randomUUID();
    }
    // Extremely rare: environments without Web Crypto. Fortune IDs are not security-
    // sensitive, so a time + random composite is acceptable as a last resort.
    // The composite uses the injected rng / clockNow so callers retain full determinism
    // even on the fallback path.
    return `omi-${clockNow().toString(36)}-${Math.floor(rng() * 1e9).toString(36)}`;
  };
}

/**
 * Perform a weighted lottery to select a fortune result.
 *
 * The implementation is pure: all sources of non-determinism (RNG, clock, ID
 * factory) can be injected via {@link DrawOmikujiOptions}, which makes tests
 * and future A/B experiments straightforward.
 */
export function drawOmikuji(options: DrawOmikujiOptions = {}): OmikujiResult {
  const rng = options.rng ?? Math.random;
  const clockNow = options.clockNow ?? Date.now;
  const idGenerator = options.idGenerator ?? makeFallbackIdGenerator(rng, clockNow);
  const weights = options.weights ?? ACQUIRED_FORTUNES;

  if (weights.length === 0) {
    throw new Error("drawOmikuji: weights table cannot be empty.");
  }

  const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);
  let randomValue = rng() * totalWeight;

  let selectedData = weights[weights.length - 1];
  for (const data of weights) {
    if (randomValue < data.weight) {
      selectedData = data;
      break;
    }
    randomValue -= data.weight;
  }

  const messageIndex = Math.floor(rng() * MESSAGES_PER_LEVEL);

  return {
    id: idGenerator(),
    type: "omikuji",
    level: selectedData.level,
    messageIndex,
    image: selectedData.image,
    color: selectedData.color,
    createdAt: clockNow(),
  };
}
