(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["adhan"] = factory();
	else
		root["adhan"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/Coordinates.js
class Coordinates {
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

}
// CONCATENATED MODULE: ./src/MathUtils.js
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180.0;
}
function radiansToDegrees(radians) {
  return radians * 180.0 / Math.PI;
}
function normalizeToScale(number, max) {
  return number - max * Math.floor(number / max);
}
function unwindAngle(angle) {
  return normalizeToScale(angle, 360.0);
}
function quadrantShiftAngle(angle) {
  if (angle >= -180 && angle <= 180) {
    return angle;
  }

  return angle - 360 * Math.round(angle / 360);
}
// CONCATENATED MODULE: ./src/DateUtils.js

function dateByAddingDays(date, days) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate() + days;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return new Date(year, month, day, hours, minutes, seconds);
}
function dateByAddingMinutes(date, minutes) {
  return dateByAddingSeconds(date, minutes * 60);
}
function dateByAddingSeconds(date, seconds) {
  return new Date(date.getTime() + seconds * 1000);
}
function roundedMinute(date) {
  const seconds = date.getUTCSeconds();
  const offset = seconds >= 30 ? 60 - seconds : -1 * seconds;
  return dateByAddingSeconds(date, offset);
}
function DateUtils_dayOfYear(date) {
  let returnedDayOfYear = 0;
  const feb = src_Astronomical.isLeapYear(date.getFullYear()) ? 29 : 28;
  const months = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  for (let i = 0; i < date.getMonth(); i++) {
    returnedDayOfYear += months[i];
  }

  returnedDayOfYear += date.getDate();
  return returnedDayOfYear;
}
// CONCATENATED MODULE: ./src/Astronomical.js


