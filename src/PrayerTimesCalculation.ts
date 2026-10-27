import SolarTime from './SolarTime.js';
import TimeComponents from './TimeComponents.js';
import Astronomical from './Astronomical.js';
import type CalculationParameters from './CalculationParameters.js';
import type Coordinates from './Coordinates.js';
import {
  dateByAddingDays,
  dateByAddingMinutes,
  dateByAddingSeconds,
  dayOfYear,
  roundedMinute,
  timesInOrder,
} from './DateUtils.js';
import { shadowLength } from './Madhab.js';

// Moonsighting Committee applies a special 1/7 night-fraction rule at high
// latitudes (>= 55°), where angle-based Fajr/Isha may not exist.
const HIGH_LATITUDE_THRESHOLD = 55;

export interface ValidPrayerTimesResult {
  isValid: true;
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  sunset: Date;
  maghrib: Date;
  isha: Date;
}

export interface InvalidPrayerTimesResult {
  isValid: false;
}

export type PrayerTimesResult =
  | ValidPrayerTimesResult
  | InvalidPrayerTimesResult;

/**
 * Computes prayer times for a single day of solar geometry, with no
 * awareness of polar circle resolution. `date` is used both for the solar
 * geometry and for labeling the returned times; if any of them can't be
 * computed or end up out of order, every field is set to an invalid `Date`
 * (see `isValid`).
 */
