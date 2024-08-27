/* eslint-disable complexity */
import fs from 'fs';
import moment from 'moment-timezone';
import CalculationMethod from '../src/CalculationMethod';
import CalculationParameters from '../src/CalculationParameters';
import Coordinates from '../src/Coordinates';
import HighLatitudeRule from '../src/HighLatitudeRule';
import { Madhab } from '../src/Madhab';
import PrayerTimes from '../src/PrayerTimes';

function parseParams(data: {
  method: string;
  madhab: string;
  highLatitudeRule: string;
}) {
  let params: CalculationParameters;

  const method = data['method'];
  if (method === 'MuslimWorldLeague') {
    params = CalculationMethod.MuslimWorldLeague();
  } else if (method === 'Egyptian') {
    params = CalculationMethod.Egyptian();
  } else if (method === 'Karachi') {
    params = CalculationMethod.Karachi();
  } else if (method === 'UmmAlQura') {
    params = CalculationMethod.UmmAlQura();
  } else if (method === 'Dubai') {
    params = CalculationMethod.Dubai();
  } else if (method === 'MoonsightingCommittee') {
    params = CalculationMethod.MoonsightingCommittee();
  } else if (method === 'NorthAmerica') {
    params = CalculationMethod.NorthAmerica();
  } else if (method === 'Kuwait') {
    params = CalculationMethod.Kuwait();
  } else if (method === 'Qatar') {
    params = CalculationMethod.Qatar();
  } else if (method === 'Singapore') {
    params = CalculationMethod.Singapore();
  } else if (method === 'Turkey') {
    params = CalculationMethod.Turkey();
  } else if (method === 'Tehran') {
    params = CalculationMethod.Tehran();
  } else if (method === 'UnitedKingdom') {
    params = CalculationMethod.UnitedKingdom();
  } else {
    params = CalculationMethod.Other();
  }

  const madhab = data['madhab'];
  if (madhab === 'Shafi') {
    params.madhab = Madhab.Shafi;
  } else if (madhab === 'Hanafi') {
    params.madhab = Madhab.Hanafi;
  }

  const highLatRule = data['highLatitudeRule'];
  if (highLatRule === 'SeventhOfTheNight') {
    params.highLatitudeRule = HighLatitudeRule.SeventhOfTheNight;
  } else if (highLatRule === 'TwilightAngle') {
    params.highLatitudeRule = HighLatitudeRule.TwilightAngle;
  } else {
    params.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;
  }

  return params;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(comparisonDate: Date, variance: number): R;
    }
  }
}

expect.extend({
  toBeWithinRange(initialDate: Date, comparisonDate: Date, variance: number) {
    const initalValue = initialDate.getTime();
    const varianceValue = variance * 60 * 1000;
    const floor = comparisonDate.getTime() - varianceValue;
    const ceiling = comparisonDate.getTime() + varianceValue;
    const pass = initalValue >= floor && initalValue <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${initialDate} not to be within range ${comparisonDate} and a variance of ${variance} minute`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${initialDate} to be within range ${comparisonDate} and a variance of ${variance} minute`,
        pass: false,
      };
    }
  },
});

type TestFileTime = {
  date: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
};

interface TestFile {
  params: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: string;
    madhab: string;
    highLatitudeRule: string;
  };
  source: string[];
  variance: number;
  times: TestFileTime[];
}

fs.readdirSync('Shared/Times').forEach(function (filename) {
  test(`compare calculated times against the prayer times in ${filename}`, () => {
    const file_contents = fs.readFileSync('Shared/Times/' + filename);
    const data: TestFile = JSON.parse(file_contents.toString());
    const coordinates = new Coordinates(
      data['params']['latitude'],
      data['params']['longitude'],
    );
    const params = parseParams(data['params']);
    const variance = data['variance'] || 0;
    data['times'].forEach(function (time) {
      const date = moment(time['date'], 'YYYY-MM-DD').toDate();
      const p = new PrayerTimes(coordinates, date, params);

      const testFajr = moment
        .tz(
          time['date'] + ' ' + time['fajr'],
          'YYYY-MM-DD h:mm A',
          data['params']['timezone'],
        )
        .toDate();
      const testSunrise = moment
        .tz(
          time['date'] + ' ' + time['sunrise'],
          'YYYY-MM-DD h:mm A',
          data['params']['timezone'],
        )
        .toDate();
      const testDhuhr = moment
        .tz(
          time['date'] + ' ' + time['dhuhr'],
          'YYYY-MM-DD h:mm A',
          data['params']['timezone'],
        )
        .toDate();
      const testAsr = moment
        .tz(
          time['date'] + ' ' + time['asr'],
          'YYYY-MM-DD h:mm A',
          data['params']['timezone'],
        )
        .toDate();
      const testMaghrib = moment
        .tz(
          time['date'] + ' ' + time['maghrib'],
          'YYYY-MM-DD h:mm A',
          data['params']['timezone'],
        )
        .toDate();
      const testIsha = moment
        .tz(
          time['date'] + ' ' + time['isha'],
          'YYYY-MM-DD h:mm A',
          data['params']['timezone'],
        )
        .toDate();

      expect(p.fajr).toBeWithinRange(testFajr, variance);
      expect(p.sunrise).toBeWithinRange(testSunrise, variance);
      expect(p.dhuhr).toBeWithinRange(testDhuhr, variance);
      expect(p.asr).toBeWithinRange(testAsr, variance);
      expect(p.maghrib).toBeWithinRange(testMaghrib, variance);
      expect(p.isha).toBeWithinRange(testIsha, variance);
    });
  });
});
