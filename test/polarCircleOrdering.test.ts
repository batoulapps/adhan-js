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

// Every prayer time must either be a real, correctly ordered clock time, or
// the whole set must be signalled as uncomputable together (an invalid
// Date on every field). A mix of good and bad times, or a silently
// out-of-order set of otherwise "valid" Dates, is never acceptable.
function isOrderedOrAllInvalid(prayerTimes: PrayerTimes) {
  const values = times(prayerTimes);
  const invalidCount = values.filter((d) => isNaN(d.getTime())).length;

  if (invalidCount > 0) {
    return invalidCount === values.length;
  }

  for (let i = 1; i < values.length; i++) {
    if (!(values[i].getTime() > values[i - 1].getTime())) {
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

    expect(isOrderedOrAllInvalid(prayerTimes)).toBe(true);
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

    expect(isOrderedOrAllInvalid(prayerTimes)).toBe(true);
    if (allValid(prayerTimes)) {
      expect(prayerTimes.asr.getTime()).toBeGreaterThan(
        prayerTimes.dhuhr.getTime(),
      );
    }
  });

  test('an unresolvable day is signalled all-or-nothing, never a mix of valid and invalid times (Tromso, 2026-01-01)', () => {
    const coordinates = new Coordinates(69.6489, 18.9553);
    const date = new Date(Date.UTC(2026, 0, 1));
    const params = CalculationMethod.MuslimWorldLeague();

    const prayerTimes = new PrayerTimes(coordinates, date, params);
    const values = times(prayerTimes);
    const invalidCount = values.filter((d) => isNaN(d.getTime())).length;

    expect(invalidCount === 0 || invalidCount === values.length).toBe(true);
  });

  test('a full 2026 sweep at Tromso produces no out-of-order times with default parameters', () => {
    const coordinates = new Coordinates(69.6489, 18.9553);
    const params = CalculationMethod.MuslimWorldLeague();

    const start = Date.UTC(2026, 0, 1);
    for (let day = 0; day < 365; day++) {
      const date = new Date(start + day * 24 * 60 * 60 * 1000);
      const prayerTimes = new PrayerTimes(coordinates, date, params);

      expect(
        isOrderedOrAllInvalid(prayerTimes),
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
        isOrderedOrAllInvalid(prayerTimes),
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
    expect(isOrderedOrAllInvalid(prayerTimes)).toBe(true);
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
});
