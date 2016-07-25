package com.batoulapps.adhan;

import com.batoulapps.adhan.data.DateComponents;
import com.batoulapps.adhan.internal.TestUtils;

import org.junit.Test;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import static com.google.common.truth.Truth.assertThat;

public class PrayerTimesTest {

  @Test
  public void testDaysSinceSolstice() {
    daysSinceSolsticeTest(11, /* year */ 2016, /* month */ 1, /* day */ 1, /* latitude */ 1);
    daysSinceSolsticeTest(10, /* year */ 2015, /* month */ 12, /* day */ 31, /* latitude */ 1);
    daysSinceSolsticeTest(10, /* year */ 2016, /* month */ 12, /* day */ 31, /* latitude */ 1);
    daysSinceSolsticeTest(0, /* year */ 2016, /* month */ 12, /* day */ 21, /* latitude */ 1);
    daysSinceSolsticeTest(1, /* year */ 2016, /* month */ 12, /* day */ 22, /* latitude */ 1);
    daysSinceSolsticeTest(71, /* year */ 2016, /* month */ 3, /* day */ 1, /* latitude */ 1);
    daysSinceSolsticeTest(70, /* year */ 2015, /* month */ 3, /* day */ 1, /* latitude */ 1);
    daysSinceSolsticeTest(365, /* year */ 2016, /* month */ 12, /* day */ 20, /* latitude */ 1);
    daysSinceSolsticeTest(364, /* year */ 2015, /* month */ 12, /* day */ 20, /* latitude */ 1);

    daysSinceSolsticeTest(0, /* year */ 2015, /* month */ 6, /* day */ 21, /* latitude */ -1);
    daysSinceSolsticeTest(0, /* year */ 2016, /* month */ 6, /* day */ 21, /* latitude */ -1);
    daysSinceSolsticeTest(364, /* year */ 2015, /* month */ 6, /* day */ 20, /* latitude */ -1);
    daysSinceSolsticeTest(365, /* year */ 2016, /* month */ 6, /* day */ 20, /* latitude */ -1);
  }

  private void daysSinceSolsticeTest(int value, int year, int month, int day, double latitude) {
    // For Northern Hemisphere start from December 21
    // (DYY=0 for December 21, and counting forward, DYY=11 for January 1 and so on).
    // For Southern Hemisphere start from June 21
    // (DYY=0 for June 21, and counting forward)
    Date date = TestUtils.makeDate(year, month, day);
    int dayOfYear = TestUtils.getDayOfYear(date);
    assertThat(PrayerTimes.daysSinceSolstice(dayOfYear, date.getYear(), latitude)).isEqualTo(value);
  }

  @Test
  public void testPrayerTimes() {
    DateComponents date = new DateComponents(2015, 7, 12);
    CalculationParameters params = CalculationMethod.NORTH_AMERICA.getParameters();
    params.madhab = Madhab.HANAFI;

    Coordinates coordinates = new Coordinates(35.7750, -78.6336);
    PrayerTimes prayerTimes = new PrayerTimes(coordinates, date, params);

    SimpleDateFormat formatter = new SimpleDateFormat("hh:mm a");
    formatter.setTimeZone(TimeZone.getTimeZone("America/New_York"));

    assertThat(formatter.format(prayerTimes.fajr)).isEqualTo("04:42 AM");
    assertThat(formatter.format(prayerTimes.sunrise)).isEqualTo("06:08 AM");
    assertThat(formatter.format(prayerTimes.dhuhr)).isEqualTo("01:21 PM");
    assertThat(formatter.format(prayerTimes.asr)).isEqualTo("06:22 PM");
    assertThat(formatter.format(prayerTimes.maghrib)).isEqualTo("08:32 PM");
    assertThat(formatter.format(prayerTimes.isha)).isEqualTo("09:57 PM");
  }

