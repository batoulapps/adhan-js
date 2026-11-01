import Astronomical from '../src/Astronomical.js';
import CalculationMethod from '../src/CalculationMethod.js';
import CalculationParameters from '../src/CalculationParameters.js';
import Coordinates from '../src/Coordinates.js';
import PrayerTimes from '../src/PrayerTimes.js';
import SolarTime from '../src/SolarTime.js';
import SunnahTimes from '../src/SunnahTimes.js';
import { Rounding } from '../src/Rounding.js';
import { describe, expect, it } from 'vitest';

const minutesBetween = (a: Date, b: Date) =>
  (b.getTime() - a.getTime()) / 60000;

const unroundedParams = (
  elevation?: CalculationParameters['elevationFromHorizon'],
) => {
  const params = CalculationMethod.MuslimWorldLeague();
  params.rounding = Rounding.None;
  if (elevation !== undefined) {
    params.elevationFromHorizon = elevation;
  }
  return params;
};

// Antalya, Turkey
const antalya = new Coordinates(36.3, 30.1);
const equinox = new Date(2024, 2, 20);

describe('Astronomical.elevationCorrection', () => {
  it('is zero at or below the horizon', () => {
    expect(Astronomical.elevationCorrection(0)).toBe(0);
    expect(Astronomical.elevationCorrection(-100)).toBe(0);
  });

  it('matches Odeh equation (8): 0.035333 * sqrt(h)', () => {
    for (const h of [1.5, 100, 450, 1600, 3000]) {
      expect(Astronomical.elevationCorrection(h)).toBeCloseTo(
        0.035333 * Math.sqrt(h),
        12,
      );
    }
  });

  it('is the dip plus the additional refraction', () => {
    // dip 0.02917 * sqrt(h) and refraction 0.00617 * sqrt(h), which Odeh
    // rounds to a total of 0.035333 * sqrt(h)
    const h = 450;
    const components = (0.02917 + 0.00617) * Math.sqrt(h);
    expect(Astronomical.elevationCorrection(h)).toBeCloseTo(components, 3);
  });

  it("reproduces Odeh's worked example of 91.948 degrees at 1000 meters", () => {
    const horizontalParallax = 0.0024;
    const zenith =
      90 +
      16 / 60 +
      34 / 60 +
      Astronomical.elevationCorrection(1000) -
      horizontalParallax;
    expect(zenith).toBeCloseTo(91.948, 3);
  });

  // The Air Almanac 2026, table 2 "Depression of Sun at Various Heights, at
  // Sunrise and Sunset", page A151. Heights are in feet and depressions are
  // rounded to 0.1 degrees. Rows above 30 000 feet (aircraft heights) are not
  // included.
  it.each([
    [500, 1.3],
    [1000, 1.5],
    [2000, 1.7],
    [3000, 1.9],
    [4000, 2.1],
    [5000, 2.2],
    [6000, 2.4],
    [7000, 2.5],
    [8000, 2.6],
    [9000, 2.7],
    [10000, 2.8],
    [15000, 3.2],
    [20000, 3.6],
    [25000, 3.9],
    [30000, 4.2],
  ])(
    'matches the Air Almanac depression of the Sun at %d feet',
    (feet, depression) => {
      const meters = feet * 0.3048;
      const computed = 50 / 60 + Astronomical.elevationCorrection(meters);
      expect(Math.abs(computed - depression)).toBeLessThan(0.06);
    },
  );
});

