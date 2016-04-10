package com.batoulapps.adhan.data;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DateComponents {
  public final int year;
  public final int month;
  public final int day;

  /**
   * Convenience method that returns a DateComponents from a given Date
   * @param date the date
   * @return the DateComponents (according to the default device timezone)
   */
  public static DateComponents from(Date date) {
    Calendar calendar = GregorianCalendar.getInstance();
    calendar.setTime(date);
    return new DateComponents(calendar.get(Calendar.YEAR),
        calendar.get(Calendar.MONTH) + 1, calendar.get(Calendar.DAY_OF_MONTH));
  }

  public DateComponents(int year, int month, int day) {
    this.year = year;
    this.month = month;
    this.day = day;
  }
}
