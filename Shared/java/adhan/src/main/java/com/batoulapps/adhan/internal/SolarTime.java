package com.batoulapps.adhan.internal;

import com.batoulapps.adhan.Coordinates;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

public class SolarTime {

  public final double transit;
  public final double sunrise;
  public final double sunset;

  private final Coordinates observer;
  private final SolarCoordinates solar;
  private final SolarCoordinates prevSolar;
  private final SolarCoordinates nextSolar;
  private double approximateTransit;

  public SolarTime(Date today, Coordinates coordinates) {
    Calendar calendar = GregorianCalendar.getInstance(TimeZone.getTimeZone("UTC"));
    calendar.setTime(today);

    calendar.add(Calendar.DATE, 1);
    final Date tomorrow = calendar.getTime();

    calendar.add(Calendar.DATE, -2);
    final Date yesterday = calendar.getTime();

    this.prevSolar = new SolarCoordinates(CalendricalHelper.julianDay(yesterday));
    this.solar = new SolarCoordinates(CalendricalHelper.julianDay(today));
    this.nextSolar = new SolarCoordinates(CalendricalHelper.julianDay(tomorrow));

    this.approximateTransit = Astronomical.approximateTransit(coordinates.longitude,
        solar.apparentSiderealTime, solar.rightAscension);
    final double solarAltitude = -50.0 / 60.0;

    this.observer = coordinates;
    this.transit = Astronomical.correctedTransit(this.approximateTransit, coordinates.longitude,
        solar.apparentSiderealTime, solar.rightAscension, prevSolar.rightAscension,
        nextSolar.rightAscension);
    this.sunrise = Astronomical.correctedHourAngle(this.approximateTransit, solarAltitude,
        coordinates, false, solar.apparentSiderealTime, solar.rightAscension,
        prevSolar.rightAscension, nextSolar.rightAscension, solar.declination,
        prevSolar.declination, nextSolar.declination);
    this.sunset = Astronomical.correctedHourAngle(this.approximateTransit, solarAltitude,
        coordinates, true, solar.apparentSiderealTime, solar.rightAscension,
        prevSolar.rightAscension, nextSolar.rightAscension, solar.declination,
        prevSolar.declination, nextSolar.declination);
  }

  public double hourAngle(double angle, boolean afterTransit) {
    return Astronomical.correctedHourAngle(this.approximateTransit, angle, this.observer,
        afterTransit, this.solar.apparentSiderealTime, this.solar.rightAscension,
        this.prevSolar.rightAscension, this.nextSolar.rightAscension, this.solar.declination,
        this.prevSolar.declination, this.nextSolar.declination);
  }

  // hours from transit
  public double afternoon(ShadowLength shadowLength) {
    // TODO (from Swift version) source shadow angle calculation
    final double tangent = Math.abs(observer.latitude - solar.declination);
    final double inverse = shadowLength.getShadowLength() + Math.tan(Math.toRadians(tangent));
    final double angle = Math.toDegrees(Math.atan(1.0 / inverse));

    return hourAngle(angle, true);
  }

}
