/* eslint-disable prefer-const */
import Astronomical from './Astronomical'
import CalculationParameters from './CalculationParameters'
import Coordinates from './Coordinates'
import {
  dateByAddingDays,
  dateByAddingMinutes,
  dateByAddingSeconds,
  dayOfYear,
  isValidDate,
  roundedMinute,
} from './DateUtils'
import {shadowLength} from './Madhab'
import {
  PolarCircleResolution,
  polarCircleResolvedValues,
} from './PolarCircleResolution'
import Prayer from './Prayer'
import SolarTime from './SolarTime'
import TimeComponents from './TimeComponents'
import {ValueOf} from './type-utils'

export default class PrayerTimes {
  fajr: Date
  sunrise: Date
  dhuhr: Date
  asr: Date
  maghrib: Date
  isha: Date

  // eslint-disable-next-line complexity
  constructor(
    public coordinates: Coordinates,
    public date: Date,
    public calculationParameters: CalculationParameters,
  ) {
    let solarTime = new SolarTime(date, coordinates)

    let fajrTime: TimeComponents
    let sunriseTime: TimeComponents
    let dhuhrTime: TimeComponents
    let asrTime: TimeComponents
    let maghribTime: TimeComponents
    let ishaTime: TimeComponents

    let nightFraction

    dhuhrTime = new TimeComponents(solarTime.transit)
    sunriseTime = new TimeComponents(solarTime.sunrise)
    let sunsetTime = new TimeComponents(solarTime.sunset)
    const tomorrow = dateByAddingDays(date, 1)
    let tomorrowSolarTime = new SolarTime(tomorrow, coordinates)

    const polarCircleResolver = calculationParameters.polarCircleResolution
    // if (
    //   (!isValidDate(sunriseTime) ||
    //     !isValidDate(sunsetTime) ||
    //     isNaN(tomorrowSolarTime.sunrise)) &&
    //   polarCircleResolver !== PolarCircleResolution.Unresolved
    // ) {
    //   const resolved = polarCircleResolvedValues(
    //     polarCircleResolver,
    //     date,
    //     coordinates,
    //   )
    //   solarTime = resolved.solarTime
    //   tomorrowSolarTime = resolved.tomorrowSolarTime
    //   const dateComponents = [
    //     date.getFullYear(),
    //     date.getMonth(),
    //     date.getDate(),
    //   ] as const

    //   dhuhrTime = new TimeComponents(solarTime.transit).utcDate(
    //     ...dateComponents,
    //   )
    //   sunriseTime = new TimeComponents(solarTime.sunrise).utcDate(
    //     ...dateComponents,
    //   )
    //   sunsetTime = new TimeComponents(solarTime.sunset).utcDate(
    //     ...dateComponents,
    //   )
    // }

    // eslint-disable-next-line prefer-const
    asrTime = new TimeComponents(
      solarTime.afternoon(shadowLength(calculationParameters.madhab)),
    )

    const tomorrowSunrise = new TimeComponents(tomorrowSolarTime.sunrise)

    const night = tomorrowSunrise.toSeconds() - sunsetTime.toSeconds()

    fajrTime = new TimeComponents(
      solarTime.hourAngle(-1 * calculationParameters.fajrAngle, false),
    )

    // special case for moonsighting committee above latitude 55
    if (
      calculationParameters.method === 'MoonsightingCommittee' &&
      coordinates.latitude >= 55
    ) {
      nightFraction = night / 7
      fajrTime = TimeComponents.addSeconds(sunriseTime, -nightFraction)
    }

    const safeFajr = (function () {
      if (calculationParameters.method === 'MoonsightingCommittee') {
        return Astronomical.seasonAdjustedMorningTwilight(
          coordinates.latitude,
          dayOfYear(date),
          date.getFullYear(),
          sunriseTime,
        )
      } else {
        const portion = calculationParameters.nightPortions().fajr
        nightFraction = portion * night
        return TimeComponents.addSeconds(sunriseTime, -nightFraction)
      }
    })()

    if (fajrTime === null || safeFajr > fajrTime) {
      fajrTime = safeFajr
    }

    if (calculationParameters.ishaInterval > 0) {
      ishaTime = TimeComponents.addMinutes(
        sunsetTime,
        calculationParameters.ishaInterval,
      )
    } else {
      ishaTime = new TimeComponents(
        solarTime.hourAngle(-1 * calculationParameters.ishaAngle, true),
      )

      // special case for moonsighting committee above latitude 55
      if (
        calculationParameters.method === 'MoonsightingCommittee' &&
        coordinates.latitude >= 55
      ) {
        nightFraction = night / 7
        ishaTime = TimeComponents.addSeconds(sunsetTime, nightFraction)
      }

      const safeIsha = (function () {
        if (calculationParameters.method === 'MoonsightingCommittee') {
          return Astronomical.seasonAdjustedEveningTwilight(
            coordinates.latitude,
            dayOfYear(date),
            date.getFullYear(),
            sunsetTime,
            calculationParameters.shafaq,
          )
        } else {
          const portion = calculationParameters.nightPortions().isha
          nightFraction = portion * night
          return TimeComponents.addSeconds(sunsetTime, nightFraction)
        }
      })()

      if (ishaTime == null || safeIsha < ishaTime) {
        ishaTime = safeIsha
      }
    }

    maghribTime = sunsetTime

    if (calculationParameters.maghribAngle) {
      const angleBasedMaghrib = new TimeComponents(
        solarTime.hourAngle(-1 * calculationParameters.maghribAngle, true),
      )
      if (
        sunsetTime.smallerThan(angleBasedMaghrib) &&
        ishaTime.greaterThan(angleBasedMaghrib)
      ) {
        maghribTime = angleBasedMaghrib
      }
    }

    const fajrAdjustment =
      calculationParameters.adjustments.fajr +
      calculationParameters.methodAdjustments.fajr
    const sunriseAdjustment =
      calculationParameters.adjustments.sunrise +
      calculationParameters.methodAdjustments.sunrise
    const dhuhrAdjustment =
      calculationParameters.adjustments.dhuhr +
      calculationParameters.methodAdjustments.dhuhr
    const asrAdjustment =
      calculationParameters.adjustments.asr +
      calculationParameters.methodAdjustments.asr
    const maghribAdjustment =
      calculationParameters.adjustments.maghrib +
      calculationParameters.methodAdjustments.maghrib
    const ishaAdjustment =
      calculationParameters.adjustments.isha +
      calculationParameters.methodAdjustments.isha

    this.fajr = TimeComponents.roundedMinute(
      TimeComponents.addMinutes(fajrTime, fajrAdjustment),
      calculationParameters.rounding,
    ).utcDate(date.getFullYear(), date.getMonth(), date.getDate())
    this.sunrise = TimeComponents.roundedMinute(
      TimeComponents.addMinutes(sunriseTime, sunriseAdjustment),
      calculationParameters.rounding,
    ).utcDate(date.getFullYear(), date.getMonth(), date.getDate())
    this.dhuhr = TimeComponents.roundedMinute(
      TimeComponents.addMinutes(dhuhrTime, dhuhrAdjustment),
      calculationParameters.rounding,
    ).utcDate(date.getFullYear(), date.getMonth(), date.getDate())
    this.asr = TimeComponents.roundedMinute(
      TimeComponents.addMinutes(asrTime, asrAdjustment),
      calculationParameters.rounding,
    ).utcDate(date.getFullYear(), date.getMonth(), date.getDate())
    this.maghrib = TimeComponents.roundedMinute(
      TimeComponents.addMinutes(maghribTime, maghribAdjustment),
      calculationParameters.rounding,
    ).utcDate(date.getFullYear(), date.getMonth(), date.getDate())
    this.isha = TimeComponents.roundedMinute(
      TimeComponents.addMinutes(ishaTime, ishaAdjustment),
      calculationParameters.rounding,
    ).utcDate(date.getFullYear(), date.getMonth(), date.getDate())
  }

