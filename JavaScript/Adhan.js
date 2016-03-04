
//
// Astronomical equations
//

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
    if (Number.isNaN(this)) {
        return null;
    }

    var hours = Math.floor(this);
    var minutes = Math.floor((this - hours) * 60);
    var seconds = Math.floor((this - (hours + minutes/60)) * 60 * 60)

    return new TimeComponents(hours, minutes, seconds);
}


//
// Polyfill
//

Math.trunc = Math.trunc || function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}

Number.isNaN = Number.isNaN || function(value) {
    return typeof value === "number" && isNaN(value);
}