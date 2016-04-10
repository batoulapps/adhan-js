package com.batoulapps.adhan;

import com.batoulapps.adhan.data.DateComponents;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

public class Example {

  public static void main(String[] args) {
    final Coordinates coordinates = new Coordinates(35.78056, -78.6389);
    final DateComponents dateComponents = DateComponents.from(new Date());
    final CalculationParameters parameters =
        CalculationMethod.MUSLIM_WORLD_LEAGUE.getParameters();

    SimpleDateFormat formatter = new SimpleDateFormat("hh:mm a");
    formatter.setTimeZone(TimeZone.getTimeZone("America/New_York"));

    PrayerTimes prayerTimes = new PrayerTimes(coordinates, dateComponents, parameters);
    System.out.println("Fajr: " + formatter.format(prayerTimes.fajr));
    System.out.println("Sunrise: " + formatter.format(prayerTimes.sunrise));
    System.out.println("Dhuhr: " + formatter.format(prayerTimes.dhuhr));
    System.out.println("Asr: " + formatter.format(prayerTimes.asr));
    System.out.println("Maghrib: " + formatter.format(prayerTimes.maghrib));
    System.out.println("Isha: " + formatter.format(prayerTimes.isha));
  }
}
