/* eslint-disable max-lines */
import adhan from '../src/Adhan';
import moment from 'moment-timezone';
import { dateByAddingSeconds, isValidDate } from '../src/DateUtils';
import { shadowLength } from '../src/Madhab';
import * as polarCircleResolver from '../src/PolarCircleResolution';
import { Shafaq } from '../src/Shafaq';

test('Verifying the night portion defined by the high latitude rule', () => {
  const p1 = new adhan.CalculationParameters('Other', 18, 18);
  p1.highLatitudeRule = adhan.HighLatitudeRule.MiddleOfTheNight;
  expect(p1.nightPortions().fajr).toBe(0.5);
  expect(p1.nightPortions().isha).toBe(0.5);

  const p2 = new adhan.CalculationParameters('Other', 18, 18);
  p2.highLatitudeRule = adhan.HighLatitudeRule.SeventhOfTheNight;
  expect(p2.nightPortions().fajr).toBe(1 / 7);
  expect(p2.nightPortions().isha).toBe(1 / 7);

  const p3 = new adhan.CalculationParameters('Other', 10, 15);
  p3.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
  expect(p3.nightPortions().fajr).toBe(10 / 60);
  expect(p3.nightPortions().isha).toBe(15 / 60);

  const p4 = new adhan.CalculationParameters('Other', 10, 15);
  p4.highLatitudeRule = adhan.HighLatitudeRule.fake;
  expect(() => {
    p4.nightPortions().fajr;
  }).toThrow();
  expect(() => {
    p4.nightPortions().isha;
  }).toThrow();
});

test('Verifying the angles defined by the calculation method', () => {
  const p1 = adhan.CalculationMethod.MuslimWorldLeague();
  expect(p1.fajrAngle).toBe(18);
  expect(p1.ishaAngle).toBe(17);
  expect(p1.ishaInterval).toBe(0);
  expect(p1.method).toBe('MuslimWorldLeague');

  const p2 = adhan.CalculationMethod.Egyptian();
  expect(p2.fajrAngle).toBe(19.5);
  expect(p2.ishaAngle).toBe(17.5);
  expect(p2.ishaInterval).toBe(0);
  expect(p2.method).toBe('Egyptian');

  const p3 = adhan.CalculationMethod.Karachi();
  expect(p3.fajrAngle).toBe(18);
  expect(p3.ishaAngle).toBe(18);
  expect(p3.ishaInterval).toBe(0);
  expect(p3.method).toBe('Karachi');

  const p4 = adhan.CalculationMethod.UmmAlQura();
  expect(p4.fajrAngle).toBe(18.5);
  expect(p4.ishaAngle).toBe(0);
  expect(p4.ishaInterval).toBe(90);
  expect(p4.method).toBe('UmmAlQura');

  const p5 = adhan.CalculationMethod.Dubai();
  expect(p5.fajrAngle).toBe(18.2);
  expect(p5.ishaAngle).toBe(18.2);
  expect(p5.ishaInterval).toBe(0);
  expect(p5.method).toBe('Dubai');

  const p6 = adhan.CalculationMethod.MoonsightingCommittee();
  expect(p6.fajrAngle).toBe(18);
  expect(p6.ishaAngle).toBe(18);
  expect(p6.ishaInterval).toBe(0);
  expect(p6.method).toBe('MoonsightingCommittee');

  const p7 = adhan.CalculationMethod.NorthAmerica();
  expect(p7.fajrAngle).toBe(15);
  expect(p7.ishaAngle).toBe(15);
  expect(p7.ishaInterval).toBe(0);
  expect(p7.method).toBe('NorthAmerica');

  const p8 = adhan.CalculationMethod.Other();
  expect(p8.fajrAngle).toBe(0);
  expect(p8.ishaAngle).toBe(0);
  expect(p8.ishaInterval).toBe(0);
  expect(p8.method).toBe('Other');

  const p9 = adhan.CalculationMethod.Kuwait();
  expect(p9.fajrAngle).toBe(18);
  expect(p9.ishaAngle).toBe(17.5);
  expect(p9.ishaInterval).toBe(0);
  expect(p9.method).toBe('Kuwait');

  const p10 = adhan.CalculationMethod.Qatar();
  expect(p10.fajrAngle).toBe(18);
  expect(p10.ishaAngle).toBe(0);
  expect(p10.ishaInterval).toBe(90);
  expect(p10.method).toBe('Qatar');

  const p11 = adhan.CalculationMethod.Singapore();
  expect(p11.fajrAngle).toBe(20);
  expect(p11.ishaAngle).toBe(18);
  expect(p11.ishaInterval).toBe(0);
  expect(p11.method).toBe('Singapore');

  const p12 = adhan.CalculationMethod.Tehran();
  expect(p12.fajrAngle).toBe(17.7);
  expect(p12.ishaAngle).toBe(14);
  expect(p12.ishaInterval).toBe(0);
  expect(p12.method).toBe('Tehran');

  const p13 = adhan.CalculationMethod.Turkey();
  expect(p13.fajrAngle).toBe(18);
  expect(p13.ishaAngle).toBe(17);
  expect(p13.ishaInterval).toBe(0);
  expect(p13.method).toBe('Turkey');

  const p14 = new adhan.CalculationParameters(null, 18, 17);
  expect(p14.fajrAngle).toBe(18);
  expect(p14.ishaAngle).toBe(17);
  expect(p14.ishaInterval).toBe(0);
  expect(p14.method).toBe('Other');
});

