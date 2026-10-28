import {
  dateByAddingDays,
  dateByAddingSeconds,
  isValidDate,
  roundedMinute,
} from './DateUtils.js';
import PrayerTimes from './PrayerTimes.js';

/**
 * Computes Qiyam times from an existing `PrayerTimes` instance.
 *
 * This internally computes a second `PrayerTimes` for the following day
 * (using the same coordinates and calculation parameters) to determine the
 * length of the night. That second computation can fail independently of
 * the `PrayerTimes` passed in - e.g. near the polar circle, today's times
 * may resolve fine while tomorrow's don't (or vice versa) - so check
 * `isValid` before using these times, even if `prayerTimes.isValid` was
 * already `true`.
 */
export default class SunnahTimes {
  middleOfTheNight: Date;
  lastThirdOfTheNight: Date;

  constructor(prayerTimes: PrayerTimes) {
    const date = prayerTimes.date;
    const nextDay = dateByAddingDays(date, 1);
    const nextDayPrayerTimes = new PrayerTimes(
      prayerTimes.coordinates,
      nextDay,
      prayerTimes.calculationParameters,
    );

    const nightDuration =
      (nextDayPrayerTimes.fajr.getTime() - prayerTimes.maghrib.getTime()) /
      1000.0;

    this.middleOfTheNight = roundedMinute(
      dateByAddingSeconds(prayerTimes.maghrib, nightDuration / 2),
    );
    this.lastThirdOfTheNight = roundedMinute(
      dateByAddingSeconds(prayerTimes.maghrib, nightDuration * (2 / 3)),
    );
  }

  /**
   * Whether both Sunnah times could be computed. This can be false even
   * when the `PrayerTimes` passed into the constructor was valid, since
   * this also depends on the following day's prayer times being resolvable.
   */
  get isValid() {
    return (
      isValidDate(this.middleOfTheNight) &&
      isValidDate(this.lastThirdOfTheNight)
    );
  }
}
