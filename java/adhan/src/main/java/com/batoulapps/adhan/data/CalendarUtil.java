package com.batoulapps.adhan.data;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

public class CalendarUtil {
  /**
   * Whether or not a year is a leap year (has 366 days)
   * @param year the year
   * @return whether or not its a leap year
   */
  public static boolean isLeapYear(int year) {
    return year % 4 == 0 && !(year % 100 == 0 && year % 400 != 0);
  }

  /**
   * Date and time with a rounded minute
   * This returns a date with the seconds rounded and added to the minute
   * @param when the date and time
   * @return the date and time with 0 seconds and minutes including rounded seconds
   */
  public static Date roundedMinute(Date when) {
    Calendar calendar = GregorianCalendar.getInstance(TimeZone.getTimeZone("UTC"));
    calendar.setTime(when);
    double minute = calendar.get(Calendar.MINUTE);
    double second = calendar.get(Calendar.SECOND);
    calendar.set(Calendar.MINUTE, (int) (minute + Math.round(second / 60)));
    calendar.set(Calendar.SECOND, 0);
    return calendar.getTime();
  }

  /**
   * Gets a date for the particular date
   * @param components the date components
   * @return the date with a time set to 00:00:00 at utc
   */
  public static Date resolveTime(DateComponents components) {
    return resolveTime(components.year, components.month, components.day);
  }

  /**
   * Add an offset to a particular day
   * @param when the original date
   * @param amount the amount to add
   * @param field the field to add it to (from {@link java.util.Calendar}'s fields).
   * @return the date with the offset added
   */
  public static Date add(Date when, int amount, int field) {
    Calendar calendar = GregorianCalendar.getInstance(TimeZone.getTimeZone("UTC"));
    calendar.setTime(when);
    calendar.add(field, amount);
    return calendar.getTime();
  }

  /**
   * Gets a date for the particular date
   * @param year the year
   * @param month the month
   * @param day the day
   * @return the date with a time set to 00:00:00 at utc
   */
  private static Date resolveTime(int year, int month, int day) {
    Calendar calendar = GregorianCalendar.getInstance(TimeZone.getTimeZone("UTC"));
    //noinspection MagicConstant
    calendar.set(year, month - 1, day, 0, 0, 0);
    return calendar.getTime();
  }
}
