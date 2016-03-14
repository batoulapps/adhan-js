package com.batoulapps.adhan.data;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

public class TimeComponents {
  public final int hours;
  public final int minutes;
  public final int seconds;

  public static TimeComponents fromDouble(double value) {
    if (Double.isInfinite(value) || Double.isNaN(value)) {
      return null;
    }

    final double hours = Math.floor(value);
    final double minutes = Math.floor((value - hours) * 60.0);
    final double seconds = Math.floor((value - (hours + minutes / 60.0)) * 60 * 60);
    return new TimeComponents((int) hours, (int) minutes, (int) seconds);
  }

  private TimeComponents(int hours, int minutes, int seconds) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  public Date dateComponents(Date date) {
    Calendar calendar = GregorianCalendar.getInstance(TimeZone.getTimeZone("UTC"));
    calendar.setTime(date);
    calendar.set(Calendar.HOUR_OF_DAY, 0);
    calendar.set(Calendar.MINUTE, minutes);
    calendar.set(Calendar.SECOND, seconds);
    calendar.add(Calendar.HOUR_OF_DAY, hours);
    return calendar.getTime();
  }
}
