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
  constructor(fajrAngle: number, ishaAngle: number, ishaInterval: number, methodName?: string)

  readonly method: string;
  fajrAngle: number;
  ishaAngle: number;
  ishaInterval: number;
  madhab: Madhab;
  highLatitudeRule: HighLatitudeRule;
  adjustments: PrayerAdjustments;
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

