export as namespace adhan;

export class PrayerTimes {
  constructor(coordinates: Coordinates, date: Date, params: CalculationParameters);

  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;

  timeForPrayer(prayer: Prayer): Date;
  currentPrayer(date?: Date): Prayer;
  nextPrayer(date?: Date): Prayer;
}

export class CalculationParameters {
  constructor(methodName: string|undefined|null, fajrAngle: number, ishaAngle: number, ishaInterval?: number, maghribAngle?: number)

  /**
   * Name of the method, can be used to apply special behavior in calculations.
   */
  readonly method: string;

  /**
   * Angle of the sun below the horizon used for calculating Fajr.
   */
  fajrAngle: number;

  /**
   * Angle of the sun below the horizon used for calculating Isha.
   */
  ishaAngle: number;

  /**
   * Minutes after Maghrib to determine time for Isha,
   * if this value is greater than 0 then ishaAngle is not used.
   */
  ishaInterval: number;

  /**
   * Angle of the sun below the horizon used for calculating Maghrib.
   * Only used by the Tehran method to account for lightness in the sky.
   */
  maghribAngle: number;

  /**
   * Madhab to determine how Asr is calculated.
   */
  madhab: Madhab;

  /**
   * Rule to determine the earliest time for Fajr and latest time for Isha
   * needed for high latitude locations where Fajr and Isha may not truly exist
   * or may present a hardship unless bound to a reasonable time.
   */
  highLatitudeRule: HighLatitudeRule;

  /**
   * Manual adjustments (in minutes) to be added to each prayer time.
   */
  adjustments: PrayerAdjustments;

  /**
   * Rule to determine how to resolve prayer times inside the Polar Circle
   * where daylight or night may persist for more than 24 hours depending
   * on the season.
   */
  polarCircleResolution: PolarCircleResolution;

  /**
   * How seconds are rounded for prayer times.
   */
  rounding: Rounding;

  /**
   * Used by the MoonsightingCommittee method to determine how to calculate Isha
   */
  shafaq: Shafaq;
}

export interface PrayerAdjustments {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export namespace CalculationMethod {
  export function MuslimWorldLeague(): CalculationParameters;
  export function Egyptian(): CalculationParameters;
  export function Karachi(): CalculationParameters;
  export function UmmAlQura(): CalculationParameters;
  export function Dubai(): CalculationParameters;
  export function MoonsightingCommittee(): CalculationParameters;
  export function NorthAmerica(): CalculationParameters;
  export function Kuwait(): CalculationParameters;
  export function Qatar(): CalculationParameters;
  export function Singapore(): CalculationParameters;
  export function Tehran(): CalculationParameters;
  export function Turkey(): CalculationParameters;
  export function Other(): CalculationParameters;
}

export class Coordinates {
  constructor(latitude: number, longitude: number);
  longitude: number;
  latitude: number;
}

export class SunnahTimes {
  constructor(prayerTimes: PrayerTimes);
  
  middleOfTheNight: Date;
  lastThirdOfTheNight: Date;
}

export enum Madhab {
  Shafi,
  Hanafi
}

export enum Rounding {
  Nearest,
  Up,
  None
}

export enum Prayer {
  Fajr,
  Sunrise,
  Dhuhr,
  Asr,
  Maghrib,
  Isha,
  None
}

export enum HighLatitudeRule {
  MiddleOfTheNight,
  SeventhOfTheNight,
  TwilightAngle
}

export namespace HighLatitudeRule {
  export function recommended(coordinates: Coordinates): HighLatitudeRule;
}

/**
 * Shafaq is the twilight in the sky. Different madhabs define the appearance of
 * twilight differently. These values are used by the MoonsightingComittee method
 * for the different ways to calculate Isha.
 */
export enum Shafaq {
  /**
   * General is a combination of Ahmer and Abyad.
   */
  General,

  /**
   * Ahmer means the twilight is the red glow in the sky. Used by the Shafi, Maliki, and Hanbali madhabs.
   */
  Ahmer,

  /**
   * Abyad means the twilight is the white glow in the sky. Used by the Hanafi madhab.
   */
  Abyad
}

export enum PolarCircleResolution {
  AqrabBalad,
  AqrabYaum,
  Unresolved
}

export function Qibla(coordinates: Coordinates): number;
