"use strict";

// UMD pattern from https://github.com/umdjs/umd
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
} else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.adhan = factory();
  }
}(this, function () {
    var Prayer = {
        Fajr: 0,
        Sunrise: 1,
        Dhuhr: 2,
        Asr: 3,
        Maghrib: 4,
        Isha: 5,
        None: 6
    };

    var Madhab = {
        Shafi: 1,
        Hanafi: 2
    };

    var HighLatitudeRule = {
        MiddleOfTheNight: 1,
        SeventhOfTheNight: 2,
        TwilightAngle: 3
    };

    function Coordinates(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    function CalculationParameters(fajrAngle, ishaAngle, ishaInterval, methodName) {
        this.method = methodName || "Other";
        this.fajrAngle = fajrAngle || 0;
        this.ishaAngle = ishaAngle || 0;
        this.ishaInterval = ishaInterval || 0;
        this.madhab = Madhab.Shafi;
        this.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;
        this.adjustments = { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
        this.methodAdjustments = { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };

        this.nightPortions = function() {
            switch(this.highLatitudeRule) {
                case HighLatitudeRule.MiddleOfTheNight:
                    return { fajr: 1/2, isha: 1/2 };
                case HighLatitudeRule.SeventhOfTheNight:
                    return { fajr: 1/7, isha: 1/7 };
                case HighLatitudeRule.TwilightAngle:
                    return { fajr: this.fajrAngle / 60, isha: this.ishaAngle / 60 };
            }
        }
    }

    var CalculationMethod = {
        // Muslim World League
        MuslimWorldLeague: function() {
            var params = new CalculationParameters(18, 17, 0, "MuslimWorldLeague");
            params.methodAdjustments = { dhuhr: 1 };
            return params;
        },

        // Egyptian General Authority of Survey
        Egyptian: function() {
            var params = new CalculationParameters(19.5, 17.5, 0, "Egyptian");
            params.methodAdjustments = { dhuhr: 1 };
            return params;
        },

        // University of Islamic Sciences, Karachi
        Karachi: function() {
            var params = new CalculationParameters(18, 18, 0, "Karachi");
            params.methodAdjustments = { dhuhr: 1 };
            return params;
        },

        // Umm al-Qura University, Makkah
        UmmAlQura: function() {
            return new CalculationParameters(18.5, 0, 90, "UmmAlQura");
        },

        // Dubai
        Dubai: function() {
            var params = new CalculationParameters(18.2, 18.2, 0, "Dubai");
            params.methodAdjustments = { sunrise: -3, dhuhr: 3, asr: 3, maghrib: 3 };
            return params;
        },

        // Moonsighting Committee
        MoonsightingCommittee: function() {
            var params = new CalculationParameters(18, 18, 0, "MoonsightingCommittee");
            params.methodAdjustments = { dhuhr: 5, maghrib: 3 };
            return params;
        },

        // ISNA
        NorthAmerica: function() {
            var params = new CalculationParameters(15, 15, 0, "NorthAmerica");
            params.methodAdjustments = { dhuhr: 1 };
            return params;
        },

        // Kuwait
        Kuwait: function() {
            return new CalculationParameters(18, 17.5, 0, "Kuwait");
        },

        // Qatar
        Qatar: function() {
            return new CalculationParameters(18, 0, 90, "Qatar");
        },

        // Singapore
        Singapore: function() {
            var params = new CalculationParameters(20, 18, 0, "Singapore");
            params.methodAdjustments = { dhuhr: 1 };
            return params;
        },

        // Other
        Other: function() {
            return new CalculationParameters(0, 0, 0, "Other");
        }
    };

    function PrayerTimes(coordinates, date, calculationParameters) {
        var solarTime = new SolarTime(date, coordinates);

        var fajrTime;
        var sunriseTime;
        var dhuhrTime;
        var asrTime;
        var maghribTime;
        var ishaTime;

        var nightFraction;

        dhuhrTime = timeComponents(solarTime.transit).UTCDate(date.getFullYear(), date.getMonth(), date.getDate());
        sunriseTime = timeComponents(solarTime.sunrise).UTCDate(date.getFullYear(), date.getMonth(), date.getDate());
        maghribTime = timeComponents(solarTime.sunset).UTCDate(date.getFullYear(), date.getMonth(), date.getDate());

        asrTime = timeComponents(solarTime.afternoon(calculationParameters.madhab)).UTCDate(date.getFullYear(), date.getMonth(), date.getDate());

        var tomorrowSunrise = dateByAddingDays(sunriseTime, 1);
        var night = (tomorrowSunrise - maghribTime) / 1000;

        fajrTime = timeComponents(solarTime.hourAngle(-1 * calculationParameters.fajrAngle, false)).UTCDate(date.getFullYear(), date.getMonth(), date.getDate());

        // special case for moonsighting committee above latitude 55
        if (calculationParameters.method == "MoonsightingCommittee" && coordinates.latitude >= 55) {
            nightFraction = night / 7;
            fajrTime = dateByAddingSeconds(sunriseTime, -nightFraction);
        }

        var safeFajr = (function(){
            if (calculationParameters.method == "MoonsightingCommittee") {
                return Astronomical.seasonAdjustedMorningTwilight(coordinates.latitude, dayOfYear(date), date.getFullYear(), sunriseTime);
            } else {
                var portion = calculationParameters.nightPortions().fajr;
                nightFraction = portion * night;

                return dateByAddingSeconds(sunriseTime, -nightFraction);
            }
        })();

        if (fajrTime == null || isNaN(fajrTime.getTime()) || safeFajr > fajrTime) {
            fajrTime = safeFajr
        }

        if (calculationParameters.ishaInterval > 0) {
            ishaTime = dateByAddingMinutes(maghribTime, calculationParameters.ishaInterval);
        } else {
            ishaTime = timeComponents(solarTime.hourAngle(-1 * calculationParameters.ishaAngle, true)).UTCDate(date.getFullYear(), date.getMonth(), date.getDate());

            // special case for moonsighting committee above latitude 55
            if (calculationParameters.method == "MoonsightingCommittee" && coordinates.latitude >= 55) {
                nightFraction = night / 7;
                ishaTime = dateByAddingSeconds(maghribTime, nightFraction);
            }

            var safeIsha = (function(){
                if (calculationParameters.method == "MoonsightingCommittee") {
                    return Astronomical.seasonAdjustedEveningTwilight(coordinates.latitude, dayOfYear(date), date.getFullYear(), maghribTime);
                } else {
                    var portion = calculationParameters.nightPortions().isha;
                    nightFraction = portion * night;

                    return dateByAddingSeconds(maghribTime, nightFraction);
                }
            })();

            if (ishaTime == null || isNaN(ishaTime.getTime()) || safeIsha < ishaTime) {
                ishaTime = safeIsha
            }
        }

        var fajrAdjustment = (calculationParameters.adjustments.fajr || 0) + (calculationParameters.methodAdjustments.fajr || 0);
        var sunriseAdjustment = (calculationParameters.adjustments.sunrise || 0) + (calculationParameters.methodAdjustments.sunrise || 0);
        var dhuhrAdjustment = (calculationParameters.adjustments.dhuhr || 0) + (calculationParameters.methodAdjustments.dhuhr || 0);
        var asrAdjustment = (calculationParameters.adjustments.asr || 0) + (calculationParameters.methodAdjustments.asr || 0);
        var maghribAdjustment = (calculationParameters.adjustments.maghrib || 0) + (calculationParameters.methodAdjustments.maghrib || 0);
        var ishaAdjustment = (calculationParameters.adjustments.isha || 0) + (calculationParameters.methodAdjustments.isha || 0);

        this.fajr = roundedMinute(dateByAddingMinutes(fajrTime, fajrAdjustment));
        this.sunrise = roundedMinute(dateByAddingMinutes(sunriseTime, sunriseAdjustment));
        this.dhuhr = roundedMinute(dateByAddingMinutes(dhuhrTime, dhuhrAdjustment));
        this.asr = roundedMinute(dateByAddingMinutes(asrTime, asrAdjustment));
        this.maghrib = roundedMinute(dateByAddingMinutes(maghribTime, maghribAdjustment));
        this.isha = roundedMinute(dateByAddingMinutes(ishaTime, ishaAdjustment));

        this.timeForPrayer = function(prayer) {
            if (prayer == Prayer.Fajr) {
                return this.fajr;
            } else if (prayer == Prayer.Sunrise) {
                return this.sunrise;
            } else if (prayer == Prayer.Dhuhr) {
                return this.dhuhr;
            } else if (prayer == Prayer.Asr) {
                return this.asr;
            } else if (prayer == Prayer.Maghrib) {
                return this.maghrib;
            } else if (prayer == Prayer.Isha) {
                return this.isha;
            } else {
                return null;
            }
        };

        this.currentPrayer = function(date) {
            if (typeof date === 'undefined') {
                date = new Date();
            }

            if (date >= this.isha) {
                return Prayer.Isha;
            } else if (date >= this.maghrib) {
                return Prayer.Maghrib;
            } else if (date >= this.asr) {
                return Prayer.Asr;
            } else if (date >= this.dhuhr) {
                return Prayer.Dhuhr;
            } else if (date >= this.sunrise) {
                return Prayer.Sunrise;
            } else if (date >= this.fajr) {
                return Prayer.Fajr;
            } else {
                return Prayer.None;
            }
        };

        this.nextPrayer = function(date) {
            if (typeof date === 'undefined') {
                date = new Date();
            }

            if (date >= this.isha) {
                return Prayer.None;
            } else if (date >= this.maghrib) {
                return Prayer.Isha;
            } else if (date >= this.asr) {
                return Prayer.Maghrib;
            } else if (date >= this.dhuhr) {
                return Prayer.Asr;
            } else if (date >= this.sunrise) {
                return Prayer.Dhuhr;
            } else if (date >= this.fajr) {
                return Prayer.Sunrise;
            } else {
                return Prayer.Fajr;
            }
        }
    }

    function Qibla(coordinates) {
        var makkah = { latitude: 21.4225241, longitude: 39.8261818 };

        // Equation from "Spherical Trigonometry For the use of colleges and schools" page 50
        var term1 = (
          Math.sin(degreesToRadians(makkah.longitude) -
          degreesToRadians(coordinates.longitude))
        );
        var term2 = (
          Math.cos(degreesToRadians(coordinates.latitude)) *
          Math.tan(degreesToRadians(makkah.latitude))
        );
        var term3 = (
          Math.sin(degreesToRadians(coordinates.latitude)) *
          Math.cos(degreesToRadians(makkah.longitude) -
          degreesToRadians(coordinates.longitude))
        );
        var angle = Math.atan2(term1, term2 - term3);

        return unwindAngle(radiansToDegrees(angle));
    }

    //
    // Astronomical equations
    //

    function SolarTime(date, coordinates) {
        // calculations need to occur at 0h0m UTC
        date.setHours(0);
        date.setMinutes(0);
        this.date = date;
        this.observer = coordinates;
        this.solar = new SolarCoordinates(julianDate(date));

        var previous = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
        var next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

        this.prevSolar = new SolarCoordinates(julianDate(previous));
        this.nextSolar = new SolarCoordinates(julianDate(next));

        var m0 = Astronomical.approximateTransit(coordinates.longitude, this.solar.apparentSiderealTime, this.solar.rightAscension);
        var solarAltitude = -50.0 / 60.0;

        this.approxTransit = m0;

        this.transit = Astronomical.correctedTransit(m0, coordinates.longitude, this.solar.apparentSiderealTime,
            this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension);

        this.sunrise = Astronomical.correctedHourAngle(m0, solarAltitude, coordinates, false, this.solar.apparentSiderealTime,
            this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension,
            this.solar.declination, this.prevSolar.declination, this.nextSolar.declination);

        this.sunset = Astronomical.correctedHourAngle(m0, solarAltitude, coordinates, true, this.solar.apparentSiderealTime,
            this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension,
            this.solar.declination, this.prevSolar.declination, this.nextSolar.declination);


        // Methods

        this.hourAngle = function(angle, afterTransit) {
            return Astronomical.correctedHourAngle(this.approxTransit, angle, this.observer, afterTransit, this.solar.apparentSiderealTime,
                this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension,
                this.solar.declination, this.prevSolar.declination, this.nextSolar.declination);
        };

        this.afternoon = function(shadowLength) {
            // TODO source shadow angle calculation
            var tangent = Math.abs(this.observer.latitude - this.solar.declination);
            var inverse = shadowLength + Math.tan(degreesToRadians(tangent));
            var angle = radiansToDegrees(Math.atan(1.0 / inverse));

            return this.hourAngle(angle, true);
        }
    }

    function SolarCoordinates(julianDay) {

        /* declination: The declination of the sun, the angle between
         the rays of the Sun and the plane of the Earth's
         equator, in degrees. */

        /* rightAscension: Right ascension of the Sun, the angular distance on the
         celestial equator from the vernal equinox to the hour circle,
         in degrees. */

        /* apparentSiderealTime: Apparent sidereal time, the hour angle of the vernal
         equinox, in degrees. */

        var T = Astronomical.julianCentury(julianDay);
        var L0 = Astronomical.meanSolarLongitude(T);
        var Lp = Astronomical.meanLunarLongitude(T);
        var Omega = Astronomical.ascendingLunarNodeLongitude(T);
        var Lambda = degreesToRadians(Astronomical.apparentSolarLongitude(T, L0));

        var Theta0 = Astronomical.meanSiderealTime(T);
        var dPsi = Astronomical.nutationInLongitude(T, L0, Lp, Omega);
        var dEpsilon = Astronomical.nutationInObliquity(T, L0, Lp, Omega);

        var Epsilon0 = Astronomical.meanObliquityOfTheEcliptic(T);
        var EpsilonApparent = degreesToRadians(Astronomical.apparentObliquityOfTheEcliptic(T, Epsilon0));

        /* Equation from Astronomical Algorithms page 165 */
        this.declination = radiansToDegrees(Math.asin(Math.sin(EpsilonApparent) * Math.sin(Lambda)));

        /* Equation from Astronomical Algorithms page 165 */
        this.rightAscension = unwindAngle(radiansToDegrees(Math.atan2(Math.cos(EpsilonApparent) * Math.sin(Lambda), Math.cos(Lambda))));

        /* Equation from Astronomical Algorithms page 88 */
        this.apparentSiderealTime = Theta0 + (((dPsi * 3600) * Math.cos(degreesToRadians(Epsilon0 + dEpsilon))) / 3600);
    }

    var Astronomical = {

        /* The geometric mean longitude of the sun in degrees. */
        meanSolarLongitude: function(julianCentury) {
            var T = julianCentury;
            /* Equation from Astronomical Algorithms page 163 */
            var term1 = 280.4664567;
            var term2 = 36000.76983 * T;
            var term3 = 0.0003032 * Math.pow(T, 2);
            var L0 = term1 + term2 + term3;
            return unwindAngle(L0);
        },

        /* The geometric mean longitude of the moon in degrees. */
        meanLunarLongitude: function(julianCentury) {
            var T = julianCentury;
            /* Equation from Astronomical Algorithms page 144 */
            var term1 = 218.3165;
            var term2 = 481267.8813 * T;
            var Lp = term1 + term2;
            return unwindAngle(Lp);
        },

        ascendingLunarNodeLongitude: function(julianCentury) {
            var T = julianCentury;
            /* Equation from Astronomical Algorithms page 144 */
            var term1 = 125.04452;
            var term2 = 1934.136261 * T;
            var term3 = 0.0020708 * Math.pow(T, 2);
            var term4 = Math.pow(T, 3) / 450000;
            var Omega = term1 - term2 + term3 + term4;
            return unwindAngle(Omega);
        },

        /* The mean anomaly of the sun. */
        meanSolarAnomaly: function(julianCentury) {
            var T = julianCentury;
            /* Equation from Astronomical Algorithms page 163 */
            var term1 = 357.52911;
            var term2 = 35999.05029 * T;
            var term3 = 0.0001537 * Math.pow(T, 2);
            var M = term1 + term2 - term3;
            return unwindAngle(M);
        },

        /* The Sun's equation of the center in degrees. */
        solarEquationOfTheCenter: function(julianCentury, meanAnomaly) {
            var T = julianCentury;
            /* Equation from Astronomical Algorithms page 164 */
            var Mrad = degreesToRadians(meanAnomaly);
            var term1 = (1.914602 - (0.004817 * T) - (0.000014 * Math.pow(T, 2))) * Math.sin(Mrad);
            var term2 = (0.019993 - (0.000101 * T)) * Math.sin(2 * Mrad);
            var term3 = 0.000289 * Math.sin(3 * Mrad);
            return term1 + term2 + term3;
        },

        /* The apparent longitude of the Sun, referred to the
         true equinox of the date. */
        apparentSolarLongitude: function(julianCentury, meanLongitude) {
            var T = julianCentury;
            var L0 = meanLongitude;
            /* Equation from Astronomical Algorithms page 164 */
            var longitude = L0 + Astronomical.solarEquationOfTheCenter(T, Astronomical.meanSolarAnomaly(T));
            var Omega = 125.04 - (1934.136 * T);
            var Lambda = longitude - 0.00569 - (0.00478 * Math.sin(degreesToRadians(Omega)));
            return unwindAngle(Lambda);
        },

        /* The mean obliquity of the ecliptic, formula
         adopted by the International Astronomical Union.
         Represented in degrees. */
        meanObliquityOfTheEcliptic: function(julianCentury) {
            var T = julianCentury;
            /* Equation from Astronomical Algorithms page 147 */
            var term1 = 23.439291;
            var term2 = 0.013004167 * T;
            var term3 = 0.0000001639 * Math.pow(T, 2);
            var term4 = 0.0000005036 * Math.pow(T, 3);
            return term1 - term2 - term3 + term4;
        },

        /* The mean obliquity of the ecliptic, corrected for
         calculating the apparent position of the sun, in degrees. */
        apparentObliquityOfTheEcliptic: function(julianCentury, meanObliquityOfTheEcliptic) {
            var T = julianCentury;
            var Epsilon0 = meanObliquityOfTheEcliptic;
            /* Equation from Astronomical Algorithms page 165 */
            var O = 125.04 - (1934.136 * T);
            return Epsilon0 + (0.00256 * Math.cos(degreesToRadians(O)));
        },

        /* Mean sidereal time, the hour angle of the vernal equinox, in degrees. */
        meanSiderealTime: function(julianCentury) {
            var T = julianCentury;
            /* Equation from Astronomical Algorithms page 165 */
            var JD = (T * 36525) + 2451545.0;
            var term1 = 280.46061837;
            var term2 = 360.98564736629 * (JD - 2451545);
            var term3 = 0.000387933 * Math.pow(T, 2);
            var term4 = Math.pow(T, 3) / 38710000;
            var Theta = term1 + term2 + term3 - term4;
            return unwindAngle(Theta)
        },

        nutationInLongitude: function(julianCentury, solarLongitude, lunarLongitude, ascendingNode) {
            var L0 = solarLongitude;
            var Lp = lunarLongitude;
            var Omega = ascendingNode;
            /* Equation from Astronomical Algorithms page 144 */
            var term1 = (-17.2/3600) * Math.sin(degreesToRadians(Omega));
            var term2 =  (1.32/3600) * Math.sin(2 * degreesToRadians(L0));
            var term3 =  (0.23/3600) * Math.sin(2 * degreesToRadians(Lp));
            var term4 =  (0.21/3600) * Math.sin(2 * degreesToRadians(Omega));
            return term1 - term2 - term3 + term4;
        },

        nutationInObliquity: function(julianCentury, solarLongitude, lunarLongitude, ascendingNode) {
            var L0 = solarLongitude;
            var Lp = lunarLongitude;
            var Omega = ascendingNode;
            /* Equation from Astronomical Algorithms page 144 */
            var term1 =  (9.2/3600) * Math.cos(degreesToRadians(Omega));
            var term2 = (0.57/3600) * Math.cos(2 * degreesToRadians(L0));
            var term3 = (0.10/3600) * Math.cos(2 * degreesToRadians(Lp));
            var term4 = (0.09/3600) * Math.cos(2 * degreesToRadians(Omega));
            return term1 + term2 + term3 - term4;
        },

        altitudeOfCelestialBody: function(observerLatitude, declination, localHourAngle) {
            var Phi = observerLatitude;
            var delta = declination;
            var H = localHourAngle;
            /* Equation from Astronomical Algorithms page 93 */
            var term1 = Math.sin(degreesToRadians(Phi)) * Math.sin(degreesToRadians(delta));
            var term2 = Math.cos(degreesToRadians(Phi)) * Math.cos(degreesToRadians(delta)) * Math.cos(degreesToRadians(H));
            return radiansToDegrees(Math.asin(term1 + term2));
        },

        approximateTransit: function(longitude, siderealTime, rightAscension) {
            var L = longitude;
            var Theta0 = siderealTime;
            var a2 = rightAscension;
            /* Equation from page Astronomical Algorithms 102 */
            var Lw = L * -1;
            return normalizeToScale((a2 + Lw - Theta0) / 360, 1);
        },

        /* The time at which the sun is at its highest point in the sky (in universal time) */
        correctedTransit: function(approximateTransit, longitude, siderealTime, rightAscension, previousRightAscension, nextRightAscension) {
            var m0 = approximateTransit;
            var L = longitude;
            var Theta0 = siderealTime;
            var a2 = rightAscension;
            var a1 = previousRightAscension;
            var a3 = nextRightAscension;
            /* Equation from page Astronomical Algorithms 102 */
            var Lw = L * -1;
            var Theta = unwindAngle((Theta0 + (360.985647 * m0)));
            var a = unwindAngle(Astronomical.interpolateAngles(a2, a1, a3, m0));
            var H = quadrantShiftAngle(Theta - Lw - a);
            var dm = H / -360;
            return (m0 + dm) * 24;
        },

        correctedHourAngle: function(approximateTransit, angle, coordinates, afterTransit, siderealTime,
                                     rightAscension, previousRightAscension, nextRightAscension, declination, previousDeclination, nextDeclination) {
            var m0 = approximateTransit;
            var h0 = angle;
            var Theta0 = siderealTime;
            var a2 = rightAscension;
            var a1 = previousRightAscension;
            var a3 = nextRightAscension;
            var d2 = declination;
            var d1 = previousDeclination;
            var d3 = nextDeclination;

            /* Equation from page Astronomical Algorithms 102 */
            var Lw = coordinates.longitude * -1;
            var term1 = Math.sin(degreesToRadians(h0)) - (Math.sin(degreesToRadians(coordinates.latitude)) * Math.sin(degreesToRadians(d2)));
            var term2 = Math.cos(degreesToRadians(coordinates.latitude)) * Math.cos(degreesToRadians(d2));
            var H0 = radiansToDegrees(Math.acos(term1 / term2));
            var m = afterTransit ? m0 + (H0 / 360) : m0 - (H0 / 360);
            var Theta = unwindAngle((Theta0 + (360.985647 * m)));
            var a = unwindAngle(Astronomical.interpolateAngles(a2, a1, a3, m));
            var delta = Astronomical.interpolate(d2, d1, d3, m);
            var H = (Theta - Lw - a);
            var h = Astronomical.altitudeOfCelestialBody(coordinates.latitude, delta, H);
            var term3 = h - h0;
            var term4 = 360 * Math.cos(degreesToRadians(delta)) * Math.cos(degreesToRadians(coordinates.latitude)) * Math.sin(degreesToRadians(H));
            var dm = term3 / term4;
            return (m + dm) * 24;
        },

        /* Interpolation of a value given equidistant
         previous and next values and a factor
         equal to the fraction of the interpolated
         point's time over the time between values. */
        interpolate: function(y2, y1, y3, n) {
            /* Equation from Astronomical Algorithms page 24 */
            var a = y2 - y1;
            var b = y3 - y2;
            var c = b - a;
            return y2 + ((n/2) * (a + b + (n * c)));
        },

        /* Interpolation of three angles, accounting for
         angle unwinding. */
        interpolateAngles: function(y2, y1, y3, n) {
            /* Equation from Astronomical Algorithms page 24 */
            var a = unwindAngle(y2 - y1);
            var b = unwindAngle(y3 - y2);
            var c = b - a;
            return y2 + ((n/2) * (a + b + (n * c)));
        },

        /* The Julian Day for a given Gregorian date. */
        julianDay: function(year, month, day, hours) {
            /* Equation from Astronomical Algorithms page 60 */
            if (typeof hours === 'undefined') {
                hours = 0;
            }

            var Y = trunc(month > 2 ? year : year - 1);
            var M = trunc(month > 2 ? month : month + 12);
            var D = day + (hours / 24);

            var A = trunc(Y/100);
            var B = trunc(2 - A + trunc(A/4));

            var i0 = trunc(365.25 * (Y + 4716));
            var i1 = trunc(30.6001 * (M + 1));

            return i0 + i1 + D + B - 1524.5;
        },

        /* Julian century from the epoch. */
        julianCentury: function(julianDay) {
            /* Equation from Astronomical Algorithms page 163 */
            return (julianDay - 2451545.0) / 36525;
        },

        /* Whether or not a year is a leap year (has 366 days). */
        isLeapYear: function(year) {
            if (year % 4 != 0) {
                return false;
            }

            if (year % 100 == 0 && year % 400 != 0) {
                return false;
            }

            return true;
        },

        seasonAdjustedMorningTwilight: function(latitude, dayOfYear, year, sunrise) {
            var a = 75 + ((28.65 / 55.0) * Math.abs(latitude));
            var b = 75 + ((19.44 / 55.0) * Math.abs(latitude));
            var c = 75 + ((32.74 / 55.0) * Math.abs(latitude));
            var d = 75 + ((48.10 / 55.0) * Math.abs(latitude));

            var adjustment = (function() {
                var dyy = Astronomical.daysSinceSolstice(dayOfYear, year, latitude);
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

        seasonAdjustedEveningTwilight: function(latitude, dayOfYear, year, sunset) {
            var a = 75 + ((25.60 / 55.0) * Math.abs(latitude));
            var b = 75 + ((2.050 / 55.0) * Math.abs(latitude));
            var c = 75 - ((9.210 / 55.0) * Math.abs(latitude));
            var d = 75 + ((6.140 / 55.0) * Math.abs(latitude));

            var adjustment = (function() {
                var dyy = Astronomical.daysSinceSolstice(dayOfYear, year, latitude);
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

        daysSinceSolstice: function(dayOfYear, year, latitude) {
            var daysSinceSolstice = 0;
            var northernOffset = 10;
            var southernOffset = Astronomical.isLeapYear(year) ? 173 : 172;
            var daysInYear = Astronomical.isLeapYear(year) ? 366 : 365;

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


    //
    // Math convenience extensions
    //

    function timeComponents(number) {
        return new TimeComponents(number);
    }

    function TimeComponents(number) {
        this.hours = Math.floor(number);
        this.minutes = Math.floor((number - this.hours) * 60);
        this.seconds = Math.floor((number - (this.hours + this.minutes/60)) * 60 * 60);
        return this;
    }

    TimeComponents.prototype.UTCDate = function (year, month, date) {
        return new Date(Date.UTC(year, month, date, this.hours, this.minutes, this.seconds));
    };

    function degreesToRadians(degrees) {
        return (degrees * Math.PI) / 180.0;
    }

    function radiansToDegrees(radians) {
        return (radians * 180.0) / Math.PI;
    }

    function normalizeToScale(number, max) {
        return number - (max * (Math.floor(number / max)))
    }

    function unwindAngle(angle) {
        return normalizeToScale(angle, 360.0);
    }

    function quadrantShiftAngle(angle) {
        if (angle >= -180 && angle <= 180) {
            return angle;
        }

        return angle - (360 * Math.round(angle/360));
    }

    function formattedTime(date, UTCOffset, style) {
        var offset = dateByAddingHours(date, UTCOffset);
        var hours, minutes;
        if (style == '24h') {
            hours = offset.getUTCHours().toString();
            if (hours.length < 2) {
                hours = '0' + hours;
            }

            minutes = offset.getUTCMinutes().toString();
            if (minutes.length < 2) {
                minutes = '0' + minutes;
            }

            return hours + ':' + minutes;
        } else {
            hours = offset.getUTCHours() > 12 ? (offset.getUTCHours() - 12).toString() : offset.getUTCHours().toString();
            hours = hours == 0 ? 12 : hours;
            minutes = offset.getUTCMinutes().toString();
            if (minutes.length < 2) {
                minutes = '0' + minutes;
            }
            var ampm = offset.getUTCHours() >= 12 ? 'PM' : 'AM';

            return hours + ':' + minutes + ' ' + ampm;
        }
    }

    function dateByAddingDays(date, days) {
        var year = date.getUTCFullYear();
        var month = date.getUTCMonth();
        var day = date.getUTCDate() + days;
        var hours = date.getUTCHours();
        var minutes = date.getUTCMinutes();
        var seconds = date.getUTCSeconds();
        return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    }

    function dateByAddingHours(date, hours) {
        return dateByAddingMinutes(date, hours * 60);
    }

    function dateByAddingMinutes(date, minutes) {
        return dateByAddingSeconds(date, minutes * 60);
    }

    function dateByAddingSeconds(date, seconds) {
        return new Date(date.getTime() + (seconds * 1000));
    }

    function roundedMinute(date) {
        var seconds = date.getUTCSeconds();
        var offset = seconds >= 30 ? 60 - seconds : -1 * seconds;
        return dateByAddingSeconds(date, offset);
    }

    function dayOfYear(date) {
        var returnedDayOfYear = 0;
        var feb = Astronomical.isLeapYear(date.getFullYear()) ? 29 : 28;
        var months = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (var i = 0; i < date.getMonth(); i++) {
            returnedDayOfYear += months[i];
        }

        returnedDayOfYear += date.getDate();

        return returnedDayOfYear;
    }

    function julianDate(date) {
        return Astronomical.julianDay(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours() + (date.getMinutes() / 60));
    }

    //
    // Polyfill
    //

    var trunc = Math.trunc || function (x) { return x < 0 ? Math.ceil(x) : Math.floor(x); };


    var adhan = {
        Prayer: Prayer,
        Madhab: Madhab,
        HighLatitudeRule: HighLatitudeRule,
        Coordinates: Coordinates,
        CalculationParameters: CalculationParameters,
        CalculationMethod: CalculationMethod,
        PrayerTimes: PrayerTimes,
        Qibla: Qibla,
        SolarTime: SolarTime,
        SolarCoordinates: SolarCoordinates,
        Astronomical: Astronomical,
        Math: {
            degreesToRadians: degreesToRadians,
            radiansToDegrees: radiansToDegrees,
            normalizeToScale: normalizeToScale,
            unwindAngle: unwindAngle,
            quadrantShiftAngle: quadrantShiftAngle,
            timeComponents: timeComponents
        },
        Date: {
            formattedTime: formattedTime,
            dateByAddingDays: dateByAddingDays,
            dateByAddingHours: dateByAddingHours,
            dateByAddingMinutes: dateByAddingMinutes,
            dateByAddingSeconds: dateByAddingSeconds,
            roundedMinute: roundedMinute,
            dayOfYear: dayOfYear,
            julianDate: julianDate
        }
    };

    return adhan;
}));
