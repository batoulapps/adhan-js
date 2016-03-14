package com.batoulapps.adhan.internal;

class SolarCoordinates {

  /**
   * The declination of the sun, the angle between
   * the rays of the Sun and the plane of the Earth's
   * equator, in degrees.
   */
  final double declination;

  /**
   *  Right ascension of the Sun, the angular distance on the
   * celestial equator from the vernal equinox to the hour circle,
   * in degrees.
   */
  final double rightAscension;

  /**
   *  Apparent sidereal time, the hour angle of the vernal
   * equinox, in degrees.
   */
  final double apparentSiderealTime;

  SolarCoordinates(double julianDay) {
    double T = CalendricalHelper.julianCentury(julianDay);
    double L0 = Astronomical.meanSolarLongitude(/* julianCentury */ T);
    double Lp = Astronomical.meanLunarLongitude(/* julianCentury */ T);
    double Ω = Astronomical.ascendingLunarNodeLongitude(/* julianCentury */ T);
    double λ = Math.toRadians(
        Astronomical.apparentSolarLongitude(/* julianCentury*/ T, /* meanLongitude */ L0));

    double θ0 = Astronomical.meanSiderealTime(/* julianCentury */ T);
    double ΔΨ = Astronomical.nutationInLongitude(/* julianCentury */ T, /* solarLongitude */ L0,
        /* lunarLongitude */ Lp, /* ascendingNode */ Ω);
    double Δε = Astronomical.nutationInObliquity(/* julianCentury */ T, /* solarLongitude */ L0,
        /* lunarLongitude */ Lp, /* ascendingNode */ Ω);

    double ε0 = Astronomical.meanObliquityOfTheEcliptic(/* julianCentury */ T);
    double εapp = Math.toRadians(Astronomical.apparentObliquityOfTheEcliptic(
        /* julianCentury */ T, /* meanObliquityOfTheEcliptic */ ε0));

        /* Equation from Astronomical Algorithms page 165 */
    this.declination = Math.toDegrees(Math.asin(Math.sin(εapp) * Math.sin(λ)));

        /* Equation from Astronomical Algorithms page 165 */
    this.rightAscension = DoubleUtil.unwindAngle(
        Math.toDegrees(Math.atan2(Math.cos(εapp) * Math.sin(λ), Math.cos(λ))));

        /* Equation from Astronomical Algorithms page 88 */
    this.apparentSiderealTime = θ0 + (((ΔΨ * 3600) * Math.cos(Math.toRadians(ε0 + Δε))) / 3600);
  }
}
