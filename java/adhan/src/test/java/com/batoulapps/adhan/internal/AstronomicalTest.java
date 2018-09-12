package com.batoulapps.adhan.internal;

import com.batoulapps.adhan.Coordinates;
import com.batoulapps.adhan.data.CalendarUtil;
import com.batoulapps.adhan.data.TimeComponents;

import org.junit.Test;

import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import static com.google.common.truth.Truth.assertThat;

public class AstronomicalTest {

  @Test
  public void testSolarCoordinates() {

    // values from Astronomical Algorithms page 165

    double jd = CalendricalHelper.julianDay(/* year */ 1992, /* month */ 10, /* day */ 13);
    SolarCoordinates solar = new SolarCoordinates(/* julianDay */ jd);

    double T = CalendricalHelper.julianCentury(/* julianDay */ jd);
    double L0 = Astronomical.meanSolarLongitude(/* julianCentury */ T);
    double ε0 = Astronomical.meanObliquityOfTheEcliptic(/* julianCentury */ T);
    final double εapp = Astronomical.apparentObliquityOfTheEcliptic(
        /* julianCentury */ T, /* meanObliquityOfTheEcliptic */ ε0);
    final double M = Astronomical.meanSolarAnomaly(/* julianCentury */ T);
    final double C = Astronomical.solarEquationOfTheCenter(
        /* julianCentury */ T, /* meanAnomaly */ M);
    final double λ = Astronomical.apparentSolarLongitude(
        /* julianCentury */ T, /* meanLongitude */ L0);
    final double δ = solar.declination;
    final double α = DoubleUtil.unwindAngle(solar.rightAscension);

    assertThat(T).isWithin(0.00000000001).of(-0.072183436);

    assertThat(L0).isWithin(0.00001).of(201.80720);

    assertThat(ε0).isWithin(0.00001).of(23.44023);

    assertThat(εapp).isWithin(0.00001).of(23.43999);

    assertThat(M).isWithin(0.00001).of(278.99397);

    assertThat(C).isWithin(0.00001).of(-1.89732);

    // lower accuracy than desired
    assertThat(λ).isWithin(0.00002).of(199.90895);

    assertThat(δ).isWithin(0.00001).of(-7.78507);

    assertThat(α).isWithin(0.00001).of(198.38083);

    // values from Astronomical Algorithms page 88

    jd = CalendricalHelper.julianDay(/* year */ 1987, /* month */ 4, /* day */ 10);
    solar = new SolarCoordinates(/* julianDay */ jd);
    T = CalendricalHelper.julianCentury(/* julianDay */ jd);

    final double θ0 = Astronomical.meanSiderealTime(/* julianCentury */ T);
    final double θapp = solar.apparentSiderealTime;
    final double Ω = Astronomical.ascendingLunarNodeLongitude(/* julianCentury */ T);
    ε0 = Astronomical.meanObliquityOfTheEcliptic(/* julianCentury */ T);
    L0 = Astronomical.meanSolarLongitude(/* julianCentury */ T);
    final double Lp = Astronomical.meanLunarLongitude(/* julianCentury */ T);
    final double ΔΨ = Astronomical.nutationInLongitude(/* julianCentury */ T,
        /* solarLongitude */ L0, /* lunarLongitude */ Lp, /* ascendingNode */ Ω);
    final double Δε = Astronomical.nutationInObliquity(/* julianCentury */ T,
        /* solarLongitude */ L0, /* lunarLongitude */ Lp, /* ascendingNode */ Ω);
    final double ε = ε0 + Δε;

    assertThat(θ0).isWithin(0.000001).of(197.693195);

    assertThat(θapp).isWithin(0.0001).of(197.6922295833);

    // values from Astronomical Algorithms page 148

    assertThat(Ω).isWithin(0.0001).of(11.2531);

    assertThat(ΔΨ).isWithin(0.0001).of(-0.0010522);

    assertThat(Δε).isWithin(0.00001).of(0.0026230556);

    assertThat(ε0).isWithin(0.000001).of(23.4409463889);

    assertThat(ε).isWithin(0.00001).of(23.4435694444);
  }

  @Test
  public void testRightAscensionEdgeCase() {
    SolarTime previousTime = null;
    final Coordinates coordinates = new Coordinates(35 + 47.0/60.0, -78 - 39.0/60.0);
    for (int i = 0; i < 365; i++) {
      SolarTime time = new SolarTime(
          TestUtils.makeDateWithOffset(2016, 1, 1, i, Calendar.DAY_OF_YEAR), coordinates);
      if (i > 0) {
        // transit from one day to another should not differ more than one minute
        assertThat(Math.abs(time.transit - previousTime.transit)).isLessThan(1.0/60.0);

        // sunrise and sunset from one day to another should not differ more than two minutes
        assertThat(Math.abs(time.sunrise - previousTime.sunrise)).isLessThan(2.0/60.0);
        assertThat(Math.abs(time.sunset - previousTime.sunset)).isLessThan(2.0/60.0);
      }
      previousTime = time;
    }
  }

