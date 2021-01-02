/* eslint-disable max-params, max-lines */
import { degreesToRadians, radiansToDegrees, unwindAngle, normalizeToScale, quadrantShiftAngle } from './MathUtils';
import { dateByAddingSeconds } from './DateUtils';

const Astronomical = {

    /* The geometric mean longitude of the sun in degrees. */
    meanSolarLongitude(julianCentury) {
        const T = julianCentury;
        /* Equation from Astronomical Algorithms page 163 */
        const term1 = 280.4664567;
        const term2 = 36000.76983 * T;
        const term3 = 0.0003032 * Math.pow(T, 2);
        const L0 = term1 + term2 + term3;
        return unwindAngle(L0);
    },

    /* The geometric mean longitude of the moon in degrees. */
    meanLunarLongitude(julianCentury) {
        const T = julianCentury;
        /* Equation from Astronomical Algorithms page 144 */
        const term1 = 218.3165;
        const term2 = 481267.8813 * T;
        const Lp = term1 + term2;
        return unwindAngle(Lp);
    },

    ascendingLunarNodeLongitude(julianCentury) {
        const T = julianCentury;
        /* Equation from Astronomical Algorithms page 144 */
        const term1 = 125.04452;
        const term2 = 1934.136261 * T;
        const term3 = 0.0020708 * Math.pow(T, 2);
        const term4 = Math.pow(T, 3) / 450000;
        const Omega = term1 - term2 + term3 + term4;
        return unwindAngle(Omega);
    },

    /* The mean anomaly of the sun. */
    meanSolarAnomaly(julianCentury) {
        const T = julianCentury;
        /* Equation from Astronomical Algorithms page 163 */
        const term1 = 357.52911;
        const term2 = 35999.05029 * T;
        const term3 = 0.0001537 * Math.pow(T, 2);
        const M = term1 + term2 - term3;
        return unwindAngle(M);
    },

    /* The Sun's equation of the center in degrees. */
    solarEquationOfTheCenter(julianCentury, meanAnomaly) {
        const T = julianCentury;
        /* Equation from Astronomical Algorithms page 164 */
        const Mrad = degreesToRadians(meanAnomaly);
        const term1 = (1.914602 - (0.004817 * T) - (0.000014 * Math.pow(T, 2))) * Math.sin(Mrad);
        const term2 = (0.019993 - (0.000101 * T)) * Math.sin(2 * Mrad);
        const term3 = 0.000289 * Math.sin(3 * Mrad);
        return term1 + term2 + term3;
    },

    /* The apparent longitude of the Sun, referred to the
        true equinox of the date. */
    apparentSolarLongitude(julianCentury, meanLongitude) {
        const T = julianCentury;
        const L0 = meanLongitude;
        /* Equation from Astronomical Algorithms page 164 */
        const longitude = L0 + Astronomical.solarEquationOfTheCenter(T, Astronomical.meanSolarAnomaly(T));
        const Omega = 125.04 - (1934.136 * T);
        const Lambda = longitude - 0.00569 - (0.00478 * Math.sin(degreesToRadians(Omega)));
        return unwindAngle(Lambda);
    },

    /* The mean obliquity of the ecliptic, formula
        adopted by the International Astronomical Union.
        Represented in degrees. */
    meanObliquityOfTheEcliptic(julianCentury) {
        const T = julianCentury;
        /* Equation from Astronomical Algorithms page 147 */
        const term1 = 23.439291;
        const term2 = 0.013004167 * T;
        const term3 = 0.0000001639 * Math.pow(T, 2);
        const term4 = 0.0000005036 * Math.pow(T, 3);
        return term1 - term2 - term3 + term4;
    },

    /* The mean obliquity of the ecliptic, corrected for
        calculating the apparent position of the sun, in degrees. */
    apparentObliquityOfTheEcliptic(julianCentury, meanObliquityOfTheEcliptic) {
        const T = julianCentury;
        const Epsilon0 = meanObliquityOfTheEcliptic;
        /* Equation from Astronomical Algorithms page 165 */
        const O = 125.04 - (1934.136 * T);
        return Epsilon0 + (0.00256 * Math.cos(degreesToRadians(O)));
    },

    /* Mean sidereal time, the hour angle of the vernal equinox, in degrees. */
    meanSiderealTime(julianCentury) {
        const T = julianCentury;
        /* Equation from Astronomical Algorithms page 165 */
        const JD = (T * 36525) + 2451545.0;
        const term1 = 280.46061837;
        const term2 = 360.98564736629 * (JD - 2451545);
        const term3 = 0.000387933 * Math.pow(T, 2);
        const term4 = Math.pow(T, 3) / 38710000;
        const Theta = term1 + term2 + term3 - term4;
        return unwindAngle(Theta)
    },

    nutationInLongitude(julianCentury, solarLongitude, lunarLongitude, ascendingNode) {
        const L0 = solarLongitude;
        const Lp = lunarLongitude;
        const Omega = ascendingNode;
        /* Equation from Astronomical Algorithms page 144 */
        const term1 = (-17.2/3600) * Math.sin(degreesToRadians(Omega));
        const term2 =  (1.32/3600) * Math.sin(2 * degreesToRadians(L0));
        const term3 =  (0.23/3600) * Math.sin(2 * degreesToRadians(Lp));
        const term4 =  (0.21/3600) * Math.sin(2 * degreesToRadians(Omega));
        return term1 - term2 - term3 + term4;
    },

    nutationInObliquity(julianCentury, solarLongitude, lunarLongitude, ascendingNode) {
        const L0 = solarLongitude;
        const Lp = lunarLongitude;
        const Omega = ascendingNode;
        /* Equation from Astronomical Algorithms page 144 */
        const term1 =  (9.2/3600) * Math.cos(degreesToRadians(Omega));
        const term2 = (0.57/3600) * Math.cos(2 * degreesToRadians(L0));
        const term3 = (0.10/3600) * Math.cos(2 * degreesToRadians(Lp));
        const term4 = (0.09/3600) * Math.cos(2 * degreesToRadians(Omega));
        return term1 + term2 + term3 - term4;
    },

    altitudeOfCelestialBody(observerLatitude, declination, localHourAngle) {
        const Phi = observerLatitude;
        const delta = declination;
        const H = localHourAngle;
        /* Equation from Astronomical Algorithms page 93 */
        const term1 = Math.sin(degreesToRadians(Phi)) * Math.sin(degreesToRadians(delta));
        const term2 = Math.cos(degreesToRadians(Phi)) * Math.cos(degreesToRadians(delta)) * Math.cos(degreesToRadians(H));
        return radiansToDegrees(Math.asin(term1 + term2));
    },

    approximateTransit(longitude, siderealTime, rightAscension) {
        const L = longitude;
        const Theta0 = siderealTime;
        const a2 = rightAscension;
        /* Equation from page Astronomical Algorithms 102 */
        const Lw = L * -1;
        return normalizeToScale((a2 + Lw - Theta0) / 360, 1);
    },

    /* The time at which the sun is at its highest point in the sky (in universal time) */
    correctedTransit(approximateTransit, longitude, siderealTime, rightAscension, previousRightAscension, nextRightAscension) {
        const m0 = approximateTransit;
        const L = longitude;
        const Theta0 = siderealTime;
        const a2 = rightAscension;
        const a1 = previousRightAscension;
        const a3 = nextRightAscension;
        /* Equation from page Astronomical Algorithms 102 */
        const Lw = L * -1;
        const Theta = unwindAngle((Theta0 + (360.985647 * m0)));
        const a = unwindAngle(Astronomical.interpolateAngles(a2, a1, a3, m0));
        const H = quadrantShiftAngle(Theta - Lw - a);
        const dm = H / -360;
        return (m0 + dm) * 24;
    },

    correctedHourAngle(approximateTransit, angle, coordinates, afterTransit, siderealTime,
                                    rightAscension, previousRightAscension, nextRightAscension, declination, previousDeclination, nextDeclination) {
        const m0 = approximateTransit;
        const h0 = angle;
        const Theta0 = siderealTime;
        const a2 = rightAscension;
        const a1 = previousRightAscension;
        const a3 = nextRightAscension;
        const d2 = declination;
        const d1 = previousDeclination;
        const d3 = nextDeclination;

        /* Equation from page Astronomical Algorithms 102 */
        const Lw = coordinates.longitude * -1;
        const term1 = Math.sin(degreesToRadians(h0)) - (Math.sin(degreesToRadians(coordinates.latitude)) * Math.sin(degreesToRadians(d2)));
        const term2 = Math.cos(degreesToRadians(coordinates.latitude)) * Math.cos(degreesToRadians(d2));
        const H0 = radiansToDegrees(Math.acos(term1 / term2));
        const m = afterTransit ? m0 + (H0 / 360) : m0 - (H0 / 360);
        const Theta = unwindAngle((Theta0 + (360.985647 * m)));
        const a = unwindAngle(Astronomical.interpolateAngles(a2, a1, a3, m));
        const delta = Astronomical.interpolate(d2, d1, d3, m);
        const H = (Theta - Lw - a);
        const h = Astronomical.altitudeOfCelestialBody(coordinates.latitude, delta, H);
        const term3 = h - h0;
        const term4 = 360 * Math.cos(degreesToRadians(delta)) * Math.cos(degreesToRadians(coordinates.latitude)) * Math.sin(degreesToRadians(H));
        const dm = term3 / term4;
        return (m + dm) * 24;
    },

    /* Interpolation of a value given equidistant
        previous and next values and a factor
        equal to the fraction of the interpolated
        point's time over the time between values. */
    interpolate(y2, y1, y3, n) {
        /* Equation from Astronomical Algorithms page 24 */
        const a = y2 - y1;
        const b = y3 - y2;
        const c = b - a;
        return y2 + ((n/2) * (a + b + (n * c)));
    },

    /* Interpolation of three angles, accounting for
        angle unwinding. */
    interpolateAngles(y2, y1, y3, n) {
        /* Equation from Astronomical Algorithms page 24 */
        const a = unwindAngle(y2 - y1);
        const b = unwindAngle(y3 - y2);
        const c = b - a;
        return y2 + ((n/2) * (a + b + (n * c)));
    },

    /* The Julian Day for the given Gregorian date components. */
    julianDay(year, month, day, hours) {
        /* Equation from Astronomical Algorithms page 60 */
        if (typeof hours === 'undefined') {
            hours = 0;
        }

        const trunc = Math.trunc || function (x) { return x < 0 ? Math.ceil(x) : Math.floor(x); };

        const Y = trunc(month > 2 ? year : year - 1);
        const M = trunc(month > 2 ? month : month + 12);
        const D = day + (hours / 24);

        const A = trunc(Y/100);
        const B = trunc(2 - A + trunc(A/4));

        const i0 = trunc(365.25 * (Y + 4716));
        const i1 = trunc(30.6001 * (M + 1));

        return i0 + i1 + D + B - 1524.5;
    },

    /* Julian century from the epoch. */
    julianCentury(julianDay) {
        /* Equation from Astronomical Algorithms page 163 */
        return (julianDay - 2451545.0) / 36525;
    },

    /* Whether or not a year is a leap year (has 366 days). */
    isLeapYear(year) {
        if (year % 4 !== 0) {
            return false;
        }

        if (year % 100 === 0 && year % 400 !== 0) {
            return false;
        }

        return true;
    },

    seasonAdjustedMorningTwilight(latitude, dayOfYear, year, sunrise) {
        const a = 75 + ((28.65 / 55.0) * Math.abs(latitude));
        const b = 75 + ((19.44 / 55.0) * Math.abs(latitude));
        const c = 75 + ((32.74 / 55.0) * Math.abs(latitude));
        const d = 75 + ((48.10 / 55.0) * Math.abs(latitude));

        const adjustment = (function() {
            const dyy = Astronomical.daysSinceSolstice(dayOfYear, year, latitude);
            if ( dyy < 91) {
                return a + ( b - a ) / 91.0 * dyy;
            } else if ( dyy < 137) {
                return b + ( c - b ) / 46.0 * ( dyy - 91 );
            } else if ( dyy < 183 ) {
                return c + ( d - c ) / 46.0 * ( dyy - 137 );
            } else if ( dyy < 229 ) {
                return d + ( c - d ) / 46.0 * ( dyy - 183 );
            } else if ( dyy < 275 ) {
                return c + ( b - c ) / 46.0 * ( dyy - 229 );
            } else {
                return b + ( a - b ) / 91.0 * ( dyy - 275 );
            }
        })();

        return dateByAddingSeconds(sunrise, Math.round(adjustment * -60.0));
    },

    seasonAdjustedEveningTwilight(latitude, dayOfYear, year, sunset) {
        const a = 75 + ((25.60 / 55.0) * Math.abs(latitude));
        const b = 75 + ((2.050 / 55.0) * Math.abs(latitude));
        const c = 75 - ((9.210 / 55.0) * Math.abs(latitude));
        const d = 75 + ((6.140 / 55.0) * Math.abs(latitude));

        const adjustment = (function() {
            const dyy = Astronomical.daysSinceSolstice(dayOfYear, year, latitude);
            if ( dyy < 91) {
                return a + ( b - a ) / 91.0 * dyy;
            } else if ( dyy < 137) {
                return b + ( c - b ) / 46.0 * ( dyy - 91 );
            } else if ( dyy < 183 ) {
                return c + ( d - c ) / 46.0 * ( dyy - 137 );
            } else if ( dyy < 229 ) {
                return d + ( c - d ) / 46.0 * ( dyy - 183 );
            } else if ( dyy < 275 ) {
                return c + ( b - c ) / 46.0 * ( dyy - 229 );
            } else {
                return b + ( a - b ) / 91.0 * ( dyy - 275 );
            }
        })();

        return dateByAddingSeconds(sunset, Math.round(adjustment * 60.0));
    },

    daysSinceSolstice(dayOfYear, year, latitude) {
        let daysSinceSolstice = 0;
        const northernOffset = 10;
        const southernOffset = Astronomical.isLeapYear(year) ? 173 : 172;
        const daysInYear = Astronomical.isLeapYear(year) ? 366 : 365;

        if (latitude >= 0) {
            daysSinceSolstice = dayOfYear + northernOffset;
            if (daysSinceSolstice >= daysInYear) {
                daysSinceSolstice = daysSinceSolstice - daysInYear;
            }
        } else {
            daysSinceSolstice = dayOfYear - southernOffset;
            if (daysSinceSolstice < 0) {
                daysSinceSolstice = daysSinceSolstice + daysInYear;
            }
        }

        return daysSinceSolstice;
    }
};

export default Astronomical;