  timeForPrayer(prayer: ValueOf<typeof Prayer>) {
    if (prayer === Prayer.Fajr) {
      return this.fajr
    } else if (prayer === Prayer.Sunrise) {
      return this.sunrise
    } else if (prayer === Prayer.Dhuhr) {
      return this.dhuhr
    } else if (prayer === Prayer.Asr) {
      return this.asr
    } else if (prayer === Prayer.Maghrib) {
      return this.maghrib
    } else if (prayer === Prayer.Isha) {
      return this.isha
    } else {
      return null
    }
  }

  currentPrayer(date = new Date()) {
    if (date >= this.isha) {
      return Prayer.Isha
    } else if (date >= this.maghrib) {
      return Prayer.Maghrib
    } else if (date >= this.asr) {
      return Prayer.Asr
    } else if (date >= this.dhuhr) {
      return Prayer.Dhuhr
    } else if (date >= this.sunrise) {
      return Prayer.Sunrise
    } else if (date >= this.fajr) {
      return Prayer.Fajr
    } else {
      return Prayer.None
    }
  }

  nextPrayer(date = new Date()) {
    if (date >= this.isha) {
      return Prayer.None
    } else if (date >= this.maghrib) {
      return Prayer.Isha
    } else if (date >= this.asr) {
      return Prayer.Maghrib
    } else if (date >= this.dhuhr) {
      return Prayer.Asr
    } else if (date >= this.sunrise) {
      return Prayer.Dhuhr
    } else if (date >= this.fajr) {
      return Prayer.Sunrise
    } else {
      return Prayer.Fajr
    }
  }
}
