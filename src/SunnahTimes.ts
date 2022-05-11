import {
  dateByAddingDays,
  dateByAddingSeconds,
  roundedMinute,
} from './DateUtils';
import PrayerTimes from './PrayerTimes';

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
}
