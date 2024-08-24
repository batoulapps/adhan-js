import type Coordinates from './Coordinates';
import SolarTime from './SolarTime';
import { dateByAddingDays } from './DateUtils';

const HighLatitudeFajrRule = {
  Default: 'default', //Falls back to HighLatitudeRule
  AqrabYaum: 'aqrabyaum', //Uses Aqrab Youm
};

export default HighLatitudeFajrRule;

export const highLatitudeAqrabulAyyamResolver = (
  date: Date,
  coordinates: Coordinates,
  fajrAngle: number,
): Date => {
  const solarTime = new SolarTime(date, coordinates);
  if (isNaN(solarTime.hourAngle(-1 * fajrAngle, false))) {
    return highLatitudeAqrabulAyyamResolver(
      dateByAddingDays(date, -1),
      coordinates,
      fajrAngle,
    );
  } else {
    return date;
  }
};
