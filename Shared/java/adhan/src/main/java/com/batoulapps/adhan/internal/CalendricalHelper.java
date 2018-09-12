package com.batoulapps.adhan.internal;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

class CalendricalHelper {

  /**
   * The Julian Day for a given Gregorian date
   * @param year the year
   * @param month the month
   * @param day the day
   * @return the julian day
   */
  static double julianDay(int year, int month, int day) {
    return julianDay(year, month, day, 0.0);
  }

  /**
   * The Julian Day for a given date
   * @param date the date
   * @return the julian day
   */
  static double julianDay(Date date) {
    Calendar calendar = GregorianCalendar.getInstance(TimeZone.getTimeZone("UTC"));
    calendar.setTime(date);
    return julianDay(calendar.get(Calendar.YEAR),
        calendar.get(Calendar.MONTH) + 1, calendar.get(Calendar.DAY_OF_MONTH),
        calendar.get(Calendar.HOUR_OF_DAY) + calendar.get(Calendar.MINUTE) / 60.0);
  }

  /**
   * The Julian Day for a given Gregorian date
   * @param year the year
   * @param month the month
   * @param day the day
   * @param hours hours
   * @return the julian day
   */
  static double julianDay(int year, int month, int day, double hours) {
    /* Equation from Astronomical Algorithms page 60 */

    // NOTE: Integer conversion is done intentionally for the purpose of decimal truncation

    int Y = month > 2 ? year : year - 1;
    int M = month > 2 ? month : month + 12;
    double D = day + (hours / 24);

    int A = Y/100;
    int B = 2 - A + (A/4);

    int i0 = (int) (365.25 * (Y + 4716));
    int i1 = (int) (30.6001 * (M + 1));
    return i0 + i1 + D + B - 1524.5;
  }

  /**
   * Julian century from the epoch.
   * @param JD the julian day
   * @return the julian century from the epoch
   */
  static double julianCentury(double JD) {
    /* Equation from Astronomical Algorithms page 163 */
    return (JD - 2451545.0) / 36525;
  }
}
