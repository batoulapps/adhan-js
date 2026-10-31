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

// Antalya, Turkey (the region discussed in issue #146)
const antalya = new Coordinates(36.3, 30.1);
const equinox = new Date(2024, 2, 20);

describe('Astronomical.horizonDip', () => {
  it('is zero at or below the horizon', () => {
    expect(Astronomical.horizonDip(0)).toBe(0);
    expect(Astronomical.horizonDip(-100)).toBe(0);
  });

  it('matches the geometric dip cos(dip) = R / (R + h)', () => {
    const R = 6371000;
    for (const h of [1.5, 100, 450, 1600, 3000]) {
      const expected = (Math.acos(R / (R + h)) * 180) / Math.PI;
      expect(Astronomical.horizonDip(h)).toBeCloseTo(expected, 10);
      // small angle approximation dip = sqrt(2h / R)
      expect(Astronomical.horizonDip(h)).toBeCloseTo(
        (Math.sqrt((2 * h) / R) * 180) / Math.PI,
        3,
      );
    }
  });

  it('gives about 41 arcminutes at 450 meters', () => {
    expect(Astronomical.horizonDip(450) * 60).toBeCloseTo(40.86, 2);
  });
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

  it.each([
    -1,
    NaN,
    Infinity,
    { sunrise: 100, sunset: -5 },
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
  it('computes sunrise and sunset at the standard altitude lowered by the dip', () => {
    const elevation = 450;
    const solar = new SolarTime(equinox, antalya, elevation, elevation);
    const altitude = -50 / 60 - Astronomical.horizonDip(elevation);
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

  it('does not change dhuhr or asr', () => {
    const base = new PrayerTimes(antalya, equinox, unroundedParams());
    const elevated = new PrayerTimes(antalya, equinox, unroundedParams(450));
    expect(elevated.dhuhr).toEqual(base.dhuhr);
    expect(elevated.asr).toEqual(base.asr);
  });

  it('lowers the fajr and isha twilight angles by the dip', () => {
    const elevation = 450;
    const params = unroundedParams(elevation);
    const dip = Astronomical.horizonDip(elevation);
    const solar = new SolarTime(equinox, antalya, elevation, elevation);
    const times = new PrayerTimes(antalya, equinox, params);

    const expectedFajr = solar.hourAngle(-(params.fajrAngle + dip), false);
    const expectedIsha = solar.hourAngle(-(params.ishaAngle + dip), true);
    const hoursUTC = (date: Date) =>
      date.getUTCHours() +
      date.getUTCMinutes() / 60 +
      date.getUTCSeconds() / 3600 +
      date.getUTCMilliseconds() / 3600000;

    // TimeComponents truncates to whole seconds
    expect(Math.abs(hoursUTC(times.fajr) - expectedFajr) * 3600).toBeLessThan(
      1,
    );
    expect(Math.abs(hoursUTC(times.isha) - expectedIsha) * 3600).toBeLessThan(
      1,
    );
  });

  it('moves fajr earlier and isha later by a few minutes at 450 meters', () => {
    const base = new PrayerTimes(antalya, equinox, unroundedParams());
    const elevated = new PrayerTimes(antalya, equinox, unroundedParams(450));

    const fajrShift = minutesBetween(elevated.fajr, base.fajr);
    const ishaShift = minutesBetween(base.isha, elevated.isha);
    expect(fajrShift).toBeGreaterThan(3);
    expect(fajrShift).toBeLessThan(5);
    expect(ishaShift).toBeGreaterThan(3);
    expect(ishaShift).toBeLessThan(5);
  });

  it('lowers the maghrib angle by the sunset dip', () => {
    const baseParams = CalculationMethod.Tehran();
    baseParams.rounding = Rounding.None;
    const elevatedParams = CalculationMethod.Tehran();
    elevatedParams.rounding = Rounding.None;
    elevatedParams.elevationFromHorizon = { sunrise: 0, sunset: 450 };

    const base = new PrayerTimes(antalya, equinox, baseParams);
    const elevated = new PrayerTimes(antalya, equinox, elevatedParams);
    const maghribShift = minutesBetween(base.maghrib, elevated.maghrib);
    expect(maghribShift).toBeGreaterThan(3);
    expect(maghribShift).toBeLessThan(5);
    expect(elevated.fajr).toEqual(base.fajr);
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
    expect(sunriseOnly.fajr).toEqual(both.fajr);
    expect(sunriseOnly.sunset).toEqual(base.sunset);
    expect(sunriseOnly.isha).toEqual(base.isha);
    expect(sunsetOnly.sunrise).toEqual(base.sunrise);
    expect(sunsetOnly.fajr).toEqual(base.fajr);
    expect(sunsetOnly.sunset).toEqual(both.sunset);
    expect(sunsetOnly.isha).toEqual(both.isha);
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

    // A later maghrib and earlier fajr shorten the night, moving the last
    // third earlier.
    const base = new SunnahTimes(
      new PrayerTimes(antalya, equinox, unroundedParams()),
    );
    expect(sunnah.lastThirdOfTheNight.getTime()).toBeLessThan(
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
