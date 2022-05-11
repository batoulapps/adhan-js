import moment from 'moment-timezone';
import {
  CalculationMethod,
  Coordinates,
  HighLatitudeRule,
  Madhab,
  Prayer,
  PrayerTimes,
} from '../src/Adhan';

function dateByAddingSeconds(date: Date, seconds: number) {
  return new Date(date.getTime() + seconds * 1000);
}

test('calculating prayer times', () => {
  const date = new Date(2015, 6, 12);
  const params = CalculationMethod.NorthAmerica();
  params.madhab = Madhab.Hanafi;
  const p = new PrayerTimes(new Coordinates(35.775, -78.6336), date, params);

  expect(moment(p.fajr).tz('America/New_York').format('h:mm A')).toBe(
    '4:42 AM',
  );
  expect(moment(p.sunrise).tz('America/New_York').format('h:mm A')).toBe(
    '6:08 AM',
  );
  expect(moment(p.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
    '1:21 PM',
  );
  expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe('6:22 PM');
  expect(moment(p.maghrib).tz('America/New_York').format('h:mm A')).toBe(
    '8:32 PM',
  );
  expect(moment(p.isha).tz('America/New_York').format('h:mm A')).toBe(
    '9:57 PM',
  );
  expect(moment(p.isha).tz('America/New_York').format('HH:mm')).toBe('21:57');
});

test('useing offsets to manually adjust prayer times', () => {
  const date = new Date(2015, 11, 1);
  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = Madhab.Shafi;
  const p = new PrayerTimes(new Coordinates(35.775, -78.6336), date, params);
  expect(moment(p.fajr).tz('America/New_York').format('h:mm A')).toBe(
    '5:35 AM',
  );
  expect(moment(p.sunrise).tz('America/New_York').format('h:mm A')).toBe(
    '7:06 AM',
  );
  expect(moment(p.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
    '12:05 PM',
  );
  expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe('2:42 PM');
  expect(moment(p.maghrib).tz('America/New_York').format('h:mm A')).toBe(
    '5:01 PM',
  );
  expect(moment(p.isha).tz('America/New_York').format('h:mm A')).toBe(
    '6:26 PM',
  );

  params.adjustments.fajr = 10;
  params.adjustments.sunrise = 10;
  params.adjustments.dhuhr = 10;
  params.adjustments.asr = 10;
  params.adjustments.maghrib = 10;
  params.adjustments.isha = 10;

  const p2 = new PrayerTimes(new Coordinates(35.775, -78.6336), date, params);
  expect(moment(p2.fajr).tz('America/New_York').format('h:mm A')).toBe(
    '5:45 AM',
  );
  expect(moment(p2.sunrise).tz('America/New_York').format('h:mm A')).toBe(
    '7:16 AM',
  );
  expect(moment(p2.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
    '12:15 PM',
  );
  expect(moment(p2.asr).tz('America/New_York').format('h:mm A')).toBe(
    '2:52 PM',
  );
  expect(moment(p2.maghrib).tz('America/New_York').format('h:mm A')).toBe(
    '5:11 PM',
  );
  expect(moment(p2.isha).tz('America/New_York').format('h:mm A')).toBe(
    '6:36 PM',
  );
});

test('calculating prayer times using the Moonsighting Committee calculation method', () => {
  // Values from http://www.moonsighting.com/pray.php
  const date = new Date(2016, 0, 31);
  const p = new PrayerTimes(
    new Coordinates(35.775, -78.6336),
    date,
    CalculationMethod.MoonsightingCommittee(),
  );
  expect(moment(p.fajr).tz('America/New_York').format('h:mm A')).toBe(
    '5:48 AM',
  );
  expect(moment(p.sunrise).tz('America/New_York').format('h:mm A')).toBe(
    '7:16 AM',
  );
  expect(moment(p.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
    '12:33 PM',
  );
  expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe('3:20 PM');
  expect(moment(p.maghrib).tz('America/New_York').format('h:mm A')).toBe(
    '5:43 PM',
  );
  expect(moment(p.isha).tz('America/New_York').format('h:mm A')).toBe(
    '7:05 PM',
  );
});

test('calculating Moonsighting Committee prayer times at a high latitude location', () => {
  // Values from http://www.moonsighting.com/pray.php
  const date = new Date(2016, 0, 1);
  const params = CalculationMethod.MoonsightingCommittee();
  params.madhab = Madhab.Hanafi;
  const p = new PrayerTimes(new Coordinates(59.9094, 10.7349), date, params);
  expect(moment(p.fajr).tz('Europe/Oslo').format('h:mm A')).toBe('7:34 AM');
  expect(moment(p.sunrise).tz('Europe/Oslo').format('h:mm A')).toBe('9:19 AM');
  expect(moment(p.dhuhr).tz('Europe/Oslo').format('h:mm A')).toBe('12:25 PM');
  expect(moment(p.asr).tz('Europe/Oslo').format('h:mm A')).toBe('1:36 PM');
  expect(moment(p.maghrib).tz('Europe/Oslo').format('h:mm A')).toBe('3:25 PM');
  expect(moment(p.isha).tz('Europe/Oslo').format('h:mm A')).toBe('5:02 PM');
});

test('getting the time for a given prayer', () => {
  const date = new Date(2016, 6, 1);
  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = Madhab.Hanafi;
  params.highLatitudeRule = HighLatitudeRule.TwilightAngle;
  const p = new PrayerTimes(new Coordinates(59.9094, 10.7349), date, params);
  expect(p.timeForPrayer(Prayer.Fajr)).toBe(p.fajr);
  expect(p.timeForPrayer(Prayer.Sunrise)).toBe(p.sunrise);
  expect(p.timeForPrayer(Prayer.Dhuhr)).toBe(p.dhuhr);
  expect(p.timeForPrayer(Prayer.Asr)).toBe(p.asr);
  expect(p.timeForPrayer(Prayer.Maghrib)).toBe(p.maghrib);
  expect(p.timeForPrayer(Prayer.Isha)).toBe(p.isha);
  expect(p.timeForPrayer(Prayer.None)).toBeNull();
});

test('getting the current prayer', () => {
  const date = new Date(2015, 8, 1);
  const params = CalculationMethod.Karachi();
  params.madhab = Madhab.Hanafi;
  params.highLatitudeRule = HighLatitudeRule.TwilightAngle;
  const p = new PrayerTimes(
    new Coordinates(33.720817, 73.090032),
    date,
    params,
  );
  expect(p.currentPrayer(dateByAddingSeconds(p.fajr, -1))).toBe(Prayer.None);
  expect(p.currentPrayer(p.fajr)).toBe(Prayer.Fajr);
  expect(p.currentPrayer(dateByAddingSeconds(p.fajr, 1))).toBe(Prayer.Fajr);
  expect(p.currentPrayer(dateByAddingSeconds(p.sunrise, 1))).toBe(
    Prayer.Sunrise,
  );
  expect(p.currentPrayer(dateByAddingSeconds(p.dhuhr, 1))).toBe(Prayer.Dhuhr);
  expect(p.currentPrayer(dateByAddingSeconds(p.asr, 1))).toBe(Prayer.Asr);
  expect(p.currentPrayer(dateByAddingSeconds(p.maghrib, 1))).toBe(
    Prayer.Maghrib,
  );
  expect(p.currentPrayer(dateByAddingSeconds(p.isha, 1))).toBe(Prayer.Isha);
});

test('getting the next prayer', () => {
  const date = new Date(2015, 8, 1);
  const params = CalculationMethod.Karachi();
  params.madhab = Madhab.Hanafi;
  params.highLatitudeRule = HighLatitudeRule.TwilightAngle;
  const p = new PrayerTimes(
    new Coordinates(33.720817, 73.090032),
    date,
    params,
  );
  expect(p.nextPrayer(dateByAddingSeconds(p.fajr, -1))).toBe(Prayer.Fajr);
  expect(p.nextPrayer(p.fajr)).toBe(Prayer.Sunrise);
  expect(p.nextPrayer(dateByAddingSeconds(p.fajr, 1))).toBe(Prayer.Sunrise);
  expect(p.nextPrayer(dateByAddingSeconds(p.sunrise, 1))).toBe(Prayer.Dhuhr);
  expect(p.nextPrayer(dateByAddingSeconds(p.dhuhr, 1))).toBe(Prayer.Asr);
  expect(p.nextPrayer(dateByAddingSeconds(p.asr, 1))).toBe(Prayer.Maghrib);
  expect(p.nextPrayer(dateByAddingSeconds(p.maghrib, 1))).toBe(Prayer.Isha);
  expect(p.nextPrayer(dateByAddingSeconds(p.isha, 1))).toBe(Prayer.None);
});

test('getting the current next prayer', () => {
  const date = new Date();
  const params = CalculationMethod.Karachi();
  params.madhab = Madhab.Hanafi;
  params.highLatitudeRule = HighLatitudeRule.TwilightAngle;
  const p = new PrayerTimes(
    new Coordinates(33.720817, 73.090032),
    date,
    params,
  );
  const current = p.currentPrayer();
  const next = p.nextPrayer();
  expect(current !== 'none' || next !== 'none').toBeTruthy();
});
