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

export function roundedMinute(
  date: Date,
  rounding: ValueOf<typeof Rounding> = Rounding.Nearest,
) {
  const seconds = date.getUTCSeconds();
  let offset = seconds >= 30 ? 60 - seconds : -1 * seconds;
  if (rounding === Rounding.Up) {
    // A time already on an exact minute is its own ceiling; adding a full
    // minute to it would over-round.
    offset = (60 - seconds) % 60;
  } else if (rounding === Rounding.None) {
    offset = 0;
  }

  if (rounding !== Rounding.None) {
    // Rounding to the minute must also clear sub-second residue: the
    // high-latitude night-portion path (safeFajr/safeIsha) produces
    // fractional seconds that otherwise survive into the result.
    const rounded = dateByAddingSeconds(date, offset);
    rounded.setUTCMilliseconds(0);
    return rounded;
  }

  return dateByAddingSeconds(date, offset);
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