test('calculating prayer times', () => {
  const date = new Date(2015, 6, 12);
  const params = adhan.CalculationMethod.NorthAmerica();
  params.madhab = adhan.Madhab.Hanafi;
  const p = new adhan.PrayerTimes(
    new adhan.Coordinates(35.775, -78.6336),
    date,
    params,
  );

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

test('using offsets to manually adjust prayer times', () => {
  const date = new Date(2015, 11, 1);
  const params = adhan.CalculationMethod.MuslimWorldLeague();
  params.madhab = adhan.Madhab.Shafi;
  const p = new adhan.PrayerTimes(
    new adhan.Coordinates(35.775, -78.6336),
    date,
    params,
  );
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

  const p2 = new adhan.PrayerTimes(
    new adhan.Coordinates(35.775, -78.6336),
    date,
    params,
  );
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
  const p = new adhan.PrayerTimes(
    new adhan.Coordinates(35.775, -78.6336),
    date,
    adhan.CalculationMethod.MoonsightingCommittee(),
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
  const params = adhan.CalculationMethod.MoonsightingCommittee();
  params.madhab = adhan.Madhab.Hanafi;
  const p = new adhan.PrayerTimes(
    new adhan.Coordinates(59.9094, 10.7349),
    date,
    params,
  );
  expect(moment(p.fajr).tz('Europe/Oslo').format('h:mm A')).toBe('7:34 AM');
  expect(moment(p.sunrise).tz('Europe/Oslo').format('h:mm A')).toBe('9:19 AM');
  expect(moment(p.dhuhr).tz('Europe/Oslo').format('h:mm A')).toBe('12:25 PM');
  expect(moment(p.asr).tz('Europe/Oslo').format('h:mm A')).toBe('1:36 PM');
  expect(moment(p.maghrib).tz('Europe/Oslo').format('h:mm A')).toBe('3:25 PM');
  expect(moment(p.isha).tz('Europe/Oslo').format('h:mm A')).toBe('5:02 PM');
});

test('calculating times for turkey method', () => {
  // values from https://namazvakitleri.diyanet.gov.tr/en-US/9541/prayer-time-for-istanbul
  const date = new Date(2020, 3, 16);
  const params = adhan.CalculationMethod.Turkey();
  const p = new adhan.PrayerTimes(
    new adhan.Coordinates(41.005616, 28.97638),
    date,
    params,
  );
  expect(moment(p.fajr).tz('Europe/Istanbul').format('h:mm A')).toBe('4:44 AM');
  expect(moment(p.sunrise).tz('Europe/Istanbul').format('h:mm A')).toBe(
    '6:16 AM',
  );
  expect(moment(p.dhuhr).tz('Europe/Istanbul').format('h:mm A')).toBe(
    '1:09 PM',
  );
  expect(moment(p.asr).tz('Europe/Istanbul').format('h:mm A')).toBe('4:53 PM'); // original time 4:52 PM
  expect(moment(p.maghrib).tz('Europe/Istanbul').format('h:mm A')).toBe(
    '7:52 PM',
  );
  expect(moment(p.isha).tz('Europe/Istanbul').format('h:mm A')).toBe('9:19 PM'); // original time 9:18 PM
});

test('calculating times for the egyptian method', () => {
  const date = new Date(2020, 0, 1);
  const params = adhan.CalculationMethod.Egyptian();
  const p = new adhan.PrayerTimes(
    new adhan.Coordinates(30.028703, 31.249528),
    date,
    params,
  );
  expect(moment(p.fajr).tz('Africa/Cairo').format('h:mm A')).toBe('5:18 AM');
  expect(moment(p.sunrise).tz('Africa/Cairo').format('h:mm A')).toBe('6:51 AM');
  expect(moment(p.dhuhr).tz('Africa/Cairo').format('h:mm A')).toBe('11:59 AM');
  expect(moment(p.asr).tz('Africa/Cairo').format('h:mm A')).toBe('2:47 PM');
  expect(moment(p.maghrib).tz('Africa/Cairo').format('h:mm A')).toBe('5:06 PM');
  expect(moment(p.isha).tz('Africa/Cairo').format('h:mm A')).toBe('6:29 PM');
});

test('calculating times for the singapore method', () => {
  const date = new Date(2021, 5, 14);
  const params = adhan.CalculationMethod.Singapore();
  const p = new adhan.PrayerTimes(
    new adhan.Coordinates(3.7333333333, 101.3833333333),
    date,
    params,
  );
  expect(moment(p.fajr).tz('Asia/Kuala_Lumpur').format('h:mm A')).toBe(
    '5:41 AM',
  );
  expect(moment(p.sunrise).tz('Asia/Kuala_Lumpur').format('h:mm A')).toBe(
    '7:05 AM',
  );
  expect(moment(p.dhuhr).tz('Asia/Kuala_Lumpur').format('h:mm A')).toBe(
    '1:16 PM',
  );
  expect(moment(p.asr).tz('Asia/Kuala_Lumpur').format('h:mm A')).toBe(
    '4:42 PM',
  );
  expect(moment(p.maghrib).tz('Asia/Kuala_Lumpur').format('h:mm A')).toBe(
    '7:25 PM',
  );
  expect(moment(p.isha).tz('Asia/Kuala_Lumpur').format('h:mm A')).toBe(
    '8:41 PM',
  );
});

test('getting the time for a given prayer', () => {
  const date = new Date(2016, 6, 1);
  const params = adhan.CalculationMethod.MuslimWorldLeague();
  params.madhab = adhan.Madhab.Hanafi;
  params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
  const p = new adhan.PrayerTimes(
    new adhan.Coordinates(59.9094, 10.7349),
    date,
    params,
  );
  expect(p.timeForPrayer(adhan.Prayer.Fajr)).toBe(p.fajr);
  expect(p.timeForPrayer(adhan.Prayer.Sunrise)).toBe(p.sunrise);
  expect(p.timeForPrayer(adhan.Prayer.Dhuhr)).toBe(p.dhuhr);
  expect(p.timeForPrayer(adhan.Prayer.Asr)).toBe(p.asr);
  expect(p.timeForPrayer(adhan.Prayer.Maghrib)).toBe(p.maghrib);
  expect(p.timeForPrayer(adhan.Prayer.Isha)).toBe(p.isha);
  expect(p.timeForPrayer(adhan.Prayer.None)).toBe(null);
});

test('getting the current prayer', () => {
  const date = new Date(2015, 8, 1);
  const params = adhan.CalculationMethod.Karachi();
  params.madhab = adhan.Madhab.Hanafi;
  params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
  const p = new adhan.PrayerTimes(
    new adhan.Coordinates(33.720817, 73.090032),
    date,
    params,
  );
  expect(p.currentPrayer(dateByAddingSeconds(p.fajr, -1))).toBe(
    adhan.Prayer.None,
  );
  expect(p.currentPrayer(p.fajr)).toBe(adhan.Prayer.Fajr);
  expect(p.currentPrayer(dateByAddingSeconds(p.fajr, 1))).toBe(
    adhan.Prayer.Fajr,
  );
  expect(p.currentPrayer(dateByAddingSeconds(p.sunrise, 1))).toBe(
    adhan.Prayer.Sunrise,
  );
  expect(p.currentPrayer(dateByAddingSeconds(p.dhuhr, 1))).toBe(
    adhan.Prayer.Dhuhr,
  );
  expect(p.currentPrayer(dateByAddingSeconds(p.asr, 1))).toBe(adhan.Prayer.Asr);
  expect(p.currentPrayer(dateByAddingSeconds(p.maghrib, 1))).toBe(
    adhan.Prayer.Maghrib,
  );
  expect(p.currentPrayer(dateByAddingSeconds(p.isha, 1))).toBe(
    adhan.Prayer.Isha,
  );
});

test('changing the time for asr with different madhabs', () => {
  const date = new Date(2015, 11, 1);
  const params = adhan.CalculationMethod.MuslimWorldLeague();
  params.madhab = adhan.Madhab.Shafi;
  const p = new adhan.PrayerTimes(
    new adhan.Coordinates(35.775, -78.6336),
    date,
    params,
  );
  expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe('2:42 PM');

  params.madhab = adhan.Madhab.Hanafi;

  const p2 = new adhan.PrayerTimes(
    new adhan.Coordinates(35.775, -78.6336),
    date,
    params,
  );
  expect(moment(p2.asr).tz('America/New_York').format('h:mm A')).toBe(
    '3:22 PM',
  );
});

test('getting the next prayer', () => {
  const date = new Date(2015, 8, 1);
  const params = adhan.CalculationMethod.Karachi();
  params.madhab = adhan.Madhab.Hanafi;
  params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
  const p = new adhan.PrayerTimes(
    new adhan.Coordinates(33.720817, 73.090032),
    date,
    params,
  );
  expect(p.nextPrayer(dateByAddingSeconds(p.fajr, -1))).toBe(adhan.Prayer.Fajr);
  expect(p.nextPrayer(p.fajr)).toBe(adhan.Prayer.Sunrise);
  expect(p.nextPrayer(dateByAddingSeconds(p.fajr, 1))).toBe(
    adhan.Prayer.Sunrise,
  );
  expect(p.nextPrayer(dateByAddingSeconds(p.sunrise, 1))).toBe(
    adhan.Prayer.Dhuhr,
  );
  expect(p.nextPrayer(dateByAddingSeconds(p.dhuhr, 1))).toBe(adhan.Prayer.Asr);
  expect(p.nextPrayer(dateByAddingSeconds(p.asr, 1))).toBe(
    adhan.Prayer.Maghrib,
  );
  expect(p.nextPrayer(dateByAddingSeconds(p.maghrib, 1))).toBe(
    adhan.Prayer.Isha,
  );
  expect(p.nextPrayer(dateByAddingSeconds(p.isha, 1))).toBe(adhan.Prayer.None);
});

test('getting the current next prayer', () => {
  const date = new Date();
  const params = adhan.CalculationMethod.Karachi();
  params.madhab = adhan.Madhab.Hanafi;
  params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
  const p = new adhan.PrayerTimes(
    new adhan.Coordinates(33.720817, 73.090032),
    date,
    params,
  );
  const current = p.currentPrayer();
  const next = p.nextPrayer();
  expect(current != null || next != null).toBeTruthy();
});

test('getting the madhab shadow length', () => {
  expect(shadowLength(adhan.Madhab.Shafi)).toBe(1);
  expect(shadowLength(adhan.Madhab.Hanafi)).toBe(2);
  expect(() => {
    shadowLength(adhan.Madhab.Foo);
  }).toThrow();
});

test('adjusting prayer time with high latitude rule', () => {
  const date = new Date(2020, 5, 15);
  const params = adhan.CalculationMethod.MuslimWorldLeague();
  const tzid = 'Europe/London';
  const coords = new adhan.Coordinates(55.983226, -3.216649);

  const p1 = new adhan.PrayerTimes(coords, date, params);
  expect(moment(p1.fajr).tz(tzid).format('h:mm A')).toBe('1:14 AM');
  expect(moment(p1.sunrise).tz(tzid).format('h:mm A')).toBe('4:26 AM');
  expect(moment(p1.dhuhr).tz(tzid).format('h:mm A')).toBe('1:14 PM');
  expect(moment(p1.asr).tz(tzid).format('h:mm A')).toBe('5:46 PM');
  expect(moment(p1.maghrib).tz(tzid).format('h:mm A')).toBe('10:01 PM');
  expect(moment(p1.isha).tz(tzid).format('h:mm A')).toBe('1:14 AM');

  params.highLatitudeRule = adhan.HighLatitudeRule.SeventhOfTheNight;
  const p2 = new adhan.PrayerTimes(coords, date, params);
  expect(moment(p2.fajr).tz(tzid).format('h:mm A')).toBe('3:31 AM');
  expect(moment(p2.sunrise).tz(tzid).format('h:mm A')).toBe('4:26 AM');
  expect(moment(p2.dhuhr).tz(tzid).format('h:mm A')).toBe('1:14 PM');
  expect(moment(p2.asr).tz(tzid).format('h:mm A')).toBe('5:46 PM');
  expect(moment(p2.maghrib).tz(tzid).format('h:mm A')).toBe('10:01 PM');
  expect(moment(p2.isha).tz(tzid).format('h:mm A')).toBe('10:56 PM');

  params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
  const p3 = new adhan.PrayerTimes(coords, date, params);
  expect(moment(p3.fajr).tz(tzid).format('h:mm A')).toBe('2:31 AM');
  expect(moment(p3.sunrise).tz(tzid).format('h:mm A')).toBe('4:26 AM');
  expect(moment(p3.dhuhr).tz(tzid).format('h:mm A')).toBe('1:14 PM');
  expect(moment(p3.asr).tz(tzid).format('h:mm A')).toBe('5:46 PM');
  expect(moment(p3.maghrib).tz(tzid).format('h:mm A')).toBe('10:01 PM');
  expect(moment(p3.isha).tz(tzid).format('h:mm A')).toBe('11:50 PM');
});

test('getting recommended high latitude rule', () => {
  const coords1 = new adhan.Coordinates(45.983226, -3.216649);
  expect(adhan.HighLatitudeRule.recommended(coords1)).toBe(
    adhan.HighLatitudeRule.MiddleOfTheNight,
  );

  const coords2 = new adhan.Coordinates(48.983226, -3.216649);
  expect(adhan.HighLatitudeRule.recommended(coords2)).toBe(
    adhan.HighLatitudeRule.SeventhOfTheNight,
  );
});

describe('Moonsighting Committee method with shafaq general', () => {
  // Values from http://www.moonsighting.com/pray.php
  test('Shafaq general in winter', () => {
    const date = new Date(2021, 0, 1);
    const params = adhan.CalculationMethod.MoonsightingCommittee();
    params.shafaq = Shafaq.General;
    params.madhab = adhan.Madhab.Hanafi;
    const p = new adhan.PrayerTimes(
      new adhan.Coordinates(43.494, -79.844),
      date,
      params,
    );
    expect(moment(p.fajr).tz('America/New_York').format('h:mm A')).toBe(
      '6:16 AM',
    );
    expect(moment(p.sunrise).tz('America/New_York').format('h:mm A')).toBe(
      '7:52 AM',
    );
    expect(moment(p.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
      '12:28 PM',
    );
    expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe(
      '3:12 PM',
    );
    expect(moment(p.maghrib).tz('America/New_York').format('h:mm A')).toBe(
      '4:57 PM',
    );
    expect(moment(p.isha).tz('America/New_York').format('h:mm A')).toBe(
      '6:27 PM',
    );
  });

  test('Shafaq general in Spring', () => {
    const date = new Date(2021, 3, 1);
    const params = adhan.CalculationMethod.MoonsightingCommittee();
    params.shafaq = Shafaq.General;
    params.madhab = adhan.Madhab.Hanafi;
    const p = new adhan.PrayerTimes(
      new adhan.Coordinates(43.494, -79.844),
      date,
      params,
    );
    expect(moment(p.fajr).tz('America/New_York').format('h:mm A')).toBe(
      '5:28 AM',
    );
    expect(moment(p.sunrise).tz('America/New_York').format('h:mm A')).toBe(
      '7:01 AM',
    );
    expect(moment(p.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
      '1:28 PM',
    );
    expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe(
      '5:53 PM',
    );
    expect(moment(p.maghrib).tz('America/New_York').format('h:mm A')).toBe(
      '7:49 PM',
    );
    expect(moment(p.isha).tz('America/New_York').format('h:mm A')).toBe(
      '9:01 PM',
    );
  });

  test('Shafaq general in Summer', () => {
    const date = new Date(2021, 6, 1);
    const params = adhan.CalculationMethod.MoonsightingCommittee();
    params.shafaq = Shafaq.General;
    params.madhab = adhan.Madhab.Hanafi;
    const p = new adhan.PrayerTimes(
      new adhan.Coordinates(43.494, -79.844),
      date,
      params,
    );
    expect(moment(p.fajr).tz('America/New_York').format('h:mm A')).toBe(
      '3:52 AM',
    );
    expect(moment(p.sunrise).tz('America/New_York').format('h:mm A')).toBe(
      '5:42 AM',
    );
    expect(moment(p.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
      '1:28 PM',
    );
    expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe(
      '6:42 PM',
    );
    expect(moment(p.maghrib).tz('America/New_York').format('h:mm A')).toBe(
      '9:07 PM',
    );
    expect(moment(p.isha).tz('America/New_York').format('h:mm A')).toBe(
      '10:22 PM',
    );
  });

  test('Shafaq general in Fall', () => {
    const date = new Date(2021, 10, 1);
    const params = adhan.CalculationMethod.MoonsightingCommittee();
    params.shafaq = Shafaq.General;
    params.madhab = adhan.Madhab.Hanafi;
    const p = new adhan.PrayerTimes(
      new adhan.Coordinates(43.494, -79.844),
      date,
      params,
    );
    expect(moment(p.fajr).tz('America/New_York').format('h:mm A')).toBe(
      '6:22 AM',
    );
    expect(moment(p.sunrise).tz('America/New_York').format('h:mm A')).toBe(
      '7:55 AM',
    );
    expect(moment(p.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
      '1:08 PM',
    );
    expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe(
      '4:26 PM',
    );
    expect(moment(p.maghrib).tz('America/New_York').format('h:mm A')).toBe(
      '6:13 PM',
    );
    expect(moment(p.isha).tz('America/New_York').format('h:mm A')).toBe(
      '7:35 PM',
    );
  });
});

describe('Moonsighting Committee method with shafaq ahmer', () => {
  // Values from http://www.moonsighting.com/pray.php
  test('Shafaq ahmer in winter', () => {
    const date = new Date(2021, 0, 1);
    const params = adhan.CalculationMethod.MoonsightingCommittee();
    params.shafaq = Shafaq.Ahmer;
    const p = new adhan.PrayerTimes(
      new adhan.Coordinates(43.494, -79.844),
      date,
      params,
    );
    expect(moment(p.fajr).tz('America/New_York').format('h:mm A')).toBe(
      '6:16 AM',
    );
    expect(moment(p.sunrise).tz('America/New_York').format('h:mm A')).toBe(
      '7:52 AM',
    );
    expect(moment(p.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
      '12:28 PM',
    );
    expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe(
      '2:37 PM',
    );
    expect(moment(p.maghrib).tz('America/New_York').format('h:mm A')).toBe(
      '4:57 PM',
    );
    expect(moment(p.isha).tz('America/New_York').format('h:mm A')).toBe(
      '6:07 PM',
    ); // value from source is 6:08 PM
  });

  test('Shafaq ahmer in Spring', () => {
    const date = new Date(2021, 3, 1);
    const params = adhan.CalculationMethod.MoonsightingCommittee();
    params.shafaq = Shafaq.Ahmer;
    const p = new adhan.PrayerTimes(
      new adhan.Coordinates(43.494, -79.844),
      date,
      params,
    );
    expect(moment(p.fajr).tz('America/New_York').format('h:mm A')).toBe(
      '5:28 AM',
    );
    expect(moment(p.sunrise).tz('America/New_York').format('h:mm A')).toBe(
      '7:01 AM',
    );
    expect(moment(p.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
      '1:28 PM',
    );
    expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe(
      '4:59 PM',
    );
    expect(moment(p.maghrib).tz('America/New_York').format('h:mm A')).toBe(
      '7:49 PM',
    );
    expect(moment(p.isha).tz('America/New_York').format('h:mm A')).toBe(
      '8:45 PM',
    );
  });

  test('Shafaq ahmer in Summer', () => {
    const date = new Date(2021, 6, 1);
    const params = adhan.CalculationMethod.MoonsightingCommittee();
    params.shafaq = Shafaq.Ahmer;
    const p = new adhan.PrayerTimes(
      new adhan.Coordinates(43.494, -79.844),
      date,
      params,
    );
    expect(moment(p.fajr).tz('America/New_York').format('h:mm A')).toBe(
      '3:52 AM',
    );
    expect(moment(p.sunrise).tz('America/New_York').format('h:mm A')).toBe(
      '5:42 AM',
    );
    expect(moment(p.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
      '1:28 PM',
    );
    expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe(
      '5:29 PM',
    );
    expect(moment(p.maghrib).tz('America/New_York').format('h:mm A')).toBe(
      '9:07 PM',
    );
    expect(moment(p.isha).tz('America/New_York').format('h:mm A')).toBe(
      '10:19 PM',
    );
  });

  test('Shafaq ahmer in Fall', () => {
    const date = new Date(2021, 10, 1);
    const params = adhan.CalculationMethod.MoonsightingCommittee();
    params.shafaq = Shafaq.Ahmer;
    const p = new adhan.PrayerTimes(
      new adhan.Coordinates(43.494, -79.844),
      date,
      params,
    );
    expect(moment(p.fajr).tz('America/New_York').format('h:mm A')).toBe(
      '6:22 AM',
    );
    expect(moment(p.sunrise).tz('America/New_York').format('h:mm A')).toBe(
      '7:55 AM',
    );
    expect(moment(p.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
      '1:08 PM',
    );
    expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe(
      '3:45 PM',
    );
    expect(moment(p.maghrib).tz('America/New_York').format('h:mm A')).toBe(
      '6:13 PM',
    );
    expect(moment(p.isha).tz('America/New_York').format('h:mm A')).toBe(
      '7:15 PM',
    );
  });
});

describe('Moonsighting Committee method with shafaq abyad', () => {
  // Values from http://www.moonsighting.com/pray.php
  test('Shafaq abyad in winter', () => {
    const date = new Date(2021, 0, 1);
    const params = adhan.CalculationMethod.MoonsightingCommittee();
    params.shafaq = Shafaq.Abyad;
    params.madhab = adhan.Madhab.Hanafi;
    const p = new adhan.PrayerTimes(
      new adhan.Coordinates(43.494, -79.844),
      date,
      params,
    );
    expect(moment(p.fajr).tz('America/New_York').format('h:mm A')).toBe(
      '6:16 AM',
    );
    expect(moment(p.sunrise).tz('America/New_York').format('h:mm A')).toBe(
      '7:52 AM',
    );
    expect(moment(p.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
      '12:28 PM',
    );
    expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe(
      '3:12 PM',
    );
    expect(moment(p.maghrib).tz('America/New_York').format('h:mm A')).toBe(
      '4:57 PM',
    );
    expect(moment(p.isha).tz('America/New_York').format('h:mm A')).toBe(
      '6:28 PM',
    );
  });

  test('Shafaq abyad in Spring', () => {
    const date = new Date(2021, 3, 1);
    const params = adhan.CalculationMethod.MoonsightingCommittee();
    params.shafaq = Shafaq.Abyad;
    params.madhab = adhan.Madhab.Hanafi;
    const p = new adhan.PrayerTimes(
      new adhan.Coordinates(43.494, -79.844),
      date,
      params,
    );
    expect(moment(p.fajr).tz('America/New_York').format('h:mm A')).toBe(
      '5:28 AM',
    );
    expect(moment(p.sunrise).tz('America/New_York').format('h:mm A')).toBe(
      '7:01 AM',
    );
    expect(moment(p.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
      '1:28 PM',
    );
    expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe(
      '5:53 PM',
    );
    expect(moment(p.maghrib).tz('America/New_York').format('h:mm A')).toBe(
      '7:49 PM',
    );
    expect(moment(p.isha).tz('America/New_York').format('h:mm A')).toBe(
      '9:12 PM',
    );
  });

  test('Shafaq abyad in Summer', () => {
    const date = new Date(2021, 6, 1);
    const params = adhan.CalculationMethod.MoonsightingCommittee();
    params.shafaq = Shafaq.Abyad;
    params.madhab = adhan.Madhab.Hanafi;
    const p = new adhan.PrayerTimes(
      new adhan.Coordinates(43.494, -79.844),
      date,
      params,
    );
    expect(moment(p.fajr).tz('America/New_York').format('h:mm A')).toBe(
      '3:52 AM',
    );
    expect(moment(p.sunrise).tz('America/New_York').format('h:mm A')).toBe(
      '5:42 AM',
    );
    expect(moment(p.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
      '1:28 PM',
    );
    expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe(
      '6:42 PM',
    );
    expect(moment(p.maghrib).tz('America/New_York').format('h:mm A')).toBe(
      '9:07 PM',
    );
    expect(moment(p.isha).tz('America/New_York').format('h:mm A')).toBe(
      '11:17 PM',
    );
  });

  test('Shafaq abyad in Fall', () => {
    const date = new Date(2021, 10, 1);
    const params = adhan.CalculationMethod.MoonsightingCommittee();
    params.shafaq = Shafaq.Abyad;
    params.madhab = adhan.Madhab.Hanafi;
    const p = new adhan.PrayerTimes(
      new adhan.Coordinates(43.494, -79.844),
      date,
      params,
    );
    expect(moment(p.fajr).tz('America/New_York').format('h:mm A')).toBe(
      '6:22 AM',
    );
    expect(moment(p.sunrise).tz('America/New_York').format('h:mm A')).toBe(
      '7:55 AM',
    );
    expect(moment(p.dhuhr).tz('America/New_York').format('h:mm A')).toBe(
      '1:08 PM',
    );
    expect(moment(p.asr).tz('America/New_York').format('h:mm A')).toBe(
      '4:26 PM',
    );
    expect(moment(p.maghrib).tz('America/New_York').format('h:mm A')).toBe(
      '6:13 PM',
    );
    expect(moment(p.isha).tz('America/New_York').format('h:mm A')).toBe(
      '7:37 PM',
    );
  });
});

describe('Polar circle resolution cases', () => {
  const prayersToCheck = ['fajr', 'sunrise', 'maghrib', 'isha'];
  const regularDate = new Date(2020, 4, 15, 20, 0, 0, 0);
  const dateAffectedByPolarNight = new Date(2020, 11, 21, 20, 0, 0, 0);
  const dateAffectedByMidnightSun = new Date(2020, 5, 21, 20, 0, 0, 0);
  const regularCoordinates = new adhan.Coordinates(31.947351, 35.227163);
  const ArjeplogSweden = new adhan.Coordinates(66.7222444, 17.7189);
  const AmundsenScottAntarctic = new adhan.Coordinates(-84.996, 0.01013);
  const unresolvedParams = adhan.CalculationMethod.MuslimWorldLeague();
  const aqrabBaladParams = adhan.CalculationMethod.MuslimWorldLeague();
  aqrabBaladParams.polarCircleResolution =
    adhan.PolarCircleResolution.AqrabBalad;
  const aqrabYaumParams = adhan.CalculationMethod.MuslimWorldLeague();
  aqrabYaumParams.polarCircleResolution = adhan.PolarCircleResolution.AqrabYaum;

  describe('Regular computation', () => {
    it('should not attempt to do any resolution if the resolver is set to unresolved', () => {
      const spy = jest.spyOn(polarCircleResolver, 'polarCircleResolvedValues');
      // eslint-disable-next-line no-unused-vars
      const prayersTimes1 = new adhan.PrayerTimes(
        ArjeplogSweden,
        dateAffectedByMidnightSun,
        unresolvedParams,
      );
      // eslint-disable-next-line no-unused-vars
      const prayersTimes2 = new adhan.PrayerTimes(
        ArjeplogSweden,
        dateAffectedByMidnightSun,
        unresolvedParams,
      );

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not attempt to do any resolution if the date is affected neither by the polar night nor by the midnight sun', () => {
      const spy = jest.spyOn(polarCircleResolver, 'polarCircleResolvedValues');
      // eslint-disable-next-line no-unused-vars
      const prayersTimes1 = new adhan.PrayerTimes(
        ArjeplogSweden,
        regularDate,
        aqrabBaladParams,
      );
      // eslint-disable-next-line no-unused-vars
      const prayersTimes2 = new adhan.PrayerTimes(
        ArjeplogSweden,
        regularDate,
        aqrabYaumParams,
      );

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not make any search if the location is outside the polar circles', () => {
      const spy = jest.spyOn(polarCircleResolver, 'polarCircleResolvedValues');
      // eslint-disable-next-line no-unused-vars
      const prayersTimes1 = new adhan.PrayerTimes(
        regularCoordinates,
        dateAffectedByPolarNight,
        aqrabBaladParams,
      );
      // eslint-disable-next-line no-unused-vars
      const prayersTimes2 = new adhan.PrayerTimes(
        regularCoordinates,
        dateAffectedByPolarNight,
        aqrabYaumParams,
      );

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Midnight Sun case', () => {
    it('should fail to compute targeted prayer times with the "unresolved" resolver', () => {
      const prayersTimes = new adhan.PrayerTimes(
        ArjeplogSweden,
        dateAffectedByMidnightSun,
        unresolvedParams,
      );

      prayersToCheck.forEach((prayerName) => {
        expect(isValidDate(prayersTimes[prayerName])).toEqual(false);
      });
    });

    it('should succeed in computing all prayers times with the "aqrabBalad" resolver', () => {
      const prayersTimes = new adhan.PrayerTimes(
        ArjeplogSweden,
        dateAffectedByMidnightSun,
        aqrabBaladParams,
      );

      prayersToCheck.forEach((prayerName) => {
        expect(isValidDate(prayersTimes[prayerName])).toEqual(true);
      });
    });

    it('should succeed in computing all prayers times with the "aqrabYaum" resolver', () => {
      const prayersTimes = new adhan.PrayerTimes(
        ArjeplogSweden,
        dateAffectedByMidnightSun,
        aqrabYaumParams,
      );

      prayersToCheck.forEach((prayerName) => {
        expect(isValidDate(prayersTimes[prayerName])).toEqual(true);
      });
    });
  });

  describe('Polar Night case', () => {
    it('should fail to compute targeted prayer times with the "unresolved" resolver', () => {
      const prayersTimes = new adhan.PrayerTimes(
        AmundsenScottAntarctic,
        dateAffectedByPolarNight,
        unresolvedParams,
      );

      prayersToCheck.forEach((prayerName) => {
        expect(isValidDate(prayersTimes[prayerName])).toEqual(false);
      });
    });

    it('should succeed in computing all prayers times with the "aqrabBalad" resolver', () => {
      const prayersTimes = new adhan.PrayerTimes(
        AmundsenScottAntarctic,
        dateAffectedByPolarNight,
        aqrabBaladParams,
      );

      prayersToCheck.forEach((prayerName) => {
        expect(isValidDate(prayersTimes[prayerName])).toEqual(true);
      });
    });

    it('should succeed in computing all prayers times with the "aqrabYaum" resolver', () => {
      const prayersTimes = new adhan.PrayerTimes(
        AmundsenScottAntarctic,
        dateAffectedByPolarNight,
        aqrabYaumParams,
      );

      prayersToCheck.forEach((prayerName) => {
        expect(isValidDate(prayersTimes[prayerName])).toEqual(true);
      });
    });

    test('calculating times for the polar circle', () => {
      const coordinates = new adhan.Coordinates(66.7222444, 17.7189);
      const params = adhan.CalculationMethod.MuslimWorldLeague();
      params.polarCircleResolution = adhan.PolarCircleResolution.AqrabYaum;
      params.highLatitudeRule = adhan.HighLatitudeRule.SeventhOfTheNight;
      const date = new Date(2020, 5, 21);

      const p = new adhan.PrayerTimes(coordinates, date, params);
      expect(
        moment(p.fajr).tz('Europe/Stockholm').format('MMMM DD, YYYY h:mm A'),
      ).toBe('June 21, 2020 12:40 AM');
      expect(
        moment(p.sunrise).tz('Europe/Stockholm').format('MMMM DD, YYYY h:mm A'),
      ).toBe('June 21, 2020 12:54 AM');
      expect(
        moment(p.dhuhr).tz('Europe/Stockholm').format('MMMM DD, YYYY h:mm A'),
      ).toBe('June 21, 2020 12:55 PM');
      expect(
        moment(p.asr).tz('Europe/Stockholm').format('MMMM DD, YYYY h:mm A'),
      ).toBe('June 21, 2020 5:49 PM');
      expect(
        moment(p.maghrib).tz('Europe/Stockholm').format('MMMM DD, YYYY h:mm A'),
      ).toBe('June 21, 2020 11:36 PM');
      expect(
        moment(p.isha).tz('Europe/Stockholm').format('MMMM DD, YYYY h:mm A'),
      ).toBe('June 21, 2020 11:51 PM');
    });
  });
});
