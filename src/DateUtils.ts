import Astronomical from './Astronomical';
import { Rounding } from './Rounding';
import { ValueOf } from './TypeUtils';

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
    offset = 60 - seconds;
  } else if (rounding === Rounding.None) {
    offset = 0;
  }

  return dateByAddingSeconds(date, offset);
}

export function dayOfYear(date: Date) {
  let returnedDayOfYear = 0;
  const feb = Astronomical.isLeapYear(date.getFullYear()) ? 29 : 28;
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
