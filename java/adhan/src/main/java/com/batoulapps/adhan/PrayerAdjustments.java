package com.batoulapps.adhan;

/**
 * Adjustment value for prayer times, in minutes
 * These values are added (or subtracted) from the prayer time that is calculated before
 * returning the result times.
 */
public class PrayerAdjustments {

  /**
   * Fajr offset in minutes
   */
  public int fajr;

  /**
   * Sunrise offset in minutes
   */
  public int sunrise;

  /**
   * Dhuhr offset in minutes
   */
  public int dhuhr;

  /**
   * Asr offset in minutes
   */
  public int asr;

  /**
   * Maghrib offset in minutes
   */
  public int maghrib;

  /**
   * Isha offset in minutes
   */
  public int isha;

  /**
   * Gets a PrayerAdjustments object with all offsets set to 0
   */
  public PrayerAdjustments() {
    this(0, 0, 0, 0, 0, 0);
  }

  /**
   * Gets a PrayerAdjustments object to offset prayer times
   * @param fajr offset from fajr in minutes
   * @param sunrise offset from sunrise in minutes
   * @param dhuhr offset from dhuhr in minutes
   * @param asr offset from asr in minutes
   * @param maghrib offset from maghrib in minutes
   * @param isha offset from isha in minutes
   */
  public PrayerAdjustments(int fajr, int sunrise, int dhuhr, int asr, int maghrib, int isha) {
    this.fajr = fajr;
    this.sunrise = sunrise;
    this.dhuhr = dhuhr;
    this.asr = asr;
    this.maghrib = maghrib;
    this.isha = isha;
  }
}
