package com.batoulapps.adhan.internal;

import com.batoulapps.adhan.Coordinates;

/**
 * Astronomical equations
 */
class Astronomical {

  /**
   * The geometric mean longitude of the sun in degrees.
   * @param T the julian century
   * @return the geometric longitude of the sun in degrees
   */
  static double meanSolarLongitude(double T) {
    /* Equation from Astronomical Algorithms page 163 */
    final double term1 = 280.4664567;
    final double term2 = 36000.76983 * T;
    final double term3 = 0.0003032 * Math.pow(T, 2);
    final double L0 = term1 + term2 + term3;
    return DoubleUtil.unwindAngle(L0);
  }

  /**
   * The geometric mean longitude of the moon in degrees
   * @param T the julian century
   * @return the geometric mean longitude of the moon in degrees
   */
  static double meanLunarLongitude(double T) {
    /* Equation from Astronomical Algorithms page 144 */
    final double term1 = 218.3165;
    final double term2 = 481267.8813 * T;
    final double Lp = term1 + term2;
    return DoubleUtil.unwindAngle(Lp);
  }

  /**
   * The apparent longitude of the Sun, referred to the true equinox of the date.
   * @param T the julian century
   * @param L0 the mean longitude
   * @return the true equinox of the date
   */
  static double apparentSolarLongitude(double T, double L0) {
    /* Equation from Astronomical Algorithms page 164 */
    final double longitude = L0 + solarEquationOfTheCenter(T, meanSolarAnomaly(T));
    final double Ω = 125.04 - (1934.136 * T);
    final double λ = longitude - 0.00569 - (0.00478 * Math.sin(Math.toRadians(Ω)));
    return DoubleUtil.unwindAngle(λ);
  }

  /**
   * The ascending lunar node longitude
   * @param T the julian century
   * @return the ascending lunar node longitude
   */
  static double ascendingLunarNodeLongitude(double T) {
    /* Equation from Astronomical Algorithms page 144 */
    final double term1 = 125.04452;
    final double term2 = 1934.136261 * T;
    final double term3 = 0.0020708 * Math.pow(T, 2);
    final double term4 = Math.pow(T, 3) / 450000;
    final double Ω = term1 - term2 + term3 + term4;
    return DoubleUtil.unwindAngle(Ω);
  }

  /**
   * The mean anomaly of the sun
   * @param T the julian century
   * @return the mean solar anomaly
   */
  static double meanSolarAnomaly(double T) {
    /* Equation from Astronomical Algorithms page 163 */
    final double term1 = 357.52911;
    final double term2 = 35999.05029 * T;
    final double term3 = 0.0001537 * Math.pow(T, 2);
    final double M = term1 + term2 - term3;
    return DoubleUtil.unwindAngle(M);
  }

  /**
   * The Sun's equation of the center in degrees.
   * @param T the julian century
   * @param M the mean anomaly
   * @return the sun's equation of the center in degrees
   */
  static double solarEquationOfTheCenter(double T, double M) {
    /* Equation from Astronomical Algorithms page 164 */
    final double Mrad = Math.toRadians(M);
    final double term1 = (1.914602 - (0.004817 * T) - (0.000014 * Math.pow(T, 2))) * Math.sin(Mrad);
    final double term2 = (0.019993 - (0.000101 * T)) * Math.sin(2 * Mrad);
    final double term3 = 0.000289 * Math.sin(3 * Mrad);
    return term1 + term2 + term3;
  }

  /**
   * The mean obliquity of the ecliptic in degrees
   * formula adopted by the International Astronomical Union.
   * @param T the julian century
   * @return the mean obliquity of the ecliptic in degrees
   */
  static double meanObliquityOfTheEcliptic(double T) {
    /* Equation from Astronomical Algorithms page 147 */
    final double term1 = 23.439291;
    final double term2 = 0.013004167 * T;
    final double term3 = 0.0000001639 * Math.pow(T, 2);
    final double term4 = 0.0000005036 * Math.pow(T, 3);
    return term1 - term2 - term3 + term4;
  }

