

function Coordinates(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
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
    this.solar = new SolarCoordinates(date.julianDate());

    var previous = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
    var next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    this.prevSolar = new SolarCoordinates(previous.julianDate());
    this.nextSolar = new SolarCoordinates(next.julianDate());

    var m0 = Solar.approximateTransit(coordinates.longitude, this.solar.apparentSiderealTime, this.solar.rightAscension);
    var solarAltitude = -50.0 / 60.0;

    this.approxTransit = m0;
    
    this.transit = Solar.correctedTransit(m0, coordinates.longitude, this.solar.apparentSiderealTime, 
        this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension);
    
    this.sunrise = Solar.correctedHourAngle(m0, solarAltitude, coordinates, false, this.solar.apparentSiderealTime, 
        this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension,
        this.solar.declination, this.prevSolar.declination, this.nextSolar.declination);

    this.sunset = Solar.correctedHourAngle(m0, solarAltitude, coordinates, true, this.solar.apparentSiderealTime,
        this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension,
        this.solar.declination, this.prevSolar.declination, this.nextSolar.declination);

    this.hourAngle = function(angle, afterTransit) {
        return Solar.correctedHourAngle(this.approxTransit, angle, this.observer, afterTransit, this.solar.apparentSiderealTime,
            this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension,
            this.solar.declination, this.prevSolar.declination, this.nextSolar.declination);
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

    var T = Solar.julianCentury(julianDay);
    var L0 = Solar.meanSolarLongitude(T);
    var Lp = Solar.meanLunarLongitude(T);
    var Omega = Solar.ascendingLunarNodeLongitude(T);
    var Lambda = Solar.apparentSolarLongitude(T, L0).degreesToRadians();
    
    var Theta0 = Solar.meanSiderealTime(T);
    var dPsi = Solar.nutationInLongitude(T, L0, Lp, Omega);
    var dEpsilon = Solar.nutationInObliquity(T, L0, Lp, Omega);
    
    var Epsilon0 = Solar.meanObliquityOfTheEcliptic(T);
    var EpsilonApparent = Solar.apparentObliquityOfTheEcliptic(T, Epsilon0).degreesToRadians();
    
    /* Equation from Astronomical Algorithms page 165 */
    this.declination = Math.asin(Math.sin(EpsilonApparent) * Math.sin(Lambda)).radiansToDegrees();
    
    /* Equation from Astronomical Algorithms page 165 */
    this.rightAscension = Math.atan2(Math.cos(EpsilonApparent) * Math.sin(Lambda), Math.cos(Lambda)).radiansToDegrees().unwindAngle();
    
    /* Equation from Astronomical Algorithms page 88 */
    this.apparentSiderealTime = Theta0 + (((dPsi * 3600) * Math.cos((Epsilon0 + dEpsilon).degreesToRadians())) / 3600);
}

var Solar = {

    /* The geometric mean longitude of the sun in degrees. */
    meanSolarLongitude: function(julianCentury) {
        var T = julianCentury;
        /* Equation from Astronomical Algorithms page 163 */
        var term1 = 280.4664567;
        var term2 = 36000.76983 * T;
        var term3 = 0.0003032 * Math.pow(T, 2);
        var L0 = term1 + term2 + term3;
        return L0.unwindAngle();
    },

    /* The geometric mean longitude of the moon in degrees. */
    meanLunarLongitude: function(julianCentury) {
        var T = julianCentury;
        /* Equation from Astronomical Algorithms page 144 */
        var term1 = 218.3165;
        var term2 = 481267.8813 * T;
        var Lp = term1 + term2;
        return Lp.unwindAngle();
    },

    ascendingLunarNodeLongitude: function(julianCentury) {
        var T = julianCentury;
        /* Equation from Astronomical Algorithms page 144 */
        var term1 = 125.04452;
        var term2 = 1934.136261 * T;
        var term3 = 0.0020708 * Math.pow(T, 2);
        var term4 = Math.pow(T, 3) / 450000;
        var Omega = term1 - term2 + term3 + term4;
        return Omega.unwindAngle();
    },

    /* The mean anomaly of the sun. */
    meanSolarAnomaly: function(julianCentury) {
        var T = julianCentury;
        /* Equation from Astronomical Algorithms page 163 */
        var term1 = 357.52911;
        var term2 = 35999.05029 * T;
        var term3 = 0.0001537 * Math.pow(T, 2);
        var M = term1 + term2 - term3;
        return M.unwindAngle();
    },

    /* The Sun's equation of the center in degrees. */
    solarEquationOfTheCenter: function(julianCentury, meanAnomaly) {
        var T = julianCentury;
        /* Equation from Astronomical Algorithms page 164 */
        var Mrad = meanAnomaly.degreesToRadians();
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
        var longitude = L0 + Solar.solarEquationOfTheCenter(T, Solar.meanSolarAnomaly(T));
        var Omega = 125.04 - (1934.136 * T);
        var Lambda = longitude - 0.00569 - (0.00478 * Math.sin(Omega.degreesToRadians()));
        return Lambda.unwindAngle();
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
        return Epsilon0 + (0.00256 * Math.cos(O.degreesToRadians()));
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
        return Theta.unwindAngle()
    },    

    nutationInLongitude: function(julianCentury, solarLongitude, lunarLongitude, ascendingNode) {
        var T = julianCentury;
        var L0 = solarLongitude;
        var Lp = lunarLongitude;
        var Omega = ascendingNode;
        /* Equation from Astronomical Algorithms page 144 */
        var term1 = (-17.2/3600) * Math.sin(Omega.degreesToRadians());
        var term2 =  (1.32/3600) * Math.sin(2 * L0.degreesToRadians());
        var term3 =  (0.23/3600) * Math.sin(2 * Lp.degreesToRadians());
        var term4 =  (0.21/3600) * Math.sin(2 * Omega.degreesToRadians());
        return term1 - term2 - term3 + term4;
    },

    nutationInObliquity: function(julianCentury, solarLongitude, lunarLongitude, ascendingNode) {
        var T = julianCentury;
        var L0 = solarLongitude;
        var Lp = lunarLongitude;
        var Omega = ascendingNode;
        /* Equation from Astronomical Algorithms page 144 */
        var term1 =  (9.2/3600) * Math.cos(Omega.degreesToRadians());
        var term2 = (0.57/3600) * Math.cos(2 * L0.degreesToRadians());
        var term3 = (0.10/3600) * Math.cos(2 * Lp.degreesToRadians());
        var term4 = (0.09/3600) * Math.cos(2 * Omega.degreesToRadians());
        return term1 + term2 + term3 - term4;
    },

    altitudeOfCelestialBody: function(observerLatitude, declination, localHourAngle) {
        var Phi = observerLatitude;
        var delta = declination;
        var H = localHourAngle;
        /* Equation from Astronomical Algorithms page 93 */
        var term1 = Math.sin(Phi.degreesToRadians()) * Math.sin(delta.degreesToRadians());
        var term2 = Math.cos(Phi.degreesToRadians()) * Math.cos(delta.degreesToRadians()) * Math.cos(H.degreesToRadians());
        return Math.asin(term1 + term2).radiansToDegrees();
    },

    approximateTransit: function(longitude, siderealTime, rightAscension) {
        var L = longitude;
        var Theta0 = siderealTime;
        var a2 = rightAscension;
        /* Equation from page Astronomical Algorithms 102 */
        var Lw = L * -1;
        return ((a2 + Lw - Theta0) / 360).normalizeWithBound(1);
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
        var Theta = (Theta0 + (360.985647 * m0)).unwindAngle();
        var a = Solar.interpolate(a2, a1, a3, m0);
        var H = (Theta - Lw - a);
        var dm = (H >= -180 && H <= 180) ? H / -360 : 0;
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
        var term1 = Math.sin(h0.degreesToRadians()) - (Math.sin(coordinates.latitude.degreesToRadians()) * Math.sin(d2.degreesToRadians()));
        var term2 = Math.cos(coordinates.latitude.degreesToRadians()) * Math.cos(d2.degreesToRadians());
        var H0 = Math.acos(term1 / term2).radiansToDegrees();
        var m = afterTransit ? m0 + (H0 / 360) : m0 - (H0 / 360);
        var Theta = (Theta0 + (360.985647 * m)).unwindAngle();
        var a = Solar.interpolate(a2, a1, a3, m);
        var delta = Solar.interpolate(d2, d1, d3, m);
        var H = (Theta - Lw - a);
        var h = Solar.altitudeOfCelestialBody(coordinates.latitude, delta, H);
        var term3 = h - h0;
        var term4 = 360 * Math.cos(delta.degreesToRadians()) * Math.cos(coordinates.latitude.degreesToRadians()) * Math.sin(H.degreesToRadians());
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

    /* The Julian Day for a given Gregorian date. */
    julianDay: function(year, month, day, hours) {
        /* Equation from Astronomical Algorithms page 60 */
        if (typeof hours === 'undefined') {
            hours = 0;
        }

        var Y = Math.trunc(month > 2 ? year : year - 1);
        var M = Math.trunc(month > 2 ? month : month + 12);
        var D = day + (hours / 24);

        var A = Math.trunc(Y/100);
        var B = Math.trunc(2 - A + Math.trunc(A/4));
        
        var i0 = Math.trunc(365.25 * (Y + 4716));
        var i1 = Math.trunc(30.6001 * (M + 1));

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

    daysSinceSolstice: function(dayOfYear, year, latitude) {
        var daysSinceSolstice = 0;
        var northernOffset = 10;
        var southernOffset = Solar.isLeapYear(year) ? 173 : 172;
        var daysInYear = Solar.isLeapYear(year) ? 366 : 365;
        
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

function TimeComponents(hours, minutes, seconds) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
}

Number.prototype.degreesToRadians = function() {
	return (this * Math.PI) / 180.0;
};

Number.prototype.radiansToDegrees = function() {
	return (this * 180.0) / Math.PI;
};

Number.prototype.normalizeWithBound = function(max) {
	return this - (max * (Math.floor(this / max)))
};

Number.prototype.unwindAngle = function() {
	return this.normalizeWithBound(360.0);
}

Number.prototype.timeComponents = function() {
    if (isNaN(this)) {
        return null;
    }

    var hours = Math.floor(this);
    var minutes = Math.floor((this - hours) * 60);
    var seconds = Math.floor((this - (hours + minutes/60)) * 60 * 60)

    return new TimeComponents(hours, minutes, seconds);
}

Date.prototype.dayOfYear = function() {
    var dayOfYear = 0;
    var feb = Solar.isLeapYear(this.getFullYear()) ? 29 : 28;
    var months = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (var i = 0; i < this.getMonth(); i++) {
        dayOfYear += months[i];
    }

    dayOfYear += this.getDate();

    return dayOfYear;
}

Date.prototype.julianDate = function() {
    return Solar.julianDay(this.getFullYear(), this.getMonth() + 1, this.getDate(), this.getHours() + (this.getMinutes() / 60));
}

//
// Polyfill
//

Math.trunc = Math.trunc || function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}
