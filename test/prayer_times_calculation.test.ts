import Coordinates from '../src/Coordinates.js';
import CalculationMethod from '../src/CalculationMethod.js';
import {
  computePrayerTimesForDay,
  shiftPrayerTimesByDays,
  PrayerTimesResult,
} from '../src/PrayerTimesCalculation.js';
import { describe, it, expect } from 'vitest';

describe('computePrayerTimesForDay', () => {
  const params = CalculationMethod.MuslimWorldLeague();
  // Not resolution-aware: this function never looks at polarCircleResolution.
  const raleigh = new Coordinates(35.7897507, -78.6912485);

  it('returns a valid result with exactly the expected fields for a normal location', () => {
    const result = computePrayerTimesForDay(
      raleigh,
      new Date(2026, 0, 1),
      params,
    );

    expect(result.isValid).toBe(true);
    expect(Object.keys(result).sort()).toEqual(
      [
        'asr',
        'dhuhr',
        'fajr',
        'isValid',
        'isha',
        'maghrib',
        'sunrise',
        'sunset',
      ].sort(),
    );
  });

  it('returns exactly { isValid: false } with no other fields when times cannot be computed', () => {
    // Arjeplog, Sweden during midnight sun: no resolver configured, so this
    // stays unresolved and must fail.
    const arjeplog = new Coordinates(66.7222444, 17.7189);
    const result = computePrayerTimesForDay(
      arjeplog,
      new Date(2020, 5, 21),
      params,
    );

    expect(result.isValid).toBe(false);
    expect(Object.keys(result)).toEqual(['isValid']);
  });
});

describe('shiftPrayerTimesByDays', () => {
  const makeValidResult = (date: Date): PrayerTimesResult => ({
    isValid: true,
    fajr: date,
    sunrise: date,
    dhuhr: date,
    asr: date,
    sunset: date,
    maghrib: date,
    isha: date,
  });

  it('returns the same reference when shifting by 0 days', () => {
    const result = makeValidResult(new Date(Date.UTC(2026, 0, 1, 5, 0, 0)));
    expect(shiftPrayerTimesByDays(result, 0)).toBe(result);
  });

  it('returns the same reference for an invalid result regardless of the shift', () => {
    const result: PrayerTimesResult = { isValid: false };
    expect(shiftPrayerTimesByDays(result, 5)).toBe(result);
    expect(shiftPrayerTimesByDays(result, -5)).toBe(result);
  });

  it('shifts every field forward by exactly N days', () => {
    const start = Date.UTC(2026, 0, 1, 5, 30, 15);
    const result = makeValidResult(new Date(start));

    const shifted = shiftPrayerTimesByDays(result, 3);

    expect(shifted.isValid).toBe(true);
    if (shifted.isValid) {
      expect(shifted.fajr.getTime()).toBe(start + 3 * 86400 * 1000);
      expect(shifted.isha.getTime()).toBe(start + 3 * 86400 * 1000);
    }
  });

  it('shifts every field backward by exactly N days', () => {
    const start = Date.UTC(2026, 6, 25, 22, 0, 0);
    const result = makeValidResult(new Date(start));

    const shifted = shiftPrayerTimesByDays(result, -34);

    expect(shifted.isValid).toBe(true);
    if (shifted.isValid) {
      expect(shifted.dhuhr.getTime()).toBe(start - 34 * 86400 * 1000);
    }
  });

  it('shifts by an exact number of days across a DST transition, with no hour drift', () => {
    // 2026-03-08 is when America/New_York springs forward (2:00 AM local ->
    // 3:00 AM local). Running under a DST-observing local timezone here is
    // deliberate: shiftPrayerTimesByDays must add exact UTC days regardless
    // of local time, and a buggy implementation using local Date arithmetic
    // (e.g. dateByAddingDays) would drift by an hour across this boundary.
    const originalTZ = process.env.TZ;
    process.env.TZ = 'America/New_York';
    try {
      const start = Date.UTC(2026, 2, 7, 12, 0, 0); // March 7, 2026 12:00 UTC
      const result = makeValidResult(new Date(start));

      const shifted = shiftPrayerTimesByDays(result, 1);

      expect(shifted.isValid).toBe(true);
      if (shifted.isValid) {
        expect(shifted.fajr.getTime()).toBe(Date.UTC(2026, 2, 8, 12, 0, 0));
      }
    } finally {
      process.env.TZ = originalTZ;
    }
  });
});
