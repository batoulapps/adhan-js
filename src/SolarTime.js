import Astronomical from './Astronomical';
import { julianDayFromDate } from './DateUtils';
import { degreesToRadians, radiansToDegrees } from './MathUtils'
import SolarCoordinates from './SolarCoordinates';

export default class SolarTime {
    constructor(date, coordinates) {
        // calculations need to occur at 0h0m UTC
        date.setHours(0);
        date.setMinutes(0);
        this.date = date;
        this.observer = coordinates;
        this.solar = new SolarCoordinates(julianDayFromDate(date));

        const previous = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
        const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

        this.prevSolar = new SolarCoordinates(julianDayFromDate(previous));
        this.nextSolar = new SolarCoordinates(julianDayFromDate(next));

        const m0 = Astronomical.approximateTransit(coordinates.longitude, this.solar.apparentSiderealTime, this.solar.rightAscension);
        const solarAltitude = -50.0 / 60.0;

        this.approxTransit = m0;

        this.transit = Astronomical.correctedTransit(m0, coordinates.longitude, this.solar.apparentSiderealTime, 
            this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension);

        this.sunrise = Astronomical.correctedHourAngle(m0, solarAltitude, coordinates, false, this.solar.apparentSiderealTime, 
            this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension, 
            this.solar.declination, this.prevSolar.declination, this.nextSolar.declination);

        this.sunset = Astronomical.correctedHourAngle(m0, solarAltitude, coordinates, true, this.solar.apparentSiderealTime, 
            this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension, 
            this.solar.declination, this.prevSolar.declination, this.nextSolar.declination);
    }

    hourAngle(angle, afterTransit) {
        return Astronomical.correctedHourAngle(this.approxTransit, angle, this.observer, afterTransit, this.solar.apparentSiderealTime, 
            this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension, 
            this.solar.declination, this.prevSolar.declination, this.nextSolar.declination);
    }

    afternoon(shadowLength) {
        // TODO source shadow angle calculation
        const tangent = Math.abs(this.observer.latitude - this.solar.declination);
        const inverse = shadowLength + Math.tan(degreesToRadians(tangent));
        const angle = radiansToDegrees(Math.atan(1.0 / inverse));
        return this.hourAngle(angle, true);
    }
}