  @Test
  public void testOffsets() {
    DateComponents date = new DateComponents(2015, 12, 1);
    Coordinates coordinates = new Coordinates(35.7750, -78.6336);

    SimpleDateFormat formatter = new SimpleDateFormat("hh:mm a");
    formatter.setTimeZone(TimeZone.getTimeZone("America/New_York"));
    CalculationParameters parameters = CalculationMethod.MUSLIM_WORLD_LEAGUE.getParameters();

    PrayerTimes prayerTimes = new PrayerTimes(coordinates, date, parameters);
    assertThat(formatter.format(prayerTimes.fajr)).isEqualTo("05:35 AM");
    assertThat(formatter.format(prayerTimes.sunrise)).isEqualTo("07:06 AM");
    assertThat(formatter.format(prayerTimes.dhuhr)).isEqualTo("12:05 PM");
    assertThat(formatter.format(prayerTimes.asr)).isEqualTo("02:42 PM");
    assertThat(formatter.format(prayerTimes.maghrib)).isEqualTo("05:01 PM");
    assertThat(formatter.format(prayerTimes.isha)).isEqualTo("06:26 PM");

    parameters.adjustments.fajr = 10;
    parameters.adjustments.sunrise = 10;
    parameters.adjustments.dhuhr = 10;
    parameters.adjustments.asr = 10;
    parameters.adjustments.maghrib = 10;
    parameters.adjustments.isha = 10;

    prayerTimes = new PrayerTimes(coordinates, date, parameters);
    assertThat(formatter.format(prayerTimes.fajr)).isEqualTo("05:45 AM");
    assertThat(formatter.format(prayerTimes.sunrise)).isEqualTo("07:16 AM");
    assertThat(formatter.format(prayerTimes.dhuhr)).isEqualTo("12:15 PM");
    assertThat(formatter.format(prayerTimes.asr)).isEqualTo("02:52 PM");
    assertThat(formatter.format(prayerTimes.maghrib)).isEqualTo("05:11 PM");
    assertThat(formatter.format(prayerTimes.isha)).isEqualTo("06:36 PM");

    parameters.adjustments = new PrayerAdjustments();
    prayerTimes = new PrayerTimes(coordinates, date, parameters);
    assertThat(formatter.format(prayerTimes.fajr)).isEqualTo("05:35 AM");
    assertThat(formatter.format(prayerTimes.sunrise)).isEqualTo("07:06 AM");
    assertThat(formatter.format(prayerTimes.dhuhr)).isEqualTo("12:05 PM");
    assertThat(formatter.format(prayerTimes.asr)).isEqualTo("02:42 PM");
    assertThat(formatter.format(prayerTimes.maghrib)).isEqualTo("05:01 PM");
    assertThat(formatter.format(prayerTimes.isha)).isEqualTo("06:26 PM");
  }

  @Test
  public void testMoonsightingMethod() {
    DateComponents date = new DateComponents(2016, 1, 31);
    Coordinates coordinates = new Coordinates(35.7750, -78.6336);
    PrayerTimes prayerTimes = new PrayerTimes(
        coordinates, date, CalculationMethod.MOON_SIGHTING_COMMITTEE.getParameters());

    SimpleDateFormat formatter = new SimpleDateFormat("hh:mm a");
    formatter.setTimeZone(TimeZone.getTimeZone("America/New_York"));

    assertThat(formatter.format(prayerTimes.fajr)).isEqualTo("05:48 AM");
    assertThat(formatter.format(prayerTimes.sunrise)).isEqualTo("07:16 AM");
    assertThat(formatter.format(prayerTimes.dhuhr)).isEqualTo("12:33 PM");
    assertThat(formatter.format(prayerTimes.asr)).isEqualTo("03:20 PM");
    assertThat(formatter.format(prayerTimes.maghrib)).isEqualTo("05:43 PM");
    assertThat(formatter.format(prayerTimes.isha)).isEqualTo("07:05 PM");
  }

  @Test
  public void testMoonsightingMethodHighLat() {
    // Values from http://www.moonsighting.com/pray.php
    DateComponents date = new DateComponents(2016, 1, 1);
    CalculationParameters parameters = CalculationMethod.MOON_SIGHTING_COMMITTEE.getParameters();
    parameters.madhab = Madhab.HANAFI;
    Coordinates coordinates = new Coordinates(59.9094, 10.7349);

    PrayerTimes prayerTimes = new PrayerTimes(coordinates, date, parameters);

    SimpleDateFormat formatter = new SimpleDateFormat("hh:mm a");
    formatter.setTimeZone(TimeZone.getTimeZone("Europe/Oslo"));

    assertThat(formatter.format(prayerTimes.fajr)).isEqualTo("07:34 AM");
    assertThat(formatter.format(prayerTimes.sunrise)).isEqualTo("09:19 AM");
    assertThat(formatter.format(prayerTimes.dhuhr)).isEqualTo("12:25 PM");
    assertThat(formatter.format(prayerTimes.asr)).isEqualTo("01:36 PM");
    assertThat(formatter.format(prayerTimes.maghrib)).isEqualTo("03:25 PM");
    assertThat(formatter.format(prayerTimes.isha)).isEqualTo("05:02 PM");
  }

