/**
 * Deterministic hash utility — replaces Math.random() everywhere.
 * Given a seed string, returns a stable number in a range.
 * Uses DJB2 hash for simplicity and speed.
 */

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Returns a deterministic integer in [min, max] (inclusive) for a given seed.
 */
export function deterministicValue(seed: string, min: number, max: number): number {
  const hash = djb2(seed);
  return min + (hash % (max - min + 1));
}

/**
 * Returns a deterministic float in [min, max) for a given seed, rounded to `decimals` places.
 */
export function deterministicFloat(seed: string, min: number, max: number, decimals = 1): number {
  const hash = djb2(seed);
  const normalized = (hash % 10000) / 10000; // 0..0.9999
  const value = min + normalized * (max - min);
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Returns a deterministic boolean with given probability (0-1) of being true.
 */
export function deterministicBool(seed: string, probability = 0.5): boolean {
  const hash = djb2(seed);
  return (hash % 1000) / 1000 < probability;
}

/**
 * Pick a deterministic element from an array based on seed.
 */
export function deterministicPick<T>(seed: string, items: T[]): T {
  const hash = djb2(seed);
  return items[hash % items.length];
}