export function computePrayerTimesForDay(
  coordinates: Coordinates,
  date: Date,
  calculationParameters: CalculationParameters,
): PrayerTimesResult {
  const solarTime = new SolarTime(date, coordinates);
  const tomorrow = dateByAddingDays(date, 1);
  const tomorrowSolarTime = new SolarTime(tomorrow, coordinates);

  const dhuhrTime = new TimeComponents(solarTime.transit).utcDate(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const sunriseTime = new TimeComponents(solarTime.sunrise).utcDate(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const sunsetTime = new TimeComponents(solarTime.sunset).utcDate(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const asrTime = new TimeComponents(
    solarTime.afternoon(shadowLength(calculationParameters.madhab)),
  ).utcDate(date.getFullYear(), date.getMonth(), date.getDate());

  const tomorrowSunrise = new TimeComponents(tomorrowSolarTime.sunrise).utcDate(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate(),
  );
  const night = (Number(tomorrowSunrise) - Number(sunsetTime)) / 1000;

  let nightFraction;

  let fajrTime = new TimeComponents(
    solarTime.hourAngle(-1 * calculationParameters.fajrAngle, false),
  ).utcDate(date.getFullYear(), date.getMonth(), date.getDate());

  // special case for moonsighting committee above latitude 55
  if (
    calculationParameters.method === 'MoonsightingCommittee' &&
    coordinates.latitude >= HIGH_LATITUDE_THRESHOLD
  ) {
    nightFraction = night / 7;
    fajrTime = dateByAddingSeconds(sunriseTime, -nightFraction);
  }

  const safeFajr = (function () {
    if (calculationParameters.method === 'MoonsightingCommittee') {
      return Astronomical.seasonAdjustedMorningTwilight(
        coordinates.latitude,
        dayOfYear(date),
        date.getFullYear(),
        sunriseTime,
      );
    } else {
      const portion = calculationParameters.nightPortions().fajr;
      nightFraction = portion * night;
      return dateByAddingSeconds(sunriseTime, -nightFraction);
    }
  })();

  if (
    isNaN(fajrTime.getTime()) ||
    safeFajr > fajrTime ||
    !timesInOrder(fajrTime, sunriseTime)
  ) {
    fajrTime = safeFajr;
  }

  let ishaTime: Date;
  if (calculationParameters.ishaInterval > 0) {
    ishaTime = dateByAddingMinutes(
      sunsetTime,
      calculationParameters.ishaInterval,
    );
  } else {
    ishaTime = new TimeComponents(
      solarTime.hourAngle(-1 * calculationParameters.ishaAngle, true),
    ).utcDate(date.getFullYear(), date.getMonth(), date.getDate());

    // special case for moonsighting committee above latitude 55
    if (
      calculationParameters.method === 'MoonsightingCommittee' &&
      coordinates.latitude >= HIGH_LATITUDE_THRESHOLD
    ) {
      nightFraction = night / 7;
      ishaTime = dateByAddingSeconds(sunsetTime, nightFraction);
    }

    const safeIsha = (function () {
      if (calculationParameters.method === 'MoonsightingCommittee') {
        return Astronomical.seasonAdjustedEveningTwilight(
          coordinates.latitude,
          dayOfYear(date),
          date.getFullYear(),
          sunsetTime,
          calculationParameters.shafaq,
        );
      } else {
        const portion = calculationParameters.nightPortions().isha;
        nightFraction = portion * night;
        return dateByAddingSeconds(sunsetTime, nightFraction);
      }
    })();

    if (
      isNaN(ishaTime.getTime()) ||
      !timesInOrder(sunsetTime, ishaTime) ||
      safeIsha < ishaTime
    ) {
      ishaTime = safeIsha;
    }
  }

  let maghribTime = sunsetTime;
  if (calculationParameters.maghribAngle) {
    const angleBasedMaghrib = new TimeComponents(
      solarTime.hourAngle(-1 * calculationParameters.maghribAngle, true),
    ).utcDate(date.getFullYear(), date.getMonth(), date.getDate());
    if (sunsetTime < angleBasedMaghrib && ishaTime > angleBasedMaghrib) {
      maghribTime = angleBasedMaghrib;
    }
  }

  const fajrAdjustment =
    (calculationParameters.adjustments.fajr || 0) +
    (calculationParameters.methodAdjustments.fajr || 0);
  const sunriseAdjustment =
    (calculationParameters.adjustments.sunrise || 0) +
    (calculationParameters.methodAdjustments.sunrise || 0);
  const dhuhrAdjustment =
    (calculationParameters.adjustments.dhuhr || 0) +
    (calculationParameters.methodAdjustments.dhuhr || 0);
  const asrAdjustment =
    (calculationParameters.adjustments.asr || 0) +
    (calculationParameters.methodAdjustments.asr || 0);
  const maghribAdjustment =
    (calculationParameters.adjustments.maghrib || 0) +
    (calculationParameters.methodAdjustments.maghrib || 0);
  const ishaAdjustment =
    (calculationParameters.adjustments.isha || 0) +
    (calculationParameters.methodAdjustments.isha || 0);

  // Final ordering guard: if any consecutive pair of valid times is out of order or
  // closer than 5 minutes, the result is in an invalid state we cannot handle, most
  // likely due to polar circle issues. Report a single all-or-nothing invalid result
  // so callers can't accidentally read a subset of the fields.
  const isValid =
    timesInOrder(fajrTime, sunriseTime) &&
    timesInOrder(sunriseTime, dhuhrTime) &&
    timesInOrder(dhuhrTime, asrTime) &&
    timesInOrder(asrTime, maghribTime) &&
    timesInOrder(maghribTime, ishaTime);

  if (!isValid) {
    return { isValid: false };
  }

  return {
    isValid: true,
    fajr: roundedMinute(
      dateByAddingMinutes(fajrTime, fajrAdjustment),
      calculationParameters.rounding,
    ),
    sunrise: roundedMinute(
      dateByAddingMinutes(sunriseTime, sunriseAdjustment),
      calculationParameters.rounding,
    ),
    dhuhr: roundedMinute(
      dateByAddingMinutes(dhuhrTime, dhuhrAdjustment),
      calculationParameters.rounding,
    ),
    asr: roundedMinute(
      dateByAddingMinutes(asrTime, asrAdjustment),
      calculationParameters.rounding,
    ),
    sunset: roundedMinute(sunsetTime, calculationParameters.rounding),
    maghrib: roundedMinute(
      dateByAddingMinutes(maghribTime, maghribAdjustment),
      calculationParameters.rounding,
    ),
    isha: roundedMinute(
      dateByAddingMinutes(ishaTime, ishaAdjustment),
      calculationParameters.rounding,
    ),
  };
}

/**
 * Shifts every field of a result by a whole number of calendar days. Used to
 * relabel a polar-circle-resolved result (computed using a substitute day or
 * location) onto the originally requested date. `days` must be an integer;
 * this adds an exact `days * 86400` seconds, which only equals a calendar-day
 * shift because every field above is UTC-anchored (via `TimeComponents.utcDate`)
 * and UTC has no DST, so this stays exact regardless of the local timezone.
 */
export function shiftPrayerTimesByDays(
  result: PrayerTimesResult,
  days: number,
): PrayerTimesResult {
  if (!result.isValid || days === 0) {
    return result;
  }

  const seconds = days * 86400;
  return {
    isValid: true,
    fajr: dateByAddingSeconds(result.fajr, seconds),
    sunrise: dateByAddingSeconds(result.sunrise, seconds),
    dhuhr: dateByAddingSeconds(result.dhuhr, seconds),
    asr: dateByAddingSeconds(result.asr, seconds),
    sunset: dateByAddingSeconds(result.sunset, seconds),
    maghrib: dateByAddingSeconds(result.maghrib, seconds),
    isha: dateByAddingSeconds(result.isha, seconds),
  };
}