  @Test
  public void testAltitudeOfCelestialBody() {
    final double φ = 38 + (55 / 60.0) + (17.0 / 3600);
    final double δ = -6 - (43 / 60.0) - (11.61 / 3600);
    final double H = 64.352133;
    final double h = Astronomical.altitudeOfCelestialBody(
        /* observerLatitude */ φ, /* declination */ δ, /* localHourAngle */ H);
    assertThat(h).isWithin(0.0001).of(15.1249);
  }

  @Test
  public void testTransitAndHourAngle() {
    // values from Astronomical Algorithms page 103
    final double longitude = -71.0833;
    final double Θ = 177.74208;
    final double α1 = 40.68021;
    final double α2 = 41.73129;
    final double α3 = 42.78204;
    final double m0 = Astronomical.approximateTransit(longitude,
        /* siderealTime */ Θ, /* rightAscension */ α2);

    assertThat(m0).isWithin(0.00001).of(0.81965);

    final double transit = Astronomical.correctedTransit(
        /* approximateTransit */ m0, longitude, /* siderealTime */ Θ,
        /* rightAscension */ α2, /* previousRightAscension */ α1,
        /* nextRightAscension */ α3) / 24;

    assertThat(transit).isWithin(0.00001).of(0.81980);

    final double δ1 = 18.04761;
    final double δ2 = 18.44092;
    final double δ3 = 18.82742;

    final double rise = Astronomical.correctedHourAngle(/* approximateTransit */ m0,
        /* angle */ -0.5667, new Coordinates(/* latitude */ 42.3333, longitude),
        /* afterTransit */ false, /* siderealTime */ Θ,
        /* rightAscension */ α2, /* previousRightAscension */ α1,
        /* nextRightAscension */ α3, /* declination */ δ2,
        /* previousDeclination */ δ1, /* nextDeclination */ δ3) / 24;
    assertThat(rise).isWithin(0.00001).of(0.51766);
  }

  @Test
  public void testSolarTime() {
    /*
     * Comparison values generated from
     * http://aa.usno.navy.mil/rstt/onedaytable?form=1&ID=AA&year=2015&month=7&day=12&state=NC&place=raleigh
     */

    final Coordinates coordinates = new Coordinates(35 + 47.0/60.0, -78 - 39.0/60.0);
    final SolarTime solar = new SolarTime(TestUtils.makeDate(2015, 7, 12), coordinates);

    final double transit = solar.transit;
    final double sunrise = solar.sunrise;
    final double sunset = solar.sunset;
    final double twilightStart = solar.hourAngle(-6, /* afterTransit */ false);
    final double twilightEnd = solar.hourAngle(-6, /* afterTransit */ true);
    final double invalid = solar.hourAngle(-36, /* afterTransit */ true);
    assertThat(timeString(twilightStart)).isEqualTo("9:38");
    assertThat(timeString(sunrise)).isEqualTo("10:08");
    assertThat(timeString(transit)).isEqualTo("17:20");
    assertThat(timeString(sunset)).isEqualTo("24:32");
    assertThat(timeString(twilightEnd)).isEqualTo("25:02");
    assertThat(timeString(invalid)).isEqualTo("");
  }

  private String timeString(double when) {
    final TimeComponents components = TimeComponents.fromDouble(when);
    if (components == null) {
      return "";
    }

    final int minutes = (int) (components.minutes + Math.round(components.seconds / 60.0));
    return String.format(Locale.US, "%d:%02d", components.hours, minutes);
  }

  @Test
  public void testCalendricalDate() {
    // generated from http://aa.usno.navy.mil/data/docs/RS_OneYear.php for KUKUIHAELE, HAWAII
    final Coordinates coordinates = new Coordinates(
        /* latitude */ 20 + 7.0/60.0, /* longitude */ -155.0 - 34.0/60.0);
    final SolarTime day1solar = new SolarTime(TestUtils.makeDate(2015, 4, /* day */ 2), coordinates);
    final SolarTime day2solar = new SolarTime(TestUtils.makeDate(2015, 4, 3), coordinates);

    final double day1 = day1solar.sunrise;
    final double day2 = day2solar.sunrise;

    assertThat(timeString(day1)).isEqualTo("16:15");
    assertThat(timeString(day2)).isEqualTo("16:14");
  }

  @Test
  public void testInterpolation() {
    // values from Astronomical Algorithms page 25
    final double interpolatedValue = Astronomical.interpolate(/* value */ 0.877366,
        /* previousValue */ 0.884226, /* nextValue */ 0.870531, /* factor */ 4.35/24);
    assertThat(interpolatedValue).isWithin(0.000001).of(0.876125);

    final double i1 = Astronomical.interpolate(
        /* value */ 1, /* previousValue */ -1, /* nextValue */ 3, /* factor */ 0.6);
    assertThat(i1).isWithin(0.000001).of(2.2);
  }