  /**
   * The mean obliquity of the ecliptic, corrected for calculating the
   * apparent position of the sun, in degrees.
   * @param T the julian century
   * @param ε0 the mean obliquity of the ecliptic
   * @return the corrected mean obliquity of the ecliptic in degrees
   */
  static double apparentObliquityOfTheEcliptic(double T, double ε0) {
    /* Equation from Astronomical Algorithms page 165 */
    final double O = 125.04 - (1934.136 * T);
    return ε0 + (0.00256 * Math.cos(Math.toRadians(O)));
  }

  /**
   * Mean sidereal time, the hour angle of the vernal equinox, in degrees.
   * @param T the julian century
   * @return the mean sidereal time in degrees
   */
  static double meanSiderealTime(double T) {
    /* Equation from Astronomical Algorithms page 165 */
    final double JD = (T * 36525) + 2451545.0;
    final double term1 = 280.46061837;
    final double term2 = 360.98564736629 * (JD - 2451545);
    final double term3 = 0.000387933 * Math.pow(T, 2);
    final double term4 = Math.pow(T, 3) / 38710000;
    final double θ = term1 + term2 + term3 - term4;
    return DoubleUtil.unwindAngle(θ);
  }

  /**
   * Get the nutation in longitude
   * @param T the julian century
   * @param L0 the solar longitude
   * @param Lp the lunar longitude
   * @param Ω the ascending node
   * @return the nutation in longitude
   */
  static double nutationInLongitude(double T, double L0, double Lp, double Ω) {
    /* Equation from Astronomical Algorithms page 144 */
    final double term1 = (-17.2/3600) * Math.sin(Math.toRadians(Ω));
    final double term2 =  (1.32/3600) * Math.sin(2 * Math.toRadians(L0));
    final double term3 =  (0.23/3600) * Math.sin(2 * Math.toRadians(Lp));
    final double term4 =  (0.21/3600) * Math.sin(2 * Math.toRadians(Ω));
    return term1 - term2 - term3 + term4;
  }

  /**
   * Get the nutation in obliquity
   * @param T the julian century
   * @param L0 the solar longitude
   * @param Lp the lunar longitude
   * @param Ω the ascending node
   * @return the nutation in obliquity
   */
  static double nutationInObliquity(double T, double L0, double Lp, double Ω) {
    /* Equation from Astronomical Algorithms page 144 */
    final double term1 =  (9.2/3600) * Math.cos(Math.toRadians(Ω));
    final double term2 = (0.57/3600) * Math.cos(2 * Math.toRadians(L0));
    final double term3 = (0.10/3600) * Math.cos(2 * Math.toRadians(Lp));
    final double term4 = (0.09/3600) * Math.cos(2 * Math.toRadians(Ω));
    return term1 + term2 + term3 - term4;
  }

  /**
   * Return the altitude of the celestial body
   * @param φ the observer latitude
   * @param δ the declination
   * @param H the local hour angle
   * @return the altitude of the celestial body
   */
  static double altitudeOfCelestialBody(double φ, double δ, double H) {
    /* Equation from Astronomical Algorithms page 93 */
    final double term1 = Math.sin(Math.toRadians(φ)) * Math.sin(Math.toRadians(δ));
    final double term2 = Math.cos(Math.toRadians(φ)) *
        Math.cos(Math.toRadians(δ)) * Math.cos(Math.toRadians(H));
    return Math.toDegrees(Math.asin(term1 + term2));
  }

  /**
   * Return the approximate transite
   * @param L the longitude
   * @param Θ0 the sidereal time
   * @param α2 the right ascension
   * @return the approximate transite
   */
  static double approximateTransit(double L, double Θ0, double α2) {
    /* Equation from page Astronomical Algorithms 102 */
    final double Lw = L * -1;
    return DoubleUtil.normalizeWithBound((α2 + Lw - Θ0) / 360, 1);
  }

