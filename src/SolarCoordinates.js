import Astronomical from './Astronomical';
import { degreesToRadians, radiansToDegrees, unwindAngle } from './MathUtils';

export default class SolarCoordinates {
    constructor(julianDay) {
        const T = Astronomical.julianCentury(julianDay);
        const L0 = Astronomical.meanSolarLongitude(T);
        const Lp = Astronomical.meanLunarLongitude(T);
        const Omega = Astronomical.ascendingLunarNodeLongitude(T);
        const Lambda = degreesToRadians(Astronomical.apparentSolarLongitude(T, L0));
        const Theta0 = Astronomical.meanSiderealTime(T);
        const dPsi = Astronomical.nutationInLongitude(T, L0, Lp, Omega);
        const dEpsilon = Astronomical.nutationInObliquity(T, L0, Lp, Omega);
        const Epsilon0 = Astronomical.meanObliquityOfTheEcliptic(T);
        const EpsilonApparent = degreesToRadians(Astronomical.apparentObliquityOfTheEcliptic(T, Epsilon0));

        /* declination: The declination of the sun, the angle between
            the rays of the Sun and the plane of the Earth's
            equator, in degrees.
            Equation from Astronomical Algorithms page 165 */
        this.declination = radiansToDegrees(Math.asin(Math.sin(EpsilonApparent) * Math.sin(Lambda)));

        /* rightAscension: Right ascension of the Sun, the angular distance on the
            celestial equator from the vernal equinox to the hour circle,
            in degrees.
            Equation from Astronomical Algorithms page 165 */
        this.rightAscension = unwindAngle(radiansToDegrees(Math.atan2(Math.cos(EpsilonApparent) * Math.sin(Lambda), Math.cos(Lambda))));

        /* apparentSiderealTime: Apparent sidereal time, the hour angle of the vernal
            equinox, in degrees.
            Equation from Astronomical Algorithms page 88 */
        this.apparentSiderealTime = Theta0 + (((dPsi * 3600) * Math.cos(degreesToRadians(Epsilon0 + dEpsilon))) / 3600);
    }
}

