import { timesInOrder, MIN_PRAYER_GAP_MS } from '../src/DateUtils.js';
import { describe, it, expect } from 'vitest';

describe('timesInOrder', () => {
  const gap = MIN_PRAYER_GAP_MS;

  const t = (offsetMs: number) => new Date(1_000_000_000_000 + offsetMs);
  const invalid = new Date(NaN);

  it('returns true when b is exactly MIN_PRAYER_GAP_MS after a', () => {
    expect(timesInOrder(t(0), t(gap))).toBe(true);
  });

  it('returns true when b is more than MIN_PRAYER_GAP_MS after a', () => {
    expect(timesInOrder(t(0), t(gap + 1))).toBe(true);
  });

  it('returns false when b is less than MIN_PRAYER_GAP_MS after a', () => {
    expect(timesInOrder(t(0), t(gap - 1))).toBe(false);
  });

  it('returns false when b equals a', () => {
    expect(timesInOrder(t(0), t(0))).toBe(false);
  });

  it('returns false when b is before a', () => {
    expect(timesInOrder(t(gap), t(0))).toBe(false);
  });

  it('returns false when a is invalid', () => {
    expect(timesInOrder(invalid, t(0))).toBe(false);
  });

  it('returns false when b is invalid', () => {
    expect(timesInOrder(t(0), invalid)).toBe(false);
  });

  it('returns false when both are invalid', () => {
    expect(timesInOrder(invalid, invalid)).toBe(false);
  });
});
