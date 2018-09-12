package com.batoulapps.adhan.internal;

import com.batoulapps.adhan.data.CalendarUtil;
import com.batoulapps.adhan.data.DateComponents;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

public class TestUtils {

  public static Date makeDate(int year, int month, int day) {
    return makeDate(year, month, day, 0, 0, 0);
  }

  static Date makeDate(int year, int month, int day, int hour, int minute) {
    return makeDate(year, month, day, hour, minute, 0);
  }

  static Date makeDate(int year, int month, int day, int hour, int minute, int second) {
    Calendar calendar = GregorianCalendar.getInstance(TimeZone.getTimeZone("UTC"));
    //noinspection MagicConstant
    calendar.set(year, month - 1, day, hour, minute, second);
    return calendar.getTime();
  }

  public static int getDayOfYear(Date date) {
    Calendar calendar = GregorianCalendar.getInstance(TimeZone.getTimeZone("UTC"));
    calendar.setTime(date);
    return calendar.get(Calendar.DAY_OF_YEAR);
  }

  public static DateComponents getDateComponents(String date) {
    String[] pieces = date.split("-");
    int year = Integer.parseInt(pieces[0]);
    int month = Integer.parseInt(pieces[1]);
    int day = Integer.parseInt(pieces[2]);
    return new DateComponents(year, month, day);
  }

  public static Date addSeconds(Date date, int seconds) {
    return CalendarUtil.add(date, seconds, Calendar.SECOND);
  }

  static Date makeDateWithOffset(int year, int month, int day, int offset, int unit) {
    Calendar calendar = GregorianCalendar.getInstance(TimeZone.getTimeZone("UTC"));
    //noinspection MagicConstant
    calendar.set(year, month - 1, day);
    calendar.add(unit, offset);
    return calendar.getTime();
  }
}
