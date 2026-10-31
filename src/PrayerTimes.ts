import Prayer from './Prayer.js';
import CalculationParameters from './CalculationParameters.js';
import Coordinates from './Coordinates.js';
import { isValidDate } from './DateUtils.js';
import { computePrayerTimesForDay } from './PrayerTimesCalculation.js';
import type { PrayerTimesResult } from './PrayerTimesCalculation.js';
import {
  PolarCircleResolution,
  resolvePolarCircle,
} from './PolarCircleResolution.js';
import { ValueOf } from './TypeUtils.js';

/**
 * Computes prayer times for a given location, date, and set of calculation
 * parameters.
 *
 * Near the polar circles the sun may not rise or set, or may not reach the
 * angle required for a given prayer, on certain days of the year. By default
 * `calculationParameters.polarCircleResolution` is `AqrabBalad`, which
 * automatically substitutes the closest usable latitude in these cases. If a
 * substitute can't be found (or `polarCircleResolution` is `Unresolved`),
 * every prayer time field below is set to an invalid `Date` (i.e.
 * `isNaN(date.getTime())`) rather than a subset of them, so check `isValid`
 * (or an individual field) before using the times.
 *
 * The same happens when the input is invalid: a latitude outside ±90°, a
 * latitude or longitude that isn't a finite number, or an invalid `date`.
 */
export default class PrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  sunset: Date;
  maghrib: Date;
  isha: Date;

  constructor(
    public coordinates: Coordinates,
    public date: Date,
    public calculationParameters: CalculationParameters,
  ) {
    // Latitude must be within ±90° and longitude must be a finite number.
    // Longitude isn't range checked since values outside ±180° wrap around
    // to the same meridian. The date must be a valid Date.
    const hasValidInput =
      Number.isFinite(coordinates.latitude) &&
      Math.abs(coordinates.latitude) <= 90 &&
      Number.isFinite(coordinates.longitude) &&
      isValidDate(date);

    // Compute times for the requested location and date. This only fails near
    // the polar circles during extreme situations like midnight sun or polar
    // night.
    let result: PrayerTimesResult = hasValidInput
      ? computePrayerTimesForDay(coordinates, date, calculationParameters)
      : { isValid: false };

    // If the initial calculation failed, attempt polar circle resolution.
    // AqrabBalad uses the nearest latitude that works,
    // AqrabYaum uses the nearest day that works,
    // and Unresolved leaves the result invalid.
    if (
      hasValidInput &&
      !result.isValid &&
      calculationParameters.polarCircleResolution !==
        PolarCircleResolution.Unresolved
    ) {
      const resolved = resolvePolarCircle(
        calculationParameters.polarCircleResolution,
        coordinates,
        date,
        calculationParameters,
      );
      if (resolved) {
        result = resolved;
      }
    }

    // Prayer times can't be determined for this location and date. Either the
    // input was invalid, polarCircleResolution is Unresolved, or it was unable
    // to find valid times for the given parameters. Every field is set to an
    // invalid Date so callers can't accidentally use a subset of the times.
    if (result.isValid) {
      this.fajr = result.fajr;
      this.sunrise = result.sunrise;
      this.dhuhr = result.dhuhr;
      this.asr = result.asr;
      this.sunset = result.sunset;
      this.maghrib = result.maghrib;
      this.isha = result.isha;
    } else {
      this.fajr = new Date(NaN);
      this.sunrise = new Date(NaN);
      this.dhuhr = new Date(NaN);
      this.asr = new Date(NaN);
      this.sunset = new Date(NaN);
      this.maghrib = new Date(NaN);
      this.isha = new Date(NaN);
    }
  }

  /**
   * Whether all prayer times could be computed. This is false when the
   * coordinates or date are invalid, or when the location and date fall
   * inside a polar circle where the sun's position doesn't reach the angle
   * required for one or more prayers (see the class doc comment above).
   */
  get isValid() {
    return (
      isValidDate(this.fajr) &&
      isValidDate(this.sunrise) &&
      isValidDate(this.dhuhr) &&
      isValidDate(this.asr) &&
      isValidDate(this.sunset) &&
      isValidDate(this.maghrib) &&
      isValidDate(this.isha)
    );
  }

  timeForPrayer(prayer: ValueOf<typeof Prayer>) {
    if (prayer === Prayer.Fajr) {
      return this.fajr;
    } else if (prayer === Prayer.Sunrise) {
      return this.sunrise;
    } else if (prayer === Prayer.Dhuhr) {
      return this.dhuhr;
    } else if (prayer === Prayer.Asr) {
      return this.asr;
    } else if (prayer === Prayer.Maghrib) {
      return this.maghrib;
    } else if (prayer === Prayer.Isha) {
      return this.isha;
    } else {
      return null;
    }
  }

  currentPrayer(date = new Date()) {
    if (date >= this.isha) {
      return Prayer.Isha;
    } else if (date >= this.maghrib) {
      return Prayer.Maghrib;
    } else if (date >= this.asr) {
      return Prayer.Asr;
    } else if (date >= this.dhuhr) {
      return Prayer.Dhuhr;
    } else if (date >= this.sunrise) {
      return Prayer.Sunrise;
    } else if (date >= this.fajr) {
      return Prayer.Fajr;
    } else {
      return Prayer.None;
    }
  }

  nextPrayer(date = new Date()) {
    if (date >= this.isha) {
      return Prayer.None;
    } else if (date >= this.maghrib) {
      return Prayer.Isha;
    } else if (date >= this.asr) {
      return Prayer.Maghrib;
    } else if (date >= this.dhuhr) {
      return Prayer.Asr;
    } else if (date >= this.sunrise) {
      return Prayer.Dhuhr;
    } else if (date >= this.fajr) {
      return Prayer.Sunrise;
    } else {
      return Prayer.Fajr;
    }
  }
}