  /**
   * The time at which the sun is at its highest point in the sky (in universal time)
   * @param m0 approximate transit
   * @param L the longitude
   * @param Θ0 the sidereal time
   * @param α2 the right ascension
   * @param α1 the previous right ascension
   * @param α3 the next right ascension
   * @return the time (in universal time) when the sun is at its highest point in the sky
   */
  static double correctedTransit(double m0, double L, double Θ0, double α2, double α1, double α3) {
        /* Equation from page Astronomical Algorithms 102 */
    final double Lw = L * -1;
    final double θ = DoubleUtil.unwindAngle(Θ0 + (360.985647 * m0));
    final double α = DoubleUtil.unwindAngle(interpolateAngles(
            /* value */ α2, /* previousValue */ α1, /* nextValue */ α3, /* factor */ m0));
    final double H = DoubleUtil.closestAngle(θ - Lw - α);
    final double Δm = H / -360;
    return (m0 + Δm) * 24;
  }

  /**
   * Get the corrected hour angle
   * @param m0 the approximate transit
   * @param h0 the angle
   * @param coordinates the coordinates
   * @param afterTransit whether it's after transit
   * @param Θ0 the sidereal time
   * @param α2 the right ascension
   * @param α1 the previous right ascension
   * @param α3 the next right ascension
   * @param δ2 the declination
   * @param δ1 the previous declination
   * @param δ3 the next declination
   * @return the corrected hour angle
   */
  static double correctedHourAngle(double m0, double h0, Coordinates coordinates, boolean afterTransit,
      double Θ0, double α2, double α1, double α3, double δ2, double δ1, double δ3) {
    /* Equation from page Astronomical Algorithms 102 */
    final double Lw = coordinates.longitude * -1;
    final double term1 = Math.sin(Math.toRadians(h0)) -
        (Math.sin(Math.toRadians(coordinates.latitude)) * Math.sin(Math.toRadians(δ2)));
    final double term2 = Math.cos(Math.toRadians(coordinates.latitude)) * Math.cos(Math.toRadians(δ2));
    final double H0 = Math.toDegrees(Math.acos(term1 / term2));
    final double m = afterTransit ? m0 + (H0 / 360) : m0 - (H0 / 360);
    final double θ = DoubleUtil.unwindAngle(Θ0 + (360.985647 * m));
    final double α = DoubleUtil.unwindAngle(interpolateAngles(
        /* value */ α2, /* previousValue */ α1, /* nextValue */ α3, /* factor */ m));
    final double δ = interpolate(/* value */ δ2, /* previousValue */ δ1,
        /* nextValue */ δ3, /* factor */ m);
    final double H = (θ - Lw - α);
    final double h = altitudeOfCelestialBody(/* observerLatitude */ coordinates.latitude,
        /* declination */ δ, /* localHourAngle */ H);
    final double term3 = h - h0;
    final double term4 = 360 * Math.cos(Math.toRadians(δ)) *
        Math.cos(Math.toRadians(coordinates.latitude)) * Math.sin(Math.toRadians(H));
    final double Δm = term3 / term4;
    return (m + Δm) * 24;
  }

  /* Interpolation of a value given equidistant
  previous and next values and a factor
  equal to the fraction of the interpolated
  point's time over the time between values. */

  /**
   *
   * @param y2 the value
   * @param y1 the previous value
   * @param y3 the next value
   * @param n the factor
   * @return the interpolated value
   */
  static double interpolate(double y2, double y1, double y3, double n) {
    /* Equation from Astronomical Algorithms page 24 */
    final double a = y2 - y1;
    final double b = y3 - y2;
    final double c = b - a;
    return y2 + ((n/2) * (a + b + (n * c)));
  }

  /**
   * Interpolation of three angles, accounting for angle unwinding
   * @param y2 value
   * @param y1 previousValue
   * @param y3 nextValue
   * @param n factor
   * @return interpolated angle
   */
  static double interpolateAngles(double y2, double y1, double y3, double n) {
    /* Equation from Astronomical Algorithms page 24 */
    final double a = DoubleUtil.unwindAngle(y2 - y1);
    final double b = DoubleUtil.unwindAngle(y3 - y2);
    final double c = b - a;
    return y2 + ((n/2) * (a + b + (n * c)));
  }
}