  @Test
  public void testAngleInterpolation() {
    final double i1 = Astronomical.interpolateAngles(/* value */ 1, /* previousValue */ -1,
        /* nextValue */ 3, /* factor */ 0.6);
    assertThat(i1).isWithin(0.000001).of(2.2);

    final double i2 = Astronomical.interpolateAngles(/* value */ 1, /* previousValue */ 359,
        /* nextValue */ 3, /* factor */ 0.6);
    assertThat(i2).isWithin(0.000001).of(2.2);
  }

  @Test
  public void testJulianDay() {
    /*
     * Comparison values generated from http://aa.usno.navy.mil/data/docs/JulianDate.php
     */

    assertThat(CalendricalHelper.julianDay(/* year */ 2010, /* month */ 1, /* day */ 2))
        .isWithin(0.00001).of(2455198.500000);
    assertThat(CalendricalHelper.julianDay(/* year */ 2011, /* month */ 2, /* day */ 4))
        .isWithin(0.00001).of(2455596.500000);
    assertThat(CalendricalHelper.julianDay(/* year */ 2012, /* month */ 3, /* day */ 6))
        .isWithin(0.00001).of(2455992.500000);
    assertThat(CalendricalHelper.julianDay(/* year */ 2013, /* month */ 4, /* day */ 8))
        .isWithin(0.00001).of(2456390.500000);
    assertThat(CalendricalHelper.julianDay(/* year */ 2014, /* month */ 5, /* day */ 10))
        .isWithin(0.00001).of(2456787.500000);
    assertThat(CalendricalHelper.julianDay(/* year */ 2015, /* month */ 6, /* day */ 12))
        .isWithin(0.00001).of(2457185.500000);
    assertThat(CalendricalHelper.julianDay(/* year */ 2016, /* month */ 7, /* day */ 14))
        .isWithin(0.00001).of(2457583.500000);
    assertThat(CalendricalHelper.julianDay(/* year */ 2017, /* month */ 8, /* day */ 16))
        .isWithin(0.00001).of(2457981.500000);
    assertThat(CalendricalHelper.julianDay(/* year */ 2018, /* month */ 9, /* day */ 18))
        .isWithin(0.00001).of(2458379.500000);
    assertThat(CalendricalHelper.julianDay(/* year */ 2019, /* month */ 10, /* day */ 20))
        .isWithin(0.00001).of(2458776.500000);
    assertThat(CalendricalHelper.julianDay(/* year */ 2020, /* month */ 11, /* day */ 22))
        .isWithin(0.00001).of(2459175.500000);
    assertThat(CalendricalHelper.julianDay(/* year */ 2021, /* month */ 12, /* day */ 24))
        .isWithin(0.00001).of(2459572.500000);

    final double jdVal = 2457215.67708333;
    assertThat(
        CalendricalHelper.julianDay(/* year */ 2015, /* month */ 7, /* day */ 12, /* hours */ 4.25))
        .isWithin(0.000001).of(jdVal);

    Date components = TestUtils.makeDate(/* year */ 2015, /* month */ 7, /* day */ 12,
        /* hour */ 4, /* minute */ 15);
    assertThat(CalendricalHelper.julianDay(components)).isWithin(0.000001).of(jdVal);

    assertThat(CalendricalHelper
        .julianDay(/* year */ 2015, /* month */ 7, /* day */ 12, /* hours */ 8.0))
        .isWithin(0.000001)
        .of(2457215.833333);
    assertThat(CalendricalHelper
        .julianDay(/* year */ 1992, /* month */ 10, /* day */ 13, /* hours */ 0.0))
        .isWithin(0.000001)
        .of(2448908.5);
  }

  @Test
  public void testJulianHours() {
    final double j1 = CalendricalHelper.julianDay(/* year */ 2010, /* month */ 1, /* day */ 3);
    final double j2 = CalendricalHelper.julianDay(/* year */ 2010,
        /* month */ 1, /* day */ 1, /* hours */ 48);
    assertThat(j1).isWithin(0.0000001).of(j2);
  }

  @Test
  public void testLeapYear() {
    assertThat(CalendarUtil.isLeapYear(2015)).isFalse();
    assertThat(CalendarUtil.isLeapYear(2016)).isTrue();
    assertThat(CalendarUtil.isLeapYear(1600)).isTrue();
    assertThat(CalendarUtil.isLeapYear(2000)).isTrue();
    assertThat(CalendarUtil.isLeapYear(2400)).isTrue();
    assertThat(CalendarUtil.isLeapYear(1700)).isFalse();
    assertThat(CalendarUtil.isLeapYear(1800)).isFalse();
    assertThat(CalendarUtil.isLeapYear(1900)).isFalse();
    assertThat(CalendarUtil.isLeapYear(2100)).isFalse();
    assertThat(CalendarUtil.isLeapYear(2200)).isFalse();
    assertThat(CalendarUtil.isLeapYear(2300)).isFalse();
    assertThat(CalendarUtil.isLeapYear(2500)).isFalse();
    assertThat(CalendarUtil.isLeapYear(2600)).isFalse();
  }
}