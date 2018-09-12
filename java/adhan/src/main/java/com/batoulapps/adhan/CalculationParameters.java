package com.batoulapps.adhan;

/**
 * Parameters used for PrayerTime calculation customization
 *
 * Note that, for many cases, you can use {@link CalculationMethod#getParameters()} to get a
 * pre-computed set of calculation parameters depending on one of the available
 * {@link CalculationMethod}.
 */
public class CalculationParameters {

  /**
   * The method used to do the calculation
   */
  public CalculationMethod method = CalculationMethod.OTHER;

  /**
   * The angle of the sun used to calculate fajr
   */
  public double fajrAngle;

  /**
   * The angle of the sun used to calculate isha
   */
  public double ishaAngle;

  /**
   * Minutes after Maghrib (if set, the time for Isha will be Maghrib plus IshaInterval)
   */
  public int ishaInterval;

  /**
   * The madhab used to calculate Asr
   */
  public Madhab madhab = Madhab.SHAFI;

  /**
   * Rules for placing bounds on Fajr and Isha for high latitude areas
   */
  public HighLatitudeRule highLatitudeRule = HighLatitudeRule.MIDDLE_OF_THE_NIGHT;

  /**
   * Used to optionally add or subtract a set amount of time from each prayer time
   */
  public PrayerAdjustments adjustments = new PrayerAdjustments();

  /**
   * Generate CalculationParameters from angles
   * @param fajrAngle the angle for calculating fajr
   * @param ishaAngle the angle for calculating isha
   */
  public CalculationParameters(double fajrAngle, double ishaAngle) {
    this.fajrAngle = fajrAngle;
    this.ishaAngle = ishaAngle;
  }

  /**
   * Generate CalculationParameters from fajr angle and isha interval
   * @param fajrAngle the angle for calculating fajr
   * @param ishaInterval the amount of time after maghrib to have isha
   */
  public CalculationParameters(double fajrAngle, int ishaInterval) {
    this(fajrAngle, 0.0);
    this.ishaInterval = ishaInterval;
  }

  /**
   * Generate CalculationParameters from angles and a calculation method
   * @param fajrAngle the angle for calculating fajr
   * @param ishaAngle the angle for calculating isha
   * @param method the calculation method to use
   */
  public CalculationParameters(double fajrAngle, double ishaAngle, CalculationMethod method) {
    this(fajrAngle, ishaAngle);
    this.method = method;
  }

  /**
   * Generate CalculationParameters from fajr angle, isha interval, and calculation method
   * @param fajrAngle the angle for calculating fajr
   * @param ishaInterval the amount of time after maghrib to have isha
   * @param method the calculation method to use
   */
  public CalculationParameters(double fajrAngle, int ishaInterval, CalculationMethod method) {
    this(fajrAngle, ishaInterval);
    this.method = method;
  }

  static class NightPortions {
    final double fajr;
    final double isha;

    private NightPortions(double fajr, double isha) {
      this.fajr = fajr;
      this.isha = isha;
    }
  }

  NightPortions nightPortions() {
    switch (this.highLatitudeRule) {
      case MIDDLE_OF_THE_NIGHT: {
        return new NightPortions(1.0 / 2.0, 1.0 / 2.0);
      }
      case SEVENTH_OF_THE_NIGHT: {
        return new NightPortions(1.0 / 7.0, 1.0 / 7.0);
      }
      case TWILIGHT_ANGLE: {
        return new NightPortions(this.fajrAngle / 60.0, this.ishaAngle / 60.0);
      }
      default: {
        throw new IllegalArgumentException("Invalid high latitude rule");
      }
    }
  }
}
