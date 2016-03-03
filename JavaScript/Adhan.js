//
// Calendrical equations
//

/* The Julian Day for a given Gregorian date. */
function julianDay(year, month, day, hours) {
    
    /* Equation from Astronomical Algorithms page 60 */
    if (typeof hours === 'undefined') {
        hours = 0;
    }

    var Y = Math.trunc(month > 2 ? year : year - 1)
    var M = Math.trunc(month > 2 ? month : month + 12)
    var D = day + (hours / 24)

    var A = Math.trunc(Y/100)
    var B = Math.trunc(2 - A + Math.trunc(A/4))
    
    var i0 = Math.trunc(365.25 * (Y + 4716))
    var i1 = Math.trunc(30.6001 * (M + 1))

    return i0 + i1 + D + B - 1524.5
}

/* Julian century from the epoch. */
function julianCentury(julianDay) {
    /* Equation from Astronomical Algorithms page 163 */
    return (julianDay - 2451545.0) / 36525;
}

/* Whether or not a year is a leap year (has 366 days). */
function isLeapYear(year) {
	if (year % 4 != 0) {
        return false;
    }
    
    if (year % 100 == 0 && year % 400 != 0) {
        return false;
    }
    
    return true;
}

//
// Astronomical equations
//

/**
* Interpolation of a value given equidistant
* previous and next values and a factor
* equal to the fraction of the interpolated
* point's time over the time between values. 
* 
* @param {Number} y2 initial value
* @param {Number} y1 previous value
* @param {Number} y3 next value
* @param {Number} n interpolation factor
* @return {Number} interpolated value
*/
function interpolate(y2, y1, y3, n) {
    /* Equation from Astronomical Algorithms page 24 */
    var a = y2 - y1;
    var b = y3 - y2;
    var c = b - a;
    return y2 + ((n/2) * (a + b + (n * c)));
}

//
// Math convenience extensions
//

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