import Astronomical from './Astronomical.js';
import type Coordinates from './Coordinates.js';
import { degreesToRadians, radiansToDegrees } from './MathUtils.js';
import SolarCoordinates from './SolarCoordinates.js';

// Standard solar altitude at sunrise/sunset (degrees): -0.833°, i.e. the
// sun's center is 0.833° below the horizon (0.2667° semidiameter + 0.5667°
// average refraction).
const SUNRISE_SUNSET_ALTITUDE = -50.0 / 60.0;

export default class SolarTime {
  observer: Coordinates;
  solar: SolarCoordinates;
  prevSolar: SolarCoordinates;
  nextSolar: SolarCoordinates;
  approxTransit: number;
  transit: number;
  sunrise: number;
  sunset: number;

  constructor(date: Date, coordinates: Coordinates) {
    const julianDay = Astronomical.julianDay(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      0,
    );

    this.observer = coordinates;
    this.solar = new SolarCoordinates(julianDay);

    this.prevSolar = new SolarCoordinates(julianDay - 1);
    this.nextSolar = new SolarCoordinates(julianDay + 1);

    const m0 = Astronomical.approximateTransit(
      coordinates.longitude,
      this.solar.apparentSiderealTime,
      this.solar.rightAscension,
    );
    const solarAltitude = SUNRISE_SUNSET_ALTITUDE;

    this.approxTransit = m0;

    this.transit = Astronomical.correctedTransit(
      m0,
      coordinates.longitude,
      this.solar.apparentSiderealTime,
      this.solar.rightAscension,
      this.prevSolar.rightAscension,
      this.nextSolar.rightAscension,
    );

    this.sunrise = Astronomical.correctedHourAngle(
      m0,
      solarAltitude,
      coordinates,
      false,
      this.solar.apparentSiderealTime,
      this.solar.rightAscension,
      this.prevSolar.rightAscension,
      this.nextSolar.rightAscension,
      this.solar.declination,
      this.prevSolar.declination,
      this.nextSolar.declination,
    );

    this.sunset = Astronomical.correctedHourAngle(
      m0,
      solarAltitude,
      coordinates,
      true,
      this.solar.apparentSiderealTime,
      this.solar.rightAscension,
      this.prevSolar.rightAscension,
      this.nextSolar.rightAscension,
      this.solar.declination,
      this.prevSolar.declination,
      this.nextSolar.declination,
    );
  }

  hourAngle(angle: number, afterTransit: boolean) {
    return Astronomical.correctedHourAngle(
      this.approxTransit,
      angle,
      this.observer,
      afterTransit,
      this.solar.apparentSiderealTime,
      this.solar.rightAscension,
      this.prevSolar.rightAscension,
      this.nextSolar.rightAscension,
      this.solar.declination,
      this.prevSolar.declination,
      this.nextSolar.declination,
    );
  }

  afternoon(shadowLength: number) {
    // TODO source shadow angle calculation
    const tangent = Math.abs(this.observer.latitude - this.solar.declination);
    const inverse = shadowLength + Math.tan(degreesToRadians(tangent));
    const angle = radiansToDegrees(Math.atan(1.0 / inverse));
    return this.hourAngle(angle, true);
  }
}