describe('CalculationParameters.horizonElevations', () => {
  it('defaults to 0 for both sunrise and sunset', () => {
    const params = new CalculationParameters('Other', 18, 18);
    expect(params.elevationFromHorizon).toBe(0);
    expect(params.horizonElevations()).toEqual({ sunrise: 0, sunset: 0 });
  });

  it('applies a single number to both sunrise and sunset', () => {
    const params = unroundedParams(250);
    expect(params.horizonElevations()).toEqual({ sunrise: 250, sunset: 250 });
  });

  it('accepts separate sunrise and sunset values', () => {
    const params = unroundedParams({ sunrise: 500, sunset: 0 });
    expect(params.horizonElevations()).toEqual({ sunrise: 500, sunset: 0 });
  });

  it('treats negative values as 0', () => {
    expect(unroundedParams(-50).horizonElevations()).toEqual({
      sunrise: 0,
      sunset: 0,
    });
    expect(
      unroundedParams({ sunrise: 100, sunset: -5 }).horizonElevations(),
    ).toEqual({ sunrise: 100, sunset: 0 });

    const base = new PrayerTimes(antalya, equinox, unroundedParams());
    const valley = new PrayerTimes(antalya, equinox, unroundedParams(-200));
    expect(valley.sunrise).toEqual(base.sunrise);
    expect(valley.sunset).toEqual(base.sunset);
  });

  it.each([
    NaN,
    Infinity,
    -Infinity,
    { sunrise: NaN, sunset: 100 },
    { sunrise: 100 },
    '100',
  ])('rejects invalid value %j', (value) => {
    const params = new CalculationParameters('Other', 18, 18);
    params.elevationFromHorizon =
      value as unknown as CalculationParameters['elevationFromHorizon'];
    expect(() => params.horizonElevations()).toThrow(
      /Invalid elevationFromHorizon/,
    );
    expect(() => new PrayerTimes(antalya, equinox, params)).toThrow(
      /Invalid elevationFromHorizon/,
    );
  });
});

describe('SolarTime with elevation', () => {
  it('computes sunrise and sunset at the standard altitude lowered by the elevation correction', () => {
    const elevation = 450;
    const solar = new SolarTime(equinox, antalya, elevation, elevation);
    const altitude = -50 / 60 - Astronomical.elevationCorrection(elevation);
    expect(solar.sunrise).toBeCloseTo(solar.hourAngle(altitude, false), 10);
    expect(solar.sunset).toBeCloseTo(solar.hourAngle(altitude, true), 10);
  });

  it('is unchanged when no elevation is given', () => {
    const standard = new SolarTime(equinox, antalya);
    const zero = new SolarTime(equinox, antalya, 0, 0);
    expect(zero.sunrise).toBe(standard.sunrise);
    expect(zero.sunset).toBe(standard.sunset);
    expect(standard.sunrise).toBeCloseTo(
      standard.hourAngle(-50 / 60, false),
      10,
    );
  });
});

