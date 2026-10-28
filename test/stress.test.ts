import CalculationMethod from '../src/CalculationMethod.js';
import Coordinates from '../src/Coordinates.js';
import PrayerTimes from '../src/PrayerTimes.js';
import { PolarCircleResolution } from '../src/PolarCircleResolution.js';
import { isValidDate } from '../src/DateUtils.js';
import { describe, it, expect } from 'vitest';

const POLAR_CIRCLE_LATITUDE = 66.55;

describe('stress test: prayer time ordering across global coordinates and all days of year', () => {
  it(
    'all prayer times are computable outside the polar circle and in correct order everywhere, for every 5° lat, 10° lon, every day of 2025',
    { timeout: 60_000 },
    () => {
      const year = 2025;
      const params = CalculationMethod.MuslimWorldLeague();
      params.polarCircleResolution = PolarCircleResolution.Unresolved;

      const violations: string[] = [];

      for (let lat = -90; lat <= 90; lat += 5) {
        for (let lon = -180; lon <= 180; lon += 10) {
          const coordinates = new Coordinates(lat, lon);
          const inPolarCircle = Math.abs(lat) > POLAR_CIRCLE_LATITUDE;

          for (let dayOfYear = 1; dayOfYear <= 365; dayOfYear++) {
            const date = new Date(year, 0, dayOfYear);
            const pt = new PrayerTimes(coordinates, date, params);

            const dateStr = date.toISOString().slice(0, 10);
            const loc = `(${lat}, ${lon}) ${dateStr}`;

            if (!isValidDate(pt.fajr)) {
              if (!inPolarCircle) {
                violations.push(
                  `${loc}: unexpected failure outside polar circle`,
                );
              }
              continue;
            }

            if (pt.fajr >= pt.sunrise) {
              violations.push(
                `${loc}: fajr >= sunrise (${pt.fajr.toISOString()} >= ${pt.sunrise.toISOString()})`,
              );
            }
            if (pt.sunrise >= pt.dhuhr) {
              violations.push(
                `${loc}: sunrise >= dhuhr (${pt.sunrise.toISOString()} >= ${pt.dhuhr.toISOString()})`,
              );
            }
            if (pt.dhuhr >= pt.asr) {
              violations.push(
                `${loc}: dhuhr >= asr (${pt.dhuhr.toISOString()} >= ${pt.asr.toISOString()})`,
              );
            }
            if (pt.asr >= pt.maghrib) {
              violations.push(
                `${loc}: asr >= maghrib (${pt.asr.toISOString()} >= ${pt.maghrib.toISOString()})`,
              );
            }
            if (pt.maghrib >= pt.isha) {
              violations.push(
                `${loc}: maghrib >= isha (${pt.maghrib.toISOString()} >= ${pt.isha.toISOString()})`,
              );
            }
          }
        }
      }

      if (violations.length > 0) {
        console.log(`\nOrdering violations found (${violations.length}):`);
        violations.forEach((v) => console.log(' ', v));
      }

      expect(violations).toEqual([]);
    },
  );
});