const Astronomical = {
  /* The geometric mean longitude of the sun in degrees. */
  meanSolarLongitude: function (julianCentury) {
    const T = julianCentury;
    /* Equation from Astronomical Algorithms page 163 */

    const term1 = 280.4664567;
    const term2 = 36000.76983 * T;
    const term3 = 0.0003032 * Math.pow(T, 2);
    const L0 = term1 + term2 + term3;
    return unwindAngle(L0);
  },

  /* The geometric mean longitude of the moon in degrees. */
  meanLunarLongitude: function (julianCentury) {
    const T = julianCentury;
    /* Equation from Astronomical Algorithms page 144 */

    const term1 = 218.3165;
    const term2 = 481267.8813 * T;
    const Lp = term1 + term2;
    return unwindAngle(Lp);
  },
  ascendingLunarNodeLongitude: function (julianCentury) {
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
  meanSolarAnomaly: function (julianCentury) {
    const T = julianCentury;
    /* Equation from Astronomical Algorithms page 163 */

    const term1 = 357.52911;
    const term2 = 35999.05029 * T;
    const term3 = 0.0001537 * Math.pow(T, 2);
    const M = term1 + term2 - term3;
    return unwindAngle(M);
  },

  /* The Sun's equation of the center in degrees. */
  solarEquationOfTheCenter: function (julianCentury, meanAnomaly) {
    const T = julianCentury;
    /* Equation from Astronomical Algorithms page 164 */

    const Mrad = degreesToRadians(meanAnomaly);
    const term1 = (1.914602 - 0.004817 * T - 0.000014 * Math.pow(T, 2)) * Math.sin(Mrad);
    const term2 = (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad);
    const term3 = 0.000289 * Math.sin(3 * Mrad);
    return term1 + term2 + term3;
  },

  /* The apparent longitude of the Sun, referred to the
      true equinox of the date. */
  apparentSolarLongitude: function (julianCentury, meanLongitude) {
    const T = julianCentury;
    const L0 = meanLongitude;
    /* Equation from Astronomical Algorithms page 164 */

    const longitude = L0 + Astronomical.solarEquationOfTheCenter(T, Astronomical.meanSolarAnomaly(T));
    const Omega = 125.04 - 1934.136 * T;
    const Lambda = longitude - 0.00569 - 0.00478 * Math.sin(degreesToRadians(Omega));
    return unwindAngle(Lambda);
  },

  /* The mean obliquity of the ecliptic, formula
      adopted by the International Astronomical Union.
      Represented in degrees. */
  meanObliquityOfTheEcliptic: function (julianCentury) {
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
  apparentObliquityOfTheEcliptic: function (julianCentury, meanObliquityOfTheEcliptic) {
    const T = julianCentury;
    const Epsilon0 = meanObliquityOfTheEcliptic;
    /* Equation from Astronomical Algorithms page 165 */

    const O = 125.04 - 1934.136 * T;
    return Epsilon0 + 0.00256 * Math.cos(degreesToRadians(O));
  },

  /* Mean sidereal time, the hour angle of the vernal equinox, in degrees. */
  meanSiderealTime: function (julianCentury) {
    const T = julianCentury;
    /* Equation from Astronomical Algorithms page 165 */

    const JD = T * 36525 + 2451545.0;
    const term1 = 280.46061837;
    const term2 = 360.98564736629 * (JD - 2451545);
    const term3 = 0.000387933 * Math.pow(T, 2);
    const term4 = Math.pow(T, 3) / 38710000;
    const Theta = term1 + term2 + term3 - term4;
    return unwindAngle(Theta);
  },
  nutationInLongitude: function (julianCentury, solarLongitude, lunarLongitude, ascendingNode) {
    const L0 = solarLongitude;
    const Lp = lunarLongitude;
    const Omega = ascendingNode;
    /* Equation from Astronomical Algorithms page 144 */

    const term1 = -17.2 / 3600 * Math.sin(degreesToRadians(Omega));
    const term2 = 1.32 / 3600 * Math.sin(2 * degreesToRadians(L0));
    const term3 = 0.23 / 3600 * Math.sin(2 * degreesToRadians(Lp));
    const term4 = 0.21 / 3600 * Math.sin(2 * degreesToRadians(Omega));
    return term1 - term2 - term3 + term4;
  },
  nutationInObliquity: function (julianCentury, solarLongitude, lunarLongitude, ascendingNode) {
    const L0 = solarLongitude;
    const Lp = lunarLongitude;
    const Omega = ascendingNode;
    /* Equation from Astronomical Algorithms page 144 */

    const term1 = 9.2 / 3600 * Math.cos(degreesToRadians(Omega));
    const term2 = 0.57 / 3600 * Math.cos(2 * degreesToRadians(L0));
    const term3 = 0.10 / 3600 * Math.cos(2 * degreesToRadians(Lp));
    const term4 = 0.09 / 3600 * Math.cos(2 * degreesToRadians(Omega));
    return term1 + term2 + term3 - term4;
  },
  altitudeOfCelestialBody: function (observerLatitude, declination, localHourAngle) {
    const Phi = observerLatitude;
    const delta = declination;
    const H = localHourAngle;
    /* Equation from Astronomical Algorithms page 93 */

    const term1 = Math.sin(degreesToRadians(Phi)) * Math.sin(degreesToRadians(delta));
    const term2 = Math.cos(degreesToRadians(Phi)) * Math.cos(degreesToRadians(delta)) * Math.cos(degreesToRadians(H));
    return radiansToDegrees(Math.asin(term1 + term2));
  },
  approximateTransit: function (longitude, siderealTime, rightAscension) {
    const L = longitude;
    const Theta0 = siderealTime;
    const a2 = rightAscension;
    /* Equation from page Astronomical Algorithms 102 */

    const Lw = L * -1;
    return normalizeToScale((a2 + Lw - Theta0) / 360, 1);
  },

  /* The time at which the sun is at its highest point in the sky (in universal time) */
  correctedTransit: function (approximateTransit, longitude, siderealTime, rightAscension, previousRightAscension, nextRightAscension) {
    const m0 = approximateTransit;
    const L = longitude;
    const Theta0 = siderealTime;
    const a2 = rightAscension;
    const a1 = previousRightAscension;
    const a3 = nextRightAscension;
    /* Equation from page Astronomical Algorithms 102 */

    const Lw = L * -1;
    const Theta = unwindAngle(Theta0 + 360.985647 * m0);
    const a = unwindAngle(Astronomical.interpolateAngles(a2, a1, a3, m0));
    const H = quadrantShiftAngle(Theta - Lw - a);
    const dm = H / -360;
    return (m0 + dm) * 24;
  },
  correctedHourAngle: function (approximateTransit, angle, coordinates, afterTransit, siderealTime, rightAscension, previousRightAscension, nextRightAscension, declination, previousDeclination, nextDeclination) {
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
    const term1 = Math.sin(degreesToRadians(h0)) - Math.sin(degreesToRadians(coordinates.latitude)) * Math.sin(degreesToRadians(d2));
    const term2 = Math.cos(degreesToRadians(coordinates.latitude)) * Math.cos(degreesToRadians(d2));
    const H0 = radiansToDegrees(Math.acos(term1 / term2));
    const m = afterTransit ? m0 + H0 / 360 : m0 - H0 / 360;
    const Theta = unwindAngle(Theta0 + 360.985647 * m);
    const a = unwindAngle(Astronomical.interpolateAngles(a2, a1, a3, m));
    const delta = Astronomical.interpolate(d2, d1, d3, m);
    const H = Theta - Lw - a;
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
  interpolate: function (y2, y1, y3, n) {
    /* Equation from Astronomical Algorithms page 24 */
    const a = y2 - y1;
    const b = y3 - y2;
    const c = b - a;
    return y2 + n / 2 * (a + b + n * c);
  },

  /* Interpolation of three angles, accounting for
      angle unwinding. */
  interpolateAngles: function (y2, y1, y3, n) {
    /* Equation from Astronomical Algorithms page 24 */
    const a = unwindAngle(y2 - y1);
    const b = unwindAngle(y3 - y2);
    const c = b - a;
    return y2 + n / 2 * (a + b + n * c);
  },

  /* The Julian Day for the given Gregorian date components. */
  julianDay: function (year, month, day, hours) {
    /* Equation from Astronomical Algorithms page 60 */
    if (typeof hours === 'undefined') {
      hours = 0;
    }

    const trunc = Math.trunc || function (x) {
      return x < 0 ? Math.ceil(x) : Math.floor(x);
    };

    const Y = trunc(month > 2 ? year : year - 1);
    const M = trunc(month > 2 ? month : month + 12);
    const D = day + hours / 24;
    const A = trunc(Y / 100);
    const B = trunc(2 - A + trunc(A / 4));
    const i0 = trunc(365.25 * (Y + 4716));
    const i1 = trunc(30.6001 * (M + 1));
    return i0 + i1 + D + B - 1524.5;
  },

  /* Julian century from the epoch. */
  julianCentury: function (julianDay) {
    /* Equation from Astronomical Algorithms page 163 */
    return (julianDay - 2451545.0) / 36525;
  },

  /* Whether or not a year is a leap year (has 366 days). */
  isLeapYear: function (year) {
    if (year % 4 != 0) {
      return false;
    }

    if (year % 100 == 0 && year % 400 != 0) {
      return false;
    }

    return true;
  },
  seasonAdjustedMorningTwilight: function (latitude, dayOfYear, year, sunrise) {
    const a = 75 + 28.65 / 55.0 * Math.abs(latitude);
    const b = 75 + 19.44 / 55.0 * Math.abs(latitude);
    const c = 75 + 32.74 / 55.0 * Math.abs(latitude);
    const d = 75 + 48.10 / 55.0 * Math.abs(latitude);

    const adjustment = function () {
      const dyy = Astronomical.daysSinceSolstice(dayOfYear, year, latitude);

      if (dyy < 91) {
        return a + (b - a) / 91.0 * dyy;
      } else if (dyy < 137) {
        return b + (c - b) / 46.0 * (dyy - 91);
      } else if (dyy < 183) {
        return c + (d - c) / 46.0 * (dyy - 137);
      } else if (dyy < 229) {
        return d + (c - d) / 46.0 * (dyy - 183);
      } else if (dyy < 275) {
        return c + (b - c) / 46.0 * (dyy - 229);
      } else {
        return b + (a - b) / 91.0 * (dyy - 275);
      }
    }();

    return dateByAddingSeconds(sunrise, Math.round(adjustment * -60.0));
  },
  seasonAdjustedEveningTwilight: function (latitude, dayOfYear, year, sunset) {
    const a = 75 + 25.60 / 55.0 * Math.abs(latitude);
    const b = 75 + 2.050 / 55.0 * Math.abs(latitude);
    const c = 75 - 9.210 / 55.0 * Math.abs(latitude);
    const d = 75 + 6.140 / 55.0 * Math.abs(latitude);

    const adjustment = function () {
      const dyy = Astronomical.daysSinceSolstice(dayOfYear, year, latitude);

      if (dyy < 91) {
        return a + (b - a) / 91.0 * dyy;
      } else if (dyy < 137) {
        return b + (c - b) / 46.0 * (dyy - 91);
      } else if (dyy < 183) {
        return c + (d - c) / 46.0 * (dyy - 137);
      } else if (dyy < 229) {
        return d + (c - d) / 46.0 * (dyy - 183);
      } else if (dyy < 275) {
        return c + (b - c) / 46.0 * (dyy - 229);
      } else {
        return b + (a - b) / 91.0 * (dyy - 275);
      }
    }();

    return dateByAddingSeconds(sunset, Math.round(adjustment * 60.0));
  },
  daysSinceSolstice: function (dayOfYear, year, latitude) {
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
/* harmony default export */ var src_Astronomical = (Astronomical);
// CONCATENATED MODULE: ./src/SolarCoordinates.js


class SolarCoordinates_SolarCoordinates {
  constructor(julianDay) {
    const T = src_Astronomical.julianCentury(julianDay);
    const L0 = src_Astronomical.meanSolarLongitude(T);
    const Lp = src_Astronomical.meanLunarLongitude(T);
    const Omega = src_Astronomical.ascendingLunarNodeLongitude(T);
    const Lambda = degreesToRadians(src_Astronomical.apparentSolarLongitude(T, L0));
    const Theta0 = src_Astronomical.meanSiderealTime(T);
    const dPsi = src_Astronomical.nutationInLongitude(T, L0, Lp, Omega);
    const dEpsilon = src_Astronomical.nutationInObliquity(T, L0, Lp, Omega);
    const Epsilon0 = src_Astronomical.meanObliquityOfTheEcliptic(T);
    const EpsilonApparent = degreesToRadians(src_Astronomical.apparentObliquityOfTheEcliptic(T, Epsilon0));
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

    this.apparentSiderealTime = Theta0 + dPsi * 3600 * Math.cos(degreesToRadians(Epsilon0 + dEpsilon)) / 3600;
  }

}
// CONCATENATED MODULE: ./src/SolarTime.js



class SolarTime_SolarTime {
  constructor(date, coordinates) {
    const julianDay = src_Astronomical.julianDay(date.getFullYear(), date.getMonth() + 1, date.getDate(), 0);
    this.observer = coordinates;
    this.solar = new SolarCoordinates_SolarCoordinates(julianDay);
    this.prevSolar = new SolarCoordinates_SolarCoordinates(julianDay - 1);
    this.nextSolar = new SolarCoordinates_SolarCoordinates(julianDay + 1);
    const m0 = src_Astronomical.approximateTransit(coordinates.longitude, this.solar.apparentSiderealTime, this.solar.rightAscension);
    const solarAltitude = -50.0 / 60.0;
    this.approxTransit = m0;
    this.transit = src_Astronomical.correctedTransit(m0, coordinates.longitude, this.solar.apparentSiderealTime, this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension);
    this.sunrise = src_Astronomical.correctedHourAngle(m0, solarAltitude, coordinates, false, this.solar.apparentSiderealTime, this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension, this.solar.declination, this.prevSolar.declination, this.nextSolar.declination);
    this.sunset = src_Astronomical.correctedHourAngle(m0, solarAltitude, coordinates, true, this.solar.apparentSiderealTime, this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension, this.solar.declination, this.prevSolar.declination, this.nextSolar.declination);
  }

  hourAngle(angle, afterTransit) {
    return src_Astronomical.correctedHourAngle(this.approxTransit, angle, this.observer, afterTransit, this.solar.apparentSiderealTime, this.solar.rightAscension, this.prevSolar.rightAscension, this.nextSolar.rightAscension, this.solar.declination, this.prevSolar.declination, this.nextSolar.declination);
  }

  afternoon(shadowLength) {
    // TODO source shadow angle calculation
    const tangent = Math.abs(this.observer.latitude - this.solar.declination);
    const inverse = shadowLength + Math.tan(degreesToRadians(tangent));
    const angle = radiansToDegrees(Math.atan(1.0 / inverse));
    return this.hourAngle(angle, true);
  }

}
// CONCATENATED MODULE: ./src/TimeComponents.js
class TimeComponents {
  constructor(number) {
    this.hours = Math.floor(number);
    this.minutes = Math.floor((number - this.hours) * 60);
    this.seconds = Math.floor((number - (this.hours + this.minutes / 60)) * 60 * 60);
    return this;
  }

  utcDate(year, month, date) {
    return new Date(Date.UTC(year, month, date, this.hours, this.minutes, this.seconds));
  }

}
// CONCATENATED MODULE: ./src/Prayer.js
const Prayer = {
  Fajr: 'fajr',
  Sunrise: 'sunrise',
  Dhuhr: 'dhuhr',
  Asr: 'asr',
  Maghrib: 'maghrib',
  Isha: 'isha',
  None: 'none'
};
/* harmony default export */ var src_Prayer = (Prayer);
// CONCATENATED MODULE: ./src/Madhab.js
const Madhab = {
  Shafi: 'shafi',
  Hanafi: 'hanafi'
};
function Madhab_shadowLength(madhab) {
  switch (madhab) {
    case Madhab.Shafi:
      return 1;

    case Madhab.Hanafi:
      return 2;

    default:
      throw "Invalid Madhab";
  }
}
// CONCATENATED MODULE: ./src/PrayerTimes.js






class PrayerTimes_PrayerTimes {
  constructor(coordinates, date, calculationParameters) {
    this.coordinates = coordinates;
    this.date = date;
    this.calculationParameters = calculationParameters;
    var solarTime = new SolarTime_SolarTime(date, coordinates);
    var fajrTime;
    var sunriseTime;
    var dhuhrTime;
    var asrTime;
    var maghribTime;
    var ishaTime;
    var nightFraction;
    dhuhrTime = new TimeComponents(solarTime.transit).utcDate(date.getFullYear(), date.getMonth(), date.getDate());
    sunriseTime = new TimeComponents(solarTime.sunrise).utcDate(date.getFullYear(), date.getMonth(), date.getDate());
    var sunsetTime = new TimeComponents(solarTime.sunset).utcDate(date.getFullYear(), date.getMonth(), date.getDate());
    asrTime = new TimeComponents(solarTime.afternoon(Madhab_shadowLength(calculationParameters.madhab))).utcDate(date.getFullYear(), date.getMonth(), date.getDate());
    var tomorrow = dateByAddingDays(date, 1);
    var tomorrowSolarTime = new SolarTime_SolarTime(tomorrow, coordinates);
    var tomorrowSunrise = new TimeComponents(tomorrowSolarTime.sunrise).utcDate(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    var night = (tomorrowSunrise - sunsetTime) / 1000;
    fajrTime = new TimeComponents(solarTime.hourAngle(-1 * calculationParameters.fajrAngle, false)).utcDate(date.getFullYear(), date.getMonth(), date.getDate()); // special case for moonsighting committee above latitude 55

    if (calculationParameters.method == "MoonsightingCommittee" && coordinates.latitude >= 55) {
      nightFraction = night / 7;
      fajrTime = dateByAddingSeconds(sunriseTime, -nightFraction);
    }

    var safeFajr = function () {
      if (calculationParameters.method == "MoonsightingCommittee") {
        return src_Astronomical.seasonAdjustedMorningTwilight(coordinates.latitude, DateUtils_dayOfYear(date), date.getFullYear(), sunriseTime);
      } else {
        var portion = calculationParameters.nightPortions().fajr;
        nightFraction = portion * night;
        return dateByAddingSeconds(sunriseTime, -nightFraction);
      }
    }();

    if (fajrTime == null || isNaN(fajrTime.getTime()) || safeFajr > fajrTime) {
      fajrTime = safeFajr;
    }

    if (calculationParameters.ishaInterval > 0) {
      ishaTime = dateByAddingMinutes(sunsetTime, calculationParameters.ishaInterval);
    } else {
      ishaTime = new TimeComponents(solarTime.hourAngle(-1 * calculationParameters.ishaAngle, true)).utcDate(date.getFullYear(), date.getMonth(), date.getDate()); // special case for moonsighting committee above latitude 55

      if (calculationParameters.method == "MoonsightingCommittee" && coordinates.latitude >= 55) {
        nightFraction = night / 7;
        ishaTime = dateByAddingSeconds(sunsetTime, nightFraction);
      }

      var safeIsha = function () {
        if (calculationParameters.method == "MoonsightingCommittee") {
          return src_Astronomical.seasonAdjustedEveningTwilight(coordinates.latitude, DateUtils_dayOfYear(date), date.getFullYear(), sunsetTime);
        } else {
          var portion = calculationParameters.nightPortions().isha;
          nightFraction = portion * night;
          return dateByAddingSeconds(sunsetTime, nightFraction);
        }
      }();

      if (ishaTime == null || isNaN(ishaTime.getTime()) || safeIsha < ishaTime) {
        ishaTime = safeIsha;
      }
    }

    maghribTime = sunsetTime;

    if (calculationParameters.maghribAngle) {
      let angleBasedMaghrib = new TimeComponents(solarTime.hourAngle(-1 * calculationParameters.maghribAngle, true)).utcDate(date.getFullYear(), date.getMonth(), date.getDate());

      if (sunsetTime < angleBasedMaghrib && ishaTime > angleBasedMaghrib) {
        maghribTime = angleBasedMaghrib;
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
  }

  timeForPrayer(prayer) {
    if (prayer == src_Prayer.Fajr) {
      return this.fajr;
    } else if (prayer == src_Prayer.Sunrise) {
      return this.sunrise;
    } else if (prayer == src_Prayer.Dhuhr) {
      return this.dhuhr;
    } else if (prayer == src_Prayer.Asr) {
      return this.asr;
    } else if (prayer == src_Prayer.Maghrib) {
      return this.maghrib;
    } else if (prayer == src_Prayer.Isha) {
      return this.isha;
    } else {
      return null;
    }
  }

  currentPrayer(date) {
    if (typeof date === 'undefined') {
      date = new Date();
    }

    if (date >= this.isha) {
      return src_Prayer.Isha;
    } else if (date >= this.maghrib) {
      return src_Prayer.Maghrib;
    } else if (date >= this.asr) {
      return src_Prayer.Asr;
    } else if (date >= this.dhuhr) {
      return src_Prayer.Dhuhr;
    } else if (date >= this.sunrise) {
      return src_Prayer.Sunrise;
    } else if (date >= this.fajr) {
      return src_Prayer.Fajr;
    } else {
      return src_Prayer.None;
    }
  }

  nextPrayer(date) {
    if (typeof date === 'undefined') {
      date = new Date();
    }

    if (date >= this.isha) {
      return src_Prayer.None;
    } else if (date >= this.maghrib) {
      return src_Prayer.Isha;
    } else if (date >= this.asr) {
      return src_Prayer.Maghrib;
    } else if (date >= this.dhuhr) {
      return src_Prayer.Asr;
    } else if (date >= this.sunrise) {
      return src_Prayer.Dhuhr;
    } else if (date >= this.fajr) {
      return src_Prayer.Sunrise;
    } else {
      return src_Prayer.Fajr;
    }
  }

}
// CONCATENATED MODULE: ./src/HighLatitudeRule.js
const HighLatitudeRule = {
  MiddleOfTheNight: 'middleofthenight',
  SeventhOfTheNight: 'seventhofthenight',
  TwilightAngle: 'twilightangle'
};
/* harmony default export */ var src_HighLatitudeRule = (HighLatitudeRule);
// CONCATENATED MODULE: ./src/CalculationParameters.js


class CalculationParameters_CalculationParameters {
  constructor(methodName, fajrAngle, ishaAngle, ishaInterval, maghribAngle) {
    this.method = methodName || "Other";
    this.fajrAngle = fajrAngle || 0;
    this.ishaAngle = ishaAngle || 0;
    this.ishaInterval = ishaInterval || 0;
    this.maghribAngle = maghribAngle;
    this.madhab = Madhab.Shafi;
    this.highLatitudeRule = src_HighLatitudeRule.MiddleOfTheNight;
    this.adjustments = {
      fajr: 0,
      sunrise: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0
    };
    this.methodAdjustments = {
      fajr: 0,
      sunrise: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0
    };
  }

  nightPortions() {
    switch (this.highLatitudeRule) {
      case src_HighLatitudeRule.MiddleOfTheNight:
        return {
          fajr: 1 / 2,
          isha: 1 / 2
        };

      case src_HighLatitudeRule.SeventhOfTheNight:
        return {
          fajr: 1 / 7,
          isha: 1 / 7
        };

      case src_HighLatitudeRule.TwilightAngle:
        return {
          fajr: this.fajrAngle / 60,
          isha: this.ishaAngle / 60
        };

      default:
        throw `Invalid high latitude rule found when attempting to compute night portions: ${this.highLatitudeRule}`;
    }
  }

}
// CONCATENATED MODULE: ./src/CalculationMethod.js

const CalculationMethod = {
  // Muslim World League
  MuslimWorldLeague: function () {
    let params = new CalculationParameters_CalculationParameters("MuslimWorldLeague", 18, 17);
    params.methodAdjustments = {
      dhuhr: 1
    };
    return params;
  },
  // Egyptian General Authority of Survey
  Egyptian: function () {
    let params = new CalculationParameters_CalculationParameters("Egyptian", 19.5, 17.5);
    params.methodAdjustments = {
      dhuhr: 1
    };
    return params;
  },
  // University of Islamic Sciences, Karachi
  Karachi: function () {
    let params = new CalculationParameters_CalculationParameters("Karachi", 18, 18);
    params.methodAdjustments = {
      dhuhr: 1
    };
    return params;
  },
  // Umm al-Qura University, Makkah
  UmmAlQura: function () {
    return new CalculationParameters_CalculationParameters("UmmAlQura", 18.5, 0, 90);
  },
  // Dubai
  Dubai: function () {
    let params = new CalculationParameters_CalculationParameters("Dubai", 18.2, 18.2);
    params.methodAdjustments = {
      sunrise: -3,
      dhuhr: 3,
      asr: 3,
      maghrib: 3
    };
    return params;
  },
  // Moonsighting Committee
  MoonsightingCommittee: function () {
    let params = new CalculationParameters_CalculationParameters("MoonsightingCommittee", 18, 18);
    params.methodAdjustments = {
      dhuhr: 5,
      maghrib: 3
    };
    return params;
  },
  // ISNA
  NorthAmerica: function () {
    let params = new CalculationParameters_CalculationParameters("NorthAmerica", 15, 15);
    params.methodAdjustments = {
      dhuhr: 1
    };
    return params;
  },
  // Kuwait
  Kuwait: function () {
    return new CalculationParameters_CalculationParameters("Kuwait", 18, 17.5);
  },
  // Qatar
  Qatar: function () {
    return new CalculationParameters_CalculationParameters("Qatar", 18, 0, 90);
  },
  // Singapore
  Singapore: function () {
    let params = new CalculationParameters_CalculationParameters("Singapore", 20, 18);
    params.methodAdjustments = {
      dhuhr: 1
    };
    return params;
  },
  // Institute of Geophysics, University of Tehran
  Tehran: function () {
    let params = new CalculationParameters_CalculationParameters("Tehran", 17.7, 14, 0, 4.5);
    return params;
  },
  // Dianet
  Turkey: function () {
    let params = new CalculationParameters_CalculationParameters("Turkey", 18, 17);
    params.methodAdjustments = {
      sunrise: -7,
      dhuhr: 5,
      asr: 4,
      maghrib: 7
    };
    return params;
  },
  // Other
  Other: function () {
    return new CalculationParameters_CalculationParameters("Other", 0, 0);
  }
};
/* harmony default export */ var src_CalculationMethod = (CalculationMethod);
// CONCATENATED MODULE: ./src/Qibla.js


function qibla(coordinates) {
  const makkah = new Coordinates(21.4225241, 39.8261818); // Equation from "Spherical Trigonometry For the use of colleges and schools" page 50

  const term1 = Math.sin(degreesToRadians(makkah.longitude) - degreesToRadians(coordinates.longitude));
  const term2 = Math.cos(degreesToRadians(coordinates.latitude)) * Math.tan(degreesToRadians(makkah.latitude));
  const term3 = Math.sin(degreesToRadians(coordinates.latitude)) * Math.cos(degreesToRadians(makkah.longitude) - degreesToRadians(coordinates.longitude));
  const angle = Math.atan2(term1, term2 - term3);
  return unwindAngle(radiansToDegrees(angle));
}
// CONCATENATED MODULE: ./src/SunnahTimes.js


class SunnahTimes_SunnahTimes {
  constructor(prayerTimes) {
    const date = prayerTimes.date;
    const nextDay = dateByAddingDays(date, 1);
    const nextDayPrayerTimes = new PrayerTimes_PrayerTimes(prayerTimes.coordinates, nextDay, prayerTimes.calculationParameters);
    const nightDuration = (nextDayPrayerTimes.fajr.getTime() - prayerTimes.maghrib.getTime()) / 1000.0;
    this.middleOfTheNight = roundedMinute(dateByAddingSeconds(prayerTimes.maghrib, nightDuration / 2));
    this.lastThirdOfTheNight = roundedMinute(dateByAddingSeconds(prayerTimes.maghrib, nightDuration * (2 / 3)));
  }

}
// CONCATENATED MODULE: ./src/Adhan.js









const adhan = {
  Prayer: src_Prayer,
  Madhab: Madhab,
  HighLatitudeRule: src_HighLatitudeRule,
  Coordinates: Coordinates,
  CalculationParameters: CalculationParameters_CalculationParameters,
  CalculationMethod: src_CalculationMethod,
  PrayerTimes: PrayerTimes_PrayerTimes,
  SunnahTimes: SunnahTimes_SunnahTimes,
  Qibla: qibla
};
/* harmony default export */ var Adhan = __webpack_exports__["default"] = (adhan);

/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=Adhan.js.map