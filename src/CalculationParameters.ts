import type CalculationMethod from './CalculationMethod.js';
import { Madhab } from './Madhab.js';
import HighLatitudeRule from './HighLatitudeRule.js';
import { PolarCircleResolution } from './PolarCircleResolution.js';
import { Rounding } from './Rounding.js';
import { Shafaq } from './Shafaq.js';
import { ValueOf } from './TypeUtils.js';

export type ElevationFromHorizon = number | { sunrise: number; sunset: number };

export default class CalculationParameters {
  // Madhab to determine how Asr is calculated.
  madhab: ValueOf<typeof Madhab> = Madhab.Shafi;

  // Rule to determine the earliest time for Fajr and latest time for Isha
  // needed for high latitude locations where Fajr and Isha may not truly exist
  // or may present a hardship unless bound to a reasonable time.
  highLatitudeRule: ValueOf<typeof HighLatitudeRule> =
    HighLatitudeRule.MiddleOfTheNight;

  // Manual adjustments (in minutes) to be added to each prayer time.
  adjustments = {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  };

  // Adjustments set by a calculation method. This value should not be manually modified.
  methodAdjustments = {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  };

  // Rule to determine how to resolve prayer times inside the Polar Circle
  // where daylight or night may persist for more than 24 hours depending
  // on the season
  polarCircleResolution: ValueOf<typeof PolarCircleResolution> =
    PolarCircleResolution.AqrabBalad;

  // How seconds are rounded when calculating prayer times
  rounding: ValueOf<typeof Rounding> = Rounding.Nearest;

  // Used by the MoonsightingCommittee method to determine how to calculate Isha
  shafaq: ValueOf<typeof Shafaq> = Shafaq.General;

  // Height in meters of the observer above the horizon, used to calculate
  // sunrise and sunset. This is NOT the observer's elevation above sea level:
  // a city on a plateau has the same elevation as its horizon, so the value
  // should be 0. Provide { sunrise, sunset } when the eastern and western
  // horizons differ.
  elevationFromHorizon: ElevationFromHorizon = 0;

  constructor(
    // Name of the method, can be used to apply special behavior in calculations.
    // This property should not be manually modified.
    public method: null | keyof typeof CalculationMethod,
    // Angle of the sun below the horizon used for calculating Fajr.
    public fajrAngle = 0,
    // Angle of the sun below the horizon used for calculating Isha.
    public ishaAngle = 0,
    // Minutes after Maghrib to determine time for Isha
    // if this value is greater than 0 then ishaAngle is not used.
    public ishaInterval = 0,
    // Angle of the sun below the horizon used for calculating Maghrib.
    // Only used by the Tehran method to account for lightness in the sky.
    public maghribAngle = 0,
  ) {
    if (this.method === null) {
      // we don't want a breaking change
      this.method = 'Other';
    }
  }

  nightPortions() {
    switch (this.highLatitudeRule) {
      case HighLatitudeRule.MiddleOfTheNight:
        return { fajr: 1 / 2, isha: 1 / 2 };
      case HighLatitudeRule.SeventhOfTheNight:
        return { fajr: 1 / 7, isha: 1 / 7 };
      case HighLatitudeRule.TwilightAngle:
        return { fajr: this.fajrAngle / 60, isha: this.ishaAngle / 60 };
      default:
        throw new Error(
          `Invalid high latitude rule found when attempting to compute night portions: ${this.highLatitudeRule}`,
        );
    }
  }

  horizonElevations() {
    const value = this.elevationFromHorizon ?? 0;
    let elevations: { sunrise: number; sunset: number };
    if (typeof value === 'number') {
      elevations = { sunrise: value, sunset: value };
    } else {
      elevations = { sunrise: value.sunrise, sunset: value.sunset };
    }

    if (
      !Number.isFinite(elevations.sunrise) ||
      !Number.isFinite(elevations.sunset)
    ) {
      throw new Error(
        `Invalid elevationFromHorizon: ${JSON.stringify(value)}. Expected a finite number of meters.`,
      );
    }

    // A negative value means the horizon is above the observer, such as in a
    // valley, which is treated the same as a level horizon.
    return {
      sunrise: Math.max(0, elevations.sunrise),
      sunset: Math.max(0, elevations.sunset),
    };
  }
}
