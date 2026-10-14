import CalculationMethod from '../src/CalculationMethod.js';
import Coordinates from '../src/Coordinates.js';
import HighLatitudeRule from '../src/HighLatitudeRule.js';
import PrayerTimes from '../src/PrayerTimes.js';
import SolarTime from '../src/SolarTime.js';
import { describe, expect, test } from 'vitest';

const PRAYER_ORDER = [
  'fajr',
  'sunrise',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
] as const;

function times(prayerTimes: PrayerTimes) {
  return PRAYER_ORDER.map((prayer) => prayerTimes[prayer]);
}

const MIN_GAP_MS = 5 * 60 * 1000;

// adhan-js legitimately returns a mix of valid and invalid (NaN) prayer
// times during polar day/night (e.g. sunrise/maghrib are NaN when the sun
// never rises or sets, while fajr/dhuhr/asr/isha remain valid) — that is
// existing, relied-upon behaviour, not the bug under test. The invariant we
// actually want: among the CONSECUTIVE prayer times that are valid, every
// pair must be increasing and at least five minutes apart (matching the
// Kotlin port's `timesInOrder`), skipping any pair where either side is
// invalid rather than failing on it.
function isOrderedAmongValidTimes(prayerTimes: PrayerTimes) {
  const values = times(prayerTimes);

  for (let i = 1; i < values.length; i++) {
    const a = values[i - 1];
    const b = values[i];
    if (isNaN(a.getTime()) || isNaN(b.getTime())) {
      continue;
    }
    if (!(b.getTime() - a.getTime() >= MIN_GAP_MS)) {
      return false;
    }
  }
  return true;
}

function allValid(prayerTimes: PrayerTimes) {
  return times(prayerTimes).every((d) => !isNaN(d.getTime()));
}

describe('prayer time ordering near the polar circle', () => {
  test('asr does not land two days late and after isha at -72,0 on 2000-08-01', () => {
    const coordinates = new Coordinates(-72, 0);
    const date = new Date(Date.UTC(2000, 7, 1));
    const params = CalculationMethod.MuslimWorldLeague();

    const prayerTimes = new PrayerTimes(coordinates, date, params);

    expect(isOrderedAmongValidTimes(prayerTimes)).toBe(true);
    if (allValid(prayerTimes)) {
      expect(prayerTimes.asr.getTime()).toBeLessThan(
        prayerTimes.isha.getTime(),
      );
      expect(prayerTimes.asr.getTime()).toBeGreaterThan(
        prayerTimes.dhuhr.getTime(),
      );
    }
  });

  test('asr does not land 7.7 hours before dhuhr at -75,0 on 2029-05-01', () => {
    const coordinates = new Coordinates(-75, 0);
    const date = new Date(Date.UTC(2029, 4, 1));
    const params = CalculationMethod.MuslimWorldLeague();

    const prayerTimes = new PrayerTimes(coordinates, date, params);

    expect(isOrderedAmongValidTimes(prayerTimes)).toBe(true);
    if (allValid(prayerTimes)) {
      expect(prayerTimes.asr.getTime()).toBeGreaterThan(
        prayerTimes.dhuhr.getTime(),
      );
    }
  });

  test('a full 2026 sweep at Tromso produces no out-of-order times with default parameters', () => {
    const coordinates = new Coordinates(69.6489, 18.9553);
    const params = CalculationMethod.MuslimWorldLeague();

    const start = Date.UTC(2026, 0, 1);
    for (let day = 0; day < 365; day++) {
      const date = new Date(start + day * 24 * 60 * 60 * 1000);
      const prayerTimes = new PrayerTimes(coordinates, date, params);

      expect(
        isOrderedAmongValidTimes(prayerTimes),
        `day offset ${day} (${date.toISOString().slice(0, 10)}) produced out-of-order prayer times`,
      ).toBe(true);
    }
  });

  test('a full 2026 sweep at Tromso produces no out-of-order times with HighLatitudeRule.TwilightAngle', () => {
    const coordinates = new Coordinates(69.6489, 18.9553);
    const params = CalculationMethod.MuslimWorldLeague();
    params.highLatitudeRule = HighLatitudeRule.TwilightAngle;

    const start = Date.UTC(2026, 0, 1);
    for (let day = 0; day < 365; day++) {
      const date = new Date(start + day * 24 * 60 * 60 * 1000);
      const prayerTimes = new PrayerTimes(coordinates, date, params);

      expect(
        isOrderedAmongValidTimes(prayerTimes),
        `day offset ${day} (${date.toISOString().slice(0, 10)}) produced out-of-order prayer times`,
      ).toBe(true);
    }
  });

  test('temperate latitudes keep producing fully valid, correctly ordered times (Ankara, Turkey method, 2019-01-01)', () => {
    const coordinates = new Coordinates(39.939382, 32.819713);
    const date = new Date(Date.UTC(2019, 0, 1));
    const params = CalculationMethod.Turkey();

    const prayerTimes = new PrayerTimes(coordinates, date, params);

    expect(allValid(prayerTimes)).toBe(true);
    expect(isOrderedAmongValidTimes(prayerTimes)).toBe(true);
  });
});

describe('SolarTime.afternoon guards', () => {
  test('is NaN rather than a bogus far-future time when the corrected hour angle runs away (-72,0 on 2000-08-01)', () => {
    const coordinates = new Coordinates(-72, 0);
    const date = new Date(Date.UTC(2000, 7, 1));
    const solarTime = new SolarTime(date, coordinates);

    expect(isNaN(solarTime.afternoon(1))).toBe(true);
  });

  test('is NaN rather than a time before solar transit when the max altitude never reaches the requested angle (-75,0 on 2029-05-01)', () => {
    const coordinates = new Coordinates(-75, 0);
    const date = new Date(Date.UTC(2029, 4, 1));
    const solarTime = new SolarTime(date, coordinates);

    const afternoon = solarTime.afternoon(1);
    expect(isNaN(afternoon) || afternoon > solarTime.transit).toBe(true);
  });

  test('is NaN for an impossible shadow angle at an ordinary latitude (Ankara, shadow length 1000)', () => {
    const coordinates = new Coordinates(39.939382, 32.819713);
    const date = new Date(Date.UTC(2019, 0, 1));
    const solarTime = new SolarTime(date, coordinates);

    expect(isNaN(solarTime.afternoon(1000))).toBe(true);
  });

  test('remains a finite, valid time for an ordinary shadow length at an ordinary latitude (Ankara, Shafi)', () => {
    const coordinates = new Coordinates(39.939382, 32.819713);
    const date = new Date(Date.UTC(2019, 0, 1));
    const solarTime = new SolarTime(date, coordinates);

    expect(isNaN(solarTime.afternoon(1))).toBe(false);
  });

  // Exercises the after-transit guard specifically: the requested shadow
  // angle is well clear of the angular-diameter cutoff (32/60 degrees,
  // margin ~3.2 degrees) and the day's maximum solar altitude comfortably
  // reaches it (margin ~0.11 degrees), so neither of the other two guards
  // is what makes this NaN — only the corrected hour angle (~12.041)
  // falling before solar transit (~12.153) does.
  test('is NaN when the corrected hour angle falls before solar transit despite a reachable altitude (lat -89, shadow length 0.5, 2026-03-14)', () => {
    const coordinates = new Coordinates(-89, 0);
    const date = new Date(Date.UTC(2026, 2, 14));
    const solarTime = new SolarTime(date, coordinates);

    expect(isNaN(solarTime.afternoon(0.5))).toBe(true);
  });
});
