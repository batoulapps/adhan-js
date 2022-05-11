import SolarTime from './SolarTime';
import TimeComponents from './TimeComponents';
import Prayer from './Prayer';
import Astronomical from './Astronomical';
import CalculationParameters from './CalculationParameters';
import Coordinates from './Coordinates';
import {
  dateByAddingDays,
  dateByAddingMinutes,
  dateByAddingSeconds,
  dayOfYear,
  isValidDate,
  roundedMinute,
} from './DateUtils';
import { shadowLength } from './Madhab';
import {
  PolarCircleResolution,
  polarCircleResolvedValues,
} from './PolarCircleResolution';
import { ValueOf } from './TypeUtils';

export default class PrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  sunset: Date;
  maghrib: Date;
  isha: Date;

  // eslint-disable-next-line complexity
  constructor(
    public coordinates: Coordinates,
    public date: Date,
    public calculationParameters: CalculationParameters,
  ) {
    let solarTime = new SolarTime(date, coordinates);

    let fajrTime: Date;
    let sunriseTime: Date;
    let dhuhrTime: Date;
    let asrTime: Date;
    let sunsetTime: Date;
    let maghribTime: Date;
    let ishaTime: Date;

    let nightFraction;

    dhuhrTime = new TimeComponents(solarTime.transit).utcDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    sunriseTime = new TimeComponents(solarTime.sunrise).utcDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    sunsetTime = new TimeComponents(solarTime.sunset).utcDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const tomorrow = dateByAddingDays(date, 1);
    let tomorrowSolarTime = new SolarTime(tomorrow, coordinates);

    const polarCircleResolver = calculationParameters.polarCircleResolution;
    if (
      (!isValidDate(sunriseTime) ||
        !isValidDate(sunsetTime) ||
        isNaN(tomorrowSolarTime.sunrise)) &&
      polarCircleResolver !== PolarCircleResolution.Unresolved
    ) {
      const resolved = polarCircleResolvedValues(
        polarCircleResolver,
        date,
        coordinates,
      );
      solarTime = resolved.solarTime;
      tomorrowSolarTime = resolved.tomorrowSolarTime;
      const dateComponents = [
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      ] as const;

      dhuhrTime = new TimeComponents(solarTime.transit).utcDate(
        ...dateComponents,
      );
      sunriseTime = new TimeComponents(solarTime.sunrise).utcDate(
        ...dateComponents,
      );
      sunsetTime = new TimeComponents(solarTime.sunset).utcDate(
        ...dateComponents,
      );
    }

    // eslint-disable-next-line prefer-const
    asrTime = new TimeComponents(
      solarTime.afternoon(shadowLength(calculationParameters.madhab)),
    ).utcDate(date.getFullYear(), date.getMonth(), date.getDate());

    const tomorrowSunrise = new TimeComponents(
      tomorrowSolarTime.sunrise,
    ).utcDate(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    const night = (Number(tomorrowSunrise) - Number(sunsetTime)) / 1000;

    fajrTime = new TimeComponents(
      solarTime.hourAngle(-1 * calculationParameters.fajrAngle, false),
    ).utcDate(date.getFullYear(), date.getMonth(), date.getDate());

    // special case for moonsighting committee above latitude 55
    if (
      calculationParameters.method === 'MoonsightingCommittee' &&
      coordinates.latitude >= 55
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

    if (isNaN(fajrTime.getTime()) || safeFajr > fajrTime) {
      fajrTime = safeFajr;
    }

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
        coordinates.latitude >= 55
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

      if (isNaN(ishaTime.getTime()) || safeIsha < ishaTime) {
        ishaTime = safeIsha;
      }
    }

    maghribTime = sunsetTime;
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

    this.fajr = roundedMinute(
      dateByAddingMinutes(fajrTime, fajrAdjustment),
      calculationParameters.rounding,
    );
    this.sunrise = roundedMinute(
      dateByAddingMinutes(sunriseTime, sunriseAdjustment),
      calculationParameters.rounding,
    );
    this.dhuhr = roundedMinute(
      dateByAddingMinutes(dhuhrTime, dhuhrAdjustment),
      calculationParameters.rounding,
    );
    this.asr = roundedMinute(
      dateByAddingMinutes(asrTime, asrAdjustment),
      calculationParameters.rounding,
    );
    this.sunset = roundedMinute(sunsetTime, calculationParameters.rounding);
    this.maghrib = roundedMinute(
      dateByAddingMinutes(maghribTime, maghribAdjustment),
      calculationParameters.rounding,
    );
    this.isha = roundedMinute(
      dateByAddingMinutes(ishaTime, ishaAdjustment),
      calculationParameters.rounding,
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
