import { Rounding } from './Rounding.js';
import { ValueOf } from './TypeUtils.js';

export function dateByAddingDays(date: Date, days: number) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate() + days;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return new Date(year, month, day, hours, minutes, seconds);
}

export function dateByAddingMinutes(date: Date, minutes: number) {
  return dateByAddingSeconds(date, minutes * 60);
}

export function dateByAddingSeconds(date: Date, seconds: number) {
  return new Date(date.getTime() + seconds * 1000);
}

const MILLISECONDS_PER_MINUTE = 60 * 1000;

export function roundedMinute(
  date: Date,
  rounding: ValueOf<typeof Rounding> = Rounding.Nearest,
) {
  if (rounding === Rounding.None) {
    return new Date(date.getTime());
  }

  // Like the Swift and Kotlin ports, drop sub-second residue (produced by the
  // high-latitude night-portion path) and round the whole seconds, so a time
  // already on an exact minute is its own ceiling.
  const seconds = Math.floor(date.getTime() / 1000);
  const minutes = seconds / 60;
  const rounded =
    rounding === Rounding.Up ? Math.ceil(minutes) : Math.round(minutes);
  return new Date(rounded * MILLISECONDS_PER_MINUTE);
}

/* Whether or not a year is a leap year (has 366 days). */
export function isLeapYear(year: number) {
  if (year % 4 !== 0) {
    return false;
  }

  if (year % 100 === 0 && year % 400 !== 0) {
    return false;
  }

  return true;
}

export function dayOfYear(date: Date) {
  let returnedDayOfYear = 0;
  const feb = isLeapYear(date.getFullYear()) ? 29 : 28;
  const months = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  for (let i = 0; i < date.getMonth(); i++) {
    returnedDayOfYear += months[i];
  }

  returnedDayOfYear += date.getDate();

  return returnedDayOfYear;
}

export function isValidDate(date: Date) {
  return date instanceof Date && !isNaN(date.valueOf());
}

export const MIN_PRAYER_GAP_MS = 5 * 60 * 1000;

export function timesInOrder(a: Date, b: Date): boolean {
  if (!isValidDate(a) || !isValidDate(b)) {
    return false;
  }
  return b.getTime() - a.getTime() >= MIN_PRAYER_GAP_MS;
}