  @Test
  public void testTimeForPrayer() {
    DateComponents components = new DateComponents(2016, 7, 1);
    CalculationParameters parameters = CalculationMethod.MUSLIM_WORLD_LEAGUE.getParameters();
    parameters.madhab = Madhab.HANAFI;
    parameters.highLatitudeRule = HighLatitudeRule.TWILIGHT_ANGLE;
    Coordinates coordinates = new Coordinates(59.9094, 10.7349);

    PrayerTimes p = new PrayerTimes(coordinates, components, parameters);
    assertThat(p.fajr).isEqualTo(p.timeForPrayer(Prayer.FAJR));
    assertThat(p.sunrise).isEqualTo(p.timeForPrayer(Prayer.SUNRISE));
    assertThat(p.dhuhr).isEqualTo(p.timeForPrayer(Prayer.DHUHR));
    assertThat(p.asr).isEqualTo(p.timeForPrayer(Prayer.ASR));
    assertThat(p.maghrib).isEqualTo(p.timeForPrayer(Prayer.MAGHRIB));
    assertThat(p.isha).isEqualTo(p.timeForPrayer(Prayer.ISHA));
    assertThat(p.timeForPrayer(Prayer.NONE)).isNull();
  }

  @Test
  public void testCurrentPrayer() {
    DateComponents components = new DateComponents(2015, 9, 1);
    CalculationParameters parameters = CalculationMethod.KARACHI.getParameters();
    parameters.madhab = Madhab.HANAFI;
    parameters.highLatitudeRule = HighLatitudeRule.TWILIGHT_ANGLE;
    Coordinates coordinates = new Coordinates(33.720817, 73.090032);

    PrayerTimes p = new PrayerTimes(coordinates, components, parameters);

    assertThat(p.currentPrayer(TestUtils.addSeconds(p.fajr, -1))).isEqualTo(Prayer.NONE);
    assertThat(p.currentPrayer(p.fajr)).isEqualTo(Prayer.FAJR);
    assertThat(p.currentPrayer(TestUtils.addSeconds(p.fajr, 1))).isEqualTo(Prayer.FAJR);
    assertThat(p.currentPrayer(TestUtils.addSeconds(p.sunrise, 1))).isEqualTo(Prayer.SUNRISE);
    assertThat(p.currentPrayer(TestUtils.addSeconds(p.dhuhr, 1))).isEqualTo(Prayer.DHUHR);
    assertThat(p.currentPrayer(TestUtils.addSeconds(p.asr, 1))).isEqualTo(Prayer.ASR);
    assertThat(p.currentPrayer(TestUtils.addSeconds(p.maghrib, 1))).isEqualTo(Prayer.MAGHRIB);
    assertThat(p.currentPrayer(TestUtils.addSeconds(p.isha, 1))).isEqualTo(Prayer.ISHA);
  }

  @Test
  public void testNextPrayer() {
    DateComponents components = new DateComponents(2015, 9, 1);
    CalculationParameters parameters = CalculationMethod.KARACHI.getParameters();
    parameters.madhab = Madhab.HANAFI;
    parameters.highLatitudeRule = HighLatitudeRule.TWILIGHT_ANGLE;
    Coordinates coordinates = new Coordinates(33.720817, 73.090032);

    PrayerTimes p = new PrayerTimes(coordinates, components, parameters);

    assertThat(p.nextPrayer(TestUtils.addSeconds(p.fajr, -1))).isEqualTo(Prayer.FAJR);
    assertThat(p.nextPrayer(p.fajr)).isEqualTo(Prayer.SUNRISE);
    assertThat(p.nextPrayer(TestUtils.addSeconds(p.fajr, 1))).isEqualTo(Prayer.SUNRISE);
    assertThat(p.nextPrayer(TestUtils.addSeconds(p.sunrise, 1))).isEqualTo(Prayer.DHUHR);
    assertThat(p.nextPrayer(TestUtils.addSeconds(p.dhuhr, 1))).isEqualTo(Prayer.ASR);
    assertThat(p.nextPrayer(TestUtils.addSeconds(p.asr, 1))).isEqualTo(Prayer.MAGHRIB);
    assertThat(p.nextPrayer(TestUtils.addSeconds(p.maghrib, 1))).isEqualTo(Prayer.ISHA);
    assertThat(p.nextPrayer(TestUtils.addSeconds(p.isha, 1))).isEqualTo(Prayer.NONE);
  }
}