describe('PrayerTimes with elevationFromHorizon', () => {
  it('produces identical times for the default and an explicit 0', () => {
    const base = new PrayerTimes(antalya, equinox, unroundedParams());
    const zero = new PrayerTimes(antalya, equinox, unroundedParams(0));
    const zeroBoth = new PrayerTimes(
      antalya,
      equinox,
      unroundedParams({ sunrise: 0, sunset: 0 }),
    );
    for (const times of [zero, zeroBoth]) {
      expect(times.fajr).toEqual(base.fajr);
      expect(times.sunrise).toEqual(base.sunrise);
      expect(times.dhuhr).toEqual(base.dhuhr);
      expect(times.asr).toEqual(base.asr);
      expect(times.sunset).toEqual(base.sunset);
      expect(times.maghrib).toEqual(base.maghrib);
      expect(times.isha).toEqual(base.isha);
    }
  });

  // Regression check: these bounds come from this library's own output, not
  // from a published source.
  it('moves sunrise earlier and sunset/maghrib later by a few minutes at 450 meters', () => {
    const base = new PrayerTimes(antalya, equinox, unroundedParams());
    const elevated = new PrayerTimes(antalya, equinox, unroundedParams(450));

    const sunriseShift = minutesBetween(elevated.sunrise, base.sunrise);
    const sunsetShift = minutesBetween(base.sunset, elevated.sunset);
    const maghribShift = minutesBetween(base.maghrib, elevated.maghrib);

    expect(sunriseShift).toBeGreaterThan(3);
    expect(sunriseShift).toBeLessThan(4);
    expect(sunsetShift).toBeGreaterThan(3);
    expect(sunsetShift).toBeLessThan(4);
    expect(maghribShift).toBeCloseTo(sunsetShift, 10);
  });

  it('does not change fajr, dhuhr, asr, or isha', () => {
    const base = new PrayerTimes(antalya, equinox, unroundedParams());
    const elevated = new PrayerTimes(antalya, equinox, unroundedParams(450));
    expect(elevated.fajr).toEqual(base.fajr);
    expect(elevated.dhuhr).toEqual(base.dhuhr);
    expect(elevated.asr).toEqual(base.asr);
    expect(elevated.isha).toEqual(base.isha);
  });

  it('does not change an angle based maghrib', () => {
    const baseParams = CalculationMethod.Tehran();
    baseParams.rounding = Rounding.None;
    const elevatedParams = CalculationMethod.Tehran();
    elevatedParams.rounding = Rounding.None;
    elevatedParams.elevationFromHorizon = 450;

    const base = new PrayerTimes(antalya, equinox, baseParams);
    const elevated = new PrayerTimes(antalya, equinox, elevatedParams);
    expect(elevated.sunset.getTime()).toBeGreaterThan(base.sunset.getTime());
    expect(elevated.maghrib).toEqual(base.maghrib);
    expect(elevated.fajr).toEqual(base.fajr);
    expect(elevated.isha).toEqual(base.isha);
  });

  it('shifts interval based isha along with sunset', () => {
    const baseParams = CalculationMethod.UmmAlQura();
    baseParams.rounding = Rounding.None;
    const elevatedParams = CalculationMethod.UmmAlQura();
    elevatedParams.rounding = Rounding.None;
    elevatedParams.elevationFromHorizon = 450;

    const base = new PrayerTimes(antalya, equinox, baseParams);
    const elevated = new PrayerTimes(antalya, equinox, elevatedParams);
    expect(minutesBetween(base.isha, elevated.isha)).toBeCloseTo(
      minutesBetween(base.sunset, elevated.sunset),
      10,
    );
  });

  it('applies separate sunrise and sunset elevations independently', () => {
    const base = new PrayerTimes(antalya, equinox, unroundedParams());
    const sunriseOnly = new PrayerTimes(
      antalya,
      equinox,
      unroundedParams({ sunrise: 450, sunset: 0 }),
    );
    const sunsetOnly = new PrayerTimes(
      antalya,
      equinox,
      unroundedParams({ sunrise: 0, sunset: 450 }),
    );
    const both = new PrayerTimes(antalya, equinox, unroundedParams(450));

    expect(sunriseOnly.sunrise).toEqual(both.sunrise);
    expect(sunriseOnly.sunset).toEqual(base.sunset);
    expect(sunriseOnly.maghrib).toEqual(base.maghrib);
    expect(sunsetOnly.sunrise).toEqual(base.sunrise);
    expect(sunsetOnly.sunset).toEqual(both.sunset);
    expect(sunsetOnly.maghrib).toEqual(both.maghrib);
  });

  it('increases the shift with elevation', () => {
    const base = new PrayerTimes(antalya, equinox, unroundedParams());
    let previous = 0;
    for (const h of [10, 100, 500, 1000, 2000]) {
      const elevated = new PrayerTimes(antalya, equinox, unroundedParams(h));
      const shift = minutesBetween(base.sunset, elevated.sunset);
      expect(shift).toBeGreaterThan(previous);
      previous = shift;
    }
  });

  it('is used by SunnahTimes', () => {
    const params = unroundedParams(450);
    const today = new PrayerTimes(antalya, equinox, params);
    const tomorrow = new PrayerTimes(antalya, new Date(2024, 2, 21), params);
    const sunnah = new SunnahTimes(today);
    const night = tomorrow.fajr.getTime() - today.maghrib.getTime();

    expect(sunnah.middleOfTheNight.getTime()).toBeCloseTo(
      today.maghrib.getTime() + night / 2,
      -1,
    );
    expect(sunnah.lastThirdOfTheNight.getTime()).toBeCloseTo(
      today.maghrib.getTime() + (night * 2) / 3,
      -1,
    );

    // A later maghrib with an unchanged fajr shortens the night, moving both
    // times later.
    const base = new SunnahTimes(
      new PrayerTimes(antalya, equinox, unroundedParams()),
    );
    expect(sunnah.middleOfTheNight.getTime()).toBeGreaterThan(
      base.middleOfTheNight.getTime(),
    );
    expect(sunnah.lastThirdOfTheNight.getTime()).toBeGreaterThan(
      base.lastThirdOfTheNight.getTime(),
    );
  });

  it('still resolves polar circle locations', () => {
    // Arjeplog, Sweden during midnight sun
    const arjeplog = new Coordinates(66.7222444, 17.7189);
    const params = unroundedParams(300);
    const times = new PrayerTimes(arjeplog, new Date(2020, 5, 21), params);
    expect(isNaN(times.sunrise.getTime())).toBe(false);
    expect(isNaN(times.maghrib.getTime())).toBe(false);
  });
});